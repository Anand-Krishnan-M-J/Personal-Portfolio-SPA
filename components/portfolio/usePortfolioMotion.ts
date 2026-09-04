import { RefObject, useEffect } from "react";

import {
  advanceRevealCommitFrames,
  getPortfolioMotionTier,
  getPendingRevealCommitMode,
  getRevealIntersectionState,
  getFrameIndependentBlend,
  shouldSnapMotionJump,
} from "./motionMath";

type ConnectionPreference = EventTarget & {
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: ConnectionPreference;
};

type MotionValue = {
  current: number;
  initialized: boolean;
  lastWritten: number;
  target: number;
};

const MOTION_RESPONSE_PER_SECOND = 28;
const PROGRESS_EPSILON = 0.0001;
const SCENE_MOTION_PROPERTIES = [
  "--scene-progress",
  "--scene-shift",
  "--scene-shift-reverse",
  "--scene-shift-small",
  "--scene-scale",
  "--scene-opacity",
] as const;

const clampProgress = (value: number) => Math.min(Math.max(value, 0), 1);

const createMotionValue = (): MotionValue => ({
  current: 0,
  initialized: false,
  lastWritten: Number.NaN,
  target: 0,
});

const resetMotionValue = (value: MotionValue) => {
  value.current = 0;
  value.initialized = false;
  value.lastWritten = Number.NaN;
  value.target = 0;
};

const approach = (value: MotionValue, blend: number) => {
  if (!value.initialized) {
    value.current = value.target;
    value.initialized = true;
    return true;
  }

  const distance = value.target - value.current;
  if (
    Math.abs(distance) <= PROGRESS_EPSILON ||
    shouldSnapMotionJump(distance)
  ) {
    value.current = value.target;
    return true;
  }

  value.current += distance * blend;
  return false;
};

