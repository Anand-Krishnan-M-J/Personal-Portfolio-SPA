const MAX_FRAME_DELTA_MS = 50;
const FAST_SCROLL_SNAP_THRESHOLD = 0.22;

export type PortfolioMotionTier = "full" | "lightweight" | "reduced";

export const getPortfolioMotionTier = ({
  lightweightMotion,
  reducedMotion,
  saveData,
}: {
  lightweightMotion: boolean;
  reducedMotion: boolean;
  saveData?: boolean;
}): PortfolioMotionTier => {
  if (reducedMotion || saveData) return "reduced";
  return lightweightMotion ? "lightweight" : "full";
};

/**
 * Converts a per-second response into a time-based interpolation blend.
 * Equal elapsed time therefore converges equally at 60, 120, or 144 Hz.
 */
export const getFrameIndependentBlend = (
  elapsedMs: number,
  responsePerSecond = 28,
) => {
  const safeDelta = Math.min(
    Math.max(Number.isFinite(elapsedMs) ? elapsedMs : 0, 0),
    MAX_FRAME_DELTA_MS,
  );
  const safeResponse = Math.max(
    Number.isFinite(responsePerSecond) ? responsePerSecond : 0,
    0,
  );

  return 1 - Math.exp(-(safeDelta / 1000) * safeResponse);
};

/**
 * IntersectionObserver may coalesce a fast downward viewport crossing into a
 * final non-intersecting entry. Content already above the viewport must not
 * remain visually hidden in that case.
 */
export type RevealIntersectionState = "intersecting" | "passed" | "pending";

export const getRevealIntersectionState = (
  isIntersecting: boolean,
  targetBottom: number,
  viewportTop = 0,
): RevealIntersectionState => {
  if (isIntersecting) return "intersecting";
  return targetBottom <= viewportTop ? "passed" : "pending";
};

export const shouldCommitPendingReveal = (
  targetBottom: number,
  viewportTop = 0,
) => getRevealIntersectionState(false, targetBottom, viewportTop) === "passed";

export type PendingRevealCommitMode = "instant" | "visible" | null;

export const getPendingRevealCommitMode = ({
  availableScroll,
  scrollTop,
  targetBottom,
  targetTop,
  viewportHeight,
}: {
  availableScroll: number;
  scrollTop: number;
  targetBottom: number;
  targetTop: number;
  viewportHeight: number;
}): PendingRevealCommitMode => {
  if (shouldCommitPendingReveal(targetBottom)) return "instant";

  const isAtDocumentEnd = availableScroll - scrollTop <= 1;
  const isInViewport = targetBottom > 0 && targetTop < viewportHeight;
  return isAtDocumentEnd && isInViewport ? "visible" : null;
};

/** Native content has already moved after a large fling, so visual atmosphere
 * should catch up immediately rather than visibly trailing several frames. */
export const shouldSnapMotionJump = (
  distance: number,
  threshold = FAST_SCROLL_SNAP_THRESHOLD,
) =>
  Number.isFinite(distance) &&
  Number.isFinite(threshold) &&
  threshold >= 0 &&
  Math.abs(distance) >= threshold;

export const advanceRevealCommitFrames = (remainingFrames: number) => {
  const normalizedFrames = Math.max(
    Number.isFinite(remainingFrames) ? Math.trunc(remainingFrames) : 0,
    0,
  );
  const nextFrames = Math.max(normalizedFrames - 1, 0);

  return {
    remainingFrames: nextFrames,
    shouldClear: normalizedFrames === 1,
  };
};
