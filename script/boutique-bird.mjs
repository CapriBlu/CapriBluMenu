import { buildBirdJourney } from "./bird-motion.mjs";
// Keep both invitation widths reserved so switching language never shifts the line.
(() => {
  const link = document.getElementById("boutique-link");
  if (!link) return;
  const labels = link.querySelectorAll(".boutique-copy>span");
  const bird = link.querySelector(".boutique-bird"),
    facing = link.querySelector(".bird-facing");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let english = document.documentElement.lang !== "it",
    timer,
    hopping = false,
    journey,
    parts = [];
  function render() {
    labels.forEach((label) => {
      label.hidden = (label.lang === "en") !== english;
    });
  }
  function sync() {
    clearInterval(timer);
    if (
      hopping ||
      motion.matches ||
      document.hidden ||
      link.matches(":hover, :focus-within")
    )
      return;
    timer = setInterval(() => {
      english = !english;
      render();
    }, 5000);
  }
  link.addEventListener("mouseenter", sync);
  link.addEventListener("mouseleave", sync);
  link.addEventListener("focus", sync);
  link.addEventListener("blur", sync);
  function rest() {
    if (journey) {
      journey.cancel();
      journey = null;
    }
    parts.forEach((animation) => animation.cancel());
    parts = [];
    link.classList.remove("is-bird-hopping");
    hopping = false;
    if (facing) facing.style.transform = "";
    sync();
  }
  async function hopAlongPhrase() {
    if (!bird || !bird.animate || motion.matches) return;
    hopping = true;
    sync();
    try {
      if (document.fonts) await document.fonts.ready;
      if (motion.matches) {
        rest();
        return;
      }
      // Measure after fonts load. Both labels reserve space even when hidden.
      const distance =
        link.querySelector(".boutique-stage").clientWidth - bird.clientWidth;
      const {
        frames,
        bagFrames,
        wingFrames,
        legFrames,
        detailFrames,
        duration,
      } = buildBirdJourney(distance);
      link.classList.add("is-bird-hopping");
      const timing = { duration, easing: "linear", fill: "none" };
      journey = bird.animate(frames, timing);
      for (const [element, keyframes] of [
        [link.querySelector(".bird-bag"), bagFrames],
        [link.querySelector(".bird-wing"), wingFrames],
        ...Object.entries(legFrames).map(([name, keyframes]) => [
          link.querySelector(".bird-" + name),
          keyframes,
        ]),
        ...Object.entries(detailFrames).map(([name, keyframes]) => [
          link.querySelector("." + name),
          keyframes,
        ]),
      ]) {
        parts.push(element.animate(keyframes, timing));
      }
      await journey.finished;
    } catch {
      /* A cancelled animation leaves the static icon in its resting place. */
    } finally {
      rest();
    }
  }
  motion.addEventListener("change", () => {
    if (motion.matches) rest();
    else sync();
  });
  document.addEventListener("visibilitychange", () => {
    if (journey) {
      if (document.hidden) rest();
    }
    sync();
  });
  render();
  sync();
  hopAlongPhrase();
})();