const usePortfolioMotion = (rootRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lightweightMotion = window.matchMedia(
      "(max-width: 760px), (hover: none) and (pointer: coarse)",
    );
    const connection = (navigator as NavigatorWithConnection).connection;
    const revealItems = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const scrollScenes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-scroll-scene]"),
    );
    const scrollAmbient = root.querySelector<HTMLElement>(
      "[data-scroll-ambient]",
    );
    const scrollRail = root.querySelector<HTMLElement>("[data-scroll-rail]");
    const activeScrollScenes = new Set<HTMLElement>();
    const instantRevealItems = new Set<Element>();
    const pendingRevealItems = new Set<HTMLElement>();
    const sceneMotion = new Map<HTMLElement, MotionValue>();
    const pageMotion = createMotionValue();

    let animationFrame = 0;
    let availableScroll = 0;
    let instantRevealCommitFrames = 0;
    let lastFrameTime = 0;
    let motionActive = false;
    let needsMeasurement = true;
    let pendingRevealCommits: Array<{
      instant: boolean;
      item: HTMLElement;
    }> = [];
    let scrollExtentDirty = true;
    let scrollSceneObserver: IntersectionObserver | null = null;
    let viewportHeight = 0;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        let requiresInstantCommit = false;
        entries.forEach((entry) => {
          const item = entry.target as HTMLElement;
          if (item.getAttribute("data-visible") === "true") {
            pendingRevealItems.delete(item);
            revealObserver.unobserve(item);
            return;
          }
          const revealState = getRevealIntersectionState(
            entry.isIntersecting,
            entry.boundingClientRect.bottom,
            entry.rootBounds?.top,
          );
          if (revealState === "pending") return;
          if (revealState === "passed") {
            item.setAttribute("data-reveal-instant", "true");
            instantRevealItems.add(item);
            requiresInstantCommit = true;
          }
          item.setAttribute("data-visible", "true");
          pendingRevealItems.delete(item);
          revealObserver.unobserve(item);
        });
        if (requiresInstantCommit) {
          instantRevealCommitFrames = 2;
          requestFrame();
        }
      },
      { rootMargin: "0px 0px -9%", threshold: 0.08 },
    );

    const writePageProgress = () => {
      if (Math.abs(pageMotion.current - pageMotion.lastWritten) < 0.00001) {
        return;
      }

      const progress = pageMotion.current;
      scrollRail?.style.setProperty(
        "transform",
        `scaleY(${progress.toFixed(5)})`,
      );
      scrollAmbient?.style.setProperty(
        "transform",
        `translate3d(0, ${((progress - 0.5) * 160).toFixed(2)}px, 0) scale(1.08)`,
      );
      pageMotion.lastWritten = progress;
    };

    const writeSceneProgress = (scene: HTMLElement, progress: number) => {
      const motion = sceneMotion.get(scene);
      if (
        motion &&
        Math.abs(progress - motion.lastWritten) < PROGRESS_EPSILON
      ) {
        return;
      }

      const sceneFocus = Math.sin(progress * Math.PI);
      scene.style.setProperty("--scene-progress", progress.toFixed(5));
      scene.style.setProperty(
        "--scene-shift",
        `${((progress - 0.5) * 180).toFixed(2)}px`,
      );
      scene.style.setProperty(
        "--scene-shift-reverse",
        `${((0.5 - progress) * 132).toFixed(2)}px`,
      );
      scene.style.setProperty(
        "--scene-shift-small",
        `${((progress - 0.5) * 44).toFixed(2)}px`,
      );
      scene.style.setProperty(
        "--scene-scale",
        (0.96 + sceneFocus * 0.08).toFixed(5),
      );
      scene.style.setProperty(
        "--scene-opacity",
        (0.24 + sceneFocus * 0.5).toFixed(5),
      );
      if (motion) motion.lastWritten = progress;
    };

    const measureTargets = () => {
      const isFullMotion = !lightweightMotion.matches;
      if (!isFullMotion && pendingRevealItems.size === 0) {
        pendingRevealCommits = [];
        needsMeasurement = false;
        return;
      }

      if (scrollExtentDirty) {
        viewportHeight = window.innerHeight;
        availableScroll = Math.max(
          document.documentElement.scrollHeight - viewportHeight,
          0,
        );
        scrollExtentDirty = false;
      }
      const scrollTop = window.scrollY;

      // All layout reads happen before the frame performs any style writes.
      // Lightweight mode intentionally limits this pass to reveal correctness.
      const sceneMeasurements = isFullMotion
        ? Array.from(activeScrollScenes, (scene) => ({
            bounds: scene.getBoundingClientRect(),
            scene,
          }))
        : [];
      const revealMeasurements = Array.from(pendingRevealItems, (item) => ({
        bounds: item.getBoundingClientRect(),
        item,
      }));

      if (isFullMotion) {
        pageMotion.target = clampProgress(
          availableScroll > 0 ? scrollTop / availableScroll : 0,
        );
      }

      sceneMeasurements.forEach(({ bounds, scene }) => {
        const sceneRange = viewportHeight + bounds.height;
        const target = clampProgress(
          sceneRange > 0 ? (viewportHeight - bounds.top) / sceneRange : 0,
        );
        const motion = sceneMotion.get(scene) ?? createMotionValue();
        motion.target = target;
        sceneMotion.set(scene, motion);
      });

      pendingRevealCommits = revealMeasurements.flatMap(({ bounds, item }) => {
        const commitMode = getPendingRevealCommitMode({
          availableScroll,
          scrollTop,
          targetBottom: bounds.bottom,
          targetTop: bounds.top,
          viewportHeight,
        });
        return commitMode ? [{ instant: commitMode === "instant", item }] : [];
      });

      needsMeasurement = false;
    };

    const requestFrame = () => {
      if (
        animationFrame ||
        !motionActive ||
        document.hidden ||
        root.hasAttribute("data-inactive")
      ) {
        return;
      }
      if (!lightweightMotion.matches && !lastFrameTime) {
        lastFrameTime = performance.now();
      }
      animationFrame = window.requestAnimationFrame(runFrame);
    };

    const runFrame = (timestamp: number) => {
      animationFrame = 0;
      if (!motionActive || document.hidden) return;

      if (needsMeasurement) measureTargets();

      const isFullMotion = !lightweightMotion.matches;
      let settled = true;

      if (isFullMotion) {
        const elapsed = Math.max(timestamp - lastFrameTime, 0);
        lastFrameTime = timestamp;
        const blend = getFrameIndependentBlend(
          elapsed,
          MOTION_RESPONSE_PER_SECOND,
        );

        settled = approach(pageMotion, blend);

        // Layout was measured above; this block contains style writes only.
        writePageProgress();
        activeScrollScenes.forEach((scene) => {
          const motion = sceneMotion.get(scene);
          if (!motion) return;
          settled = approach(motion, blend) && settled;
          writeSceneProgress(scene, motion.current);
        });
      }

      if (pendingRevealCommits.length > 0) {
        let hasInstantReveal = false;
        pendingRevealCommits.forEach(({ instant, item }) => {
          if (!pendingRevealItems.delete(item)) return;
          if (instant) {
            item.setAttribute("data-reveal-instant", "true");
            instantRevealItems.add(item);
            hasInstantReveal = true;
          }
          item.setAttribute("data-visible", "true");
          revealObserver.unobserve(item);
        });
        pendingRevealCommits = [];
        if (hasInstantReveal) instantRevealCommitFrames = 2;
      }

      if (instantRevealCommitFrames > 0) {
        const commitStep = advanceRevealCommitFrames(instantRevealCommitFrames);
        instantRevealCommitFrames = commitStep.remainingFrames;
        if (commitStep.shouldClear) {
          instantRevealItems.forEach((item) =>
            item.removeAttribute("data-reveal-instant"),
          );
          instantRevealItems.clear();
        }
      }

      if (
        (isFullMotion && !settled) ||
        needsMeasurement ||
        instantRevealCommitFrames > 0
      ) {
        requestFrame();
      } else lastFrameTime = 0;
    };

    const invalidateScrollPosition = () => {
      if (
        lightweightMotion.matches &&
        pendingRevealItems.size === 0 &&
        instantRevealCommitFrames === 0
      ) {
        return;
      }
      needsMeasurement = true;
      requestFrame();
    };

    const handleScroll = () => {
      // Refresh once at the start of each gesture so late layout outside the
      // observed shell cannot leave the document-level progress rail stale.
      if (!lightweightMotion.matches && !animationFrame && !lastFrameTime) {
        scrollExtentDirty = true;
      }
      invalidateScrollPosition();
    };

    const invalidateLayout = () => {
      scrollExtentDirty = true;
      invalidateScrollPosition();
    };

    const invalidateVisualViewport = () => {
      // Mobile browser chrome can resize only the visual viewport many times
      // during a fling. The scene math uses the layout viewport, so avoid a
      // redundant document-height read when window.innerHeight did not move.
      if (Math.abs(window.innerHeight - viewportHeight) < 1) return;
      invalidateLayout();
    };

    const layoutObserver = new ResizeObserver(invalidateLayout);

    const stopAnimationFrame = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastFrameTime = 0;
    };

    const resetScrollPresentation = () => {
      scrollAmbient?.style.removeProperty("transform");
      scrollRail?.style.removeProperty("transform");
      activeScrollScenes.clear();
      sceneMotion.clear();
      scrollScenes.forEach((scene) => {
        scene.removeAttribute("data-scroll-active");
        SCENE_MOTION_PROPERTIES.forEach((property) =>
          scene.style.removeProperty(property),
        );
      });
      resetMotionValue(pageMotion);
    };

    const stopFullScrollMotion = () => {
      scrollSceneObserver?.disconnect();
      scrollSceneObserver = null;
      resetScrollPresentation();
    };

    const startFullScrollMotion = () => {
      scrollSceneObserver?.disconnect();
      resetScrollPresentation();
      const observer = new IntersectionObserver(
        (entries) => {
          if (
            scrollSceneObserver !== observer ||
            !motionActive ||
            lightweightMotion.matches
          ) {
            return;
          }
          entries.forEach((entry) => {
            const scene = entry.target as HTMLElement;
            scene.toggleAttribute("data-scroll-active", entry.isIntersecting);
            if (entry.isIntersecting) activeScrollScenes.add(scene);
            else activeScrollScenes.delete(scene);
          });
          invalidateScrollPosition();
        },
        { rootMargin: "24% 0px", threshold: 0 },
      );
      scrollSceneObserver = observer;
      scrollScenes.forEach((scene) => observer.observe(scene));
    };

    const syncLightweightMotion = () => {
      if (!motionActive) return;
      stopAnimationFrame();
      pendingRevealCommits = [];
      if (lightweightMotion.matches) stopFullScrollMotion();
      else startFullScrollMotion();
      scrollExtentDirty = true;
      needsMeasurement = true;
      requestFrame();
    };

    const updateVisibility = () => {
      root.toggleAttribute("data-inactive", document.hidden);
      if (document.hidden) {
        stopAnimationFrame();
        return;
      }
      invalidateLayout();
    };

    const stopMotionController = () => {
      motionActive = false;
      revealObserver.disconnect();
      scrollSceneObserver?.disconnect();
      scrollSceneObserver = null;
      activeScrollScenes.clear();
      instantRevealItems.forEach((item) =>
        item.removeAttribute("data-reveal-instant"),
      );
      instantRevealItems.clear();
      instantRevealCommitFrames = 0;
      pendingRevealItems.clear();
      pendingRevealCommits = [];
      sceneMotion.clear();
      scrollScenes.forEach((scene) =>
        scene.removeAttribute("data-scroll-active"),
      );
      layoutObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", invalidateLayout);
      lightweightMotion.removeEventListener("change", syncLightweightMotion);
      window.visualViewport?.removeEventListener(
        "resize",
        invalidateVisualViewport,
      );
      stopAnimationFrame();
      resetMotionValue(pageMotion);
      needsMeasurement = true;
      scrollExtentDirty = true;
    };

    const startMotionController = () => {
      if (motionActive) return;
      motionActive = true;
      root.dataset.motion = "ready";
      pendingRevealItems.clear();
      revealItems
        .filter((item) => item.getAttribute("data-visible") !== "true")
        .forEach((item) => {
          pendingRevealItems.add(item);
          revealObserver.observe(item);
        });
      if (lightweightMotion.matches) stopFullScrollMotion();
      else startFullScrollMotion();
      layoutObserver.observe(root);
      window.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      window.addEventListener("resize", invalidateLayout, {
        passive: true,
      });
      lightweightMotion.addEventListener("change", syncLightweightMotion);
      window.visualViewport?.addEventListener(
        "resize",
        invalidateVisualViewport,
        { passive: true },
      );
      invalidateLayout();
    };

    const syncMotionPreference = () => {
      const tier = getPortfolioMotionTier({
        lightweightMotion: lightweightMotion.matches,
        reducedMotion: reducedMotion.matches,
        saveData: connection?.saveData,
      });
      if (tier === "reduced") {
        stopMotionController();
        root.dataset.motion = "reduced";
        scrollScenes.forEach((scene) => {
          scene.style.setProperty("--scene-progress", "1");
          scene.style.setProperty("--scene-shift", "0px");
          scene.style.setProperty("--scene-shift-reverse", "0px");
          scene.style.setProperty("--scene-shift-small", "0px");
          scene.style.setProperty("--scene-scale", "1");
          scene.style.setProperty("--scene-opacity", "0.45");
        });
        revealItems.forEach((item) =>
          item.setAttribute("data-visible", "true"),
        );
        return;
      }
      startMotionController();
    };

    updateVisibility();
    syncMotionPreference();
    document.addEventListener("visibilitychange", updateVisibility);
    reducedMotion.addEventListener("change", syncMotionPreference);
    connection?.addEventListener("change", syncMotionPreference);

    return () => {
      stopMotionController();
      document.removeEventListener("visibilitychange", updateVisibility);
      reducedMotion.removeEventListener("change", syncMotionPreference);
      connection?.removeEventListener("change", syncMotionPreference);
    };
  }, [rootRef]);
};

export default usePortfolioMotion;
