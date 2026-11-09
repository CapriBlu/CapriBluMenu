(() => {
  const slider = document.querySelector('.brand-slider');
  if (!slider) return;

  const phrases = [...slider.querySelectorAll('.brand-slider-phrase')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = 3800;
  let current = 0;
  let timer;
  let cleanup;
  let hovered = false;
  let focused = false;

  function stop() {
    window.clearInterval(timer);
    timer = undefined;
  }

  function advance() {
    const previous = phrases[current];
    previous.classList.remove('is-active');
    previous.classList.add('is-leaving');
    current = (current + 1) % phrases.length;
    phrases[current].classList.add('is-active');
    cleanup = window.setTimeout(() => previous.classList.remove('is-leaving'), 700);
  }

  function sync() {
    stop();

    if (reducedMotion.matches) {
      window.clearTimeout(cleanup);
      current = 0;
      phrases.forEach((phrase, index) => {
        phrase.classList.remove('is-leaving');
        phrase.classList.toggle('is-active', index === 0);
      });
      return;
    }

    if (!hovered && !focused && !document.hidden) {
      timer = window.setInterval(advance, interval);
    }
  }

  slider.addEventListener('mouseenter', () => { hovered = true; sync(); });
  slider.addEventListener('mouseleave', () => { hovered = false; sync(); });
  slider.addEventListener('focusin', () => { focused = true; sync(); });
  slider.addEventListener('focusout', (event) => {
    focused = slider.contains(event.relatedTarget);
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
})();
