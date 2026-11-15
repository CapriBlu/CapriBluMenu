(() => {
  const video = document.querySelector("#site-background,#boutique-background");
  if (!video) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  function start() {
    const c = navigator.connection;
    if (
      motion.matches ||
      c?.saveData ||
      /^(slow-)?2g$/.test(c?.effectiveType || "")
    )
      return;
    const mp4 = "./img/capri_blu_pc_25s_1080p_hq.mp4?v=1";
    video.src =
      matchMedia("(max-width:600px)").matches && video.canPlayType("video/webm")
        ? "./img/vid.webM.mobile.webm"
        : mp4;
    video.addEventListener(
      "error",
      () => {
        if (video.getAttribute("src") !== mp4) {
          video.src = mp4;
          video.play().catch(() => {});
        }
      },
      { once: true },
    );
    video.play().catch(() => {});
  }
  Promise.allSettled(
    [...document.querySelectorAll(".main-logo,#productImage")].map((image) =>
      image.decode(),
    ),
  ).then(() =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if ("requestIdleCallback" in window)
          requestIdleCallback(start, { timeout: 1800 });
        else setTimeout(start, 250);
      }),
    ),
  );
  motion.addEventListener("change", () => {
    if (motion.matches) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  });
})();
