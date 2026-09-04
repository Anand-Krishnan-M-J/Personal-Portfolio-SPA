import assert from "node:assert/strict";
import test from "node:test";

import {
  advanceRevealCommitFrames,
  getPortfolioMotionTier,
  getPendingRevealCommitMode,
  getRevealIntersectionState,
  getFrameIndependentBlend,
  shouldCommitPendingReveal,
  shouldSnapMotionJump,
} from "../components/portfolio/motionMath";

test("motion preferences select the least expensive safe runtime tier", () => {
  assert.equal(
    getPortfolioMotionTier({
      lightweightMotion: false,
      reducedMotion: false,
    }),
    "full",
  );
  assert.equal(
    getPortfolioMotionTier({
      lightweightMotion: true,
      reducedMotion: false,
    }),
    "lightweight",
  );
  assert.equal(
    getPortfolioMotionTier({
      lightweightMotion: false,
      reducedMotion: true,
    }),
    "reduced",
  );
  assert.equal(
    getPortfolioMotionTier({
      lightweightMotion: true,
      reducedMotion: false,
      saveData: true,
    }),
    "reduced",
  );
});

const convergeForOneSecond = (refreshRate: number) => {
  const frameDuration = 1000 / refreshRate;
  let value = 0;

  for (let frame = 0; frame < refreshRate; frame += 1) {
    const blend = getFrameIndependentBlend(frameDuration, 6);
    value += (1 - value) * blend;
  }

  return value;
};

test("scroll damping converges consistently across refresh rates", () => {
  const at60Hz = convergeForOneSecond(60);
  const at90Hz = convergeForOneSecond(90);
  const at120Hz = convergeForOneSecond(120);
  const at144Hz = convergeForOneSecond(144);

  assert.ok(Math.abs(at60Hz - at90Hz) < 1e-12);
  assert.ok(Math.abs(at60Hz - at120Hz) < 1e-12);
  assert.ok(Math.abs(at60Hz - at144Hz) < 1e-12);
});

test("scroll damping caps long resume frames and rejects invalid deltas", () => {
  assert.equal(getFrameIndependentBlend(-10), 0);
  assert.equal(getFrameIndependentBlend(Number.NaN), 0);
  assert.equal(getFrameIndependentBlend(500), getFrameIndependentBlend(50));
});

test("fast downward crossings cannot leave reveal content hidden", () => {
  assert.equal(getRevealIntersectionState(true, 400), "intersecting");
  assert.equal(getRevealIntersectionState(false, -1), "passed");
  assert.equal(getRevealIntersectionState(false, 1), "pending");
  assert.equal(getRevealIntersectionState(false, 49, 50), "passed");
});

test("pending reveal fallback resolves a ratio-zero below-to-above jump", () => {
  let pending = true;
  const lifecycle = [720, 180, -12].map((targetBottom) => {
    if (pending && shouldCommitPendingReveal(targetBottom)) pending = false;
    return pending;
  });

  assert.deepEqual(lifecycle, [true, true, false]);
});

test("document-end fallback reveals a footer clipped by observer margin", () => {
  assert.equal(
    getPendingRevealCommitMode({
      availableScroll: 6400,
      scrollTop: 6400,
      targetBottom: 1000,
      targetTop: 909,
      viewportHeight: 1000,
    }),
    "visible",
  );
  assert.equal(
    getPendingRevealCommitMode({
      availableScroll: 6400,
      scrollTop: 6200,
      targetBottom: 1000,
      targetTop: 909,
      viewportHeight: 1000,
    }),
    null,
  );
});

test("large fling jumps snap while normal scroll keeps damping", () => {
  assert.equal(shouldSnapMotionJump(0.219), false);
  assert.equal(shouldSnapMotionJump(0.22), true);
  assert.equal(shouldSnapMotionJump(-0.8), true);
  assert.equal(shouldSnapMotionJump(Number.NaN), false);
});

test("instant reveal markers survive one paint and then clear", () => {
  const firstFrame = advanceRevealCommitFrames(2);
  assert.deepEqual(firstFrame, {
    remainingFrames: 1,
    shouldClear: false,
  });
  assert.deepEqual(advanceRevealCommitFrames(firstFrame.remainingFrames), {
    remainingFrames: 0,
    shouldClear: true,
  });
});
