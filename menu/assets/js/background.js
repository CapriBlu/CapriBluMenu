const video = document.getElementById('menu-background');
const toggle = document.getElementById('background-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const saveData = Boolean(navigator.connection?.saveData);
let wantsPlayback = !reducedMotion.matches && !saveData;

function label() {
  const english = document.documentElement.lang === 'en';
  const paused = video.paused;
  toggle.textContent = english ? (paused ? 'Play background' : 'Pause background') : (paused ? 'Avvia sfondo' : 'Pausa sfondo');
  toggle.setAttribute('aria-label', toggle.textContent);
  toggle.setAttribute('aria-pressed', String(!paused));
}

async function play() {
  if (!video.src) {
    const mobile = matchMedia('(max-width: 600px)').matches && Boolean(video.canPlayType('video/webm'));
    video.src = new URL(mobile ? '../../../img/vid.webM.mobile.webm' : '../../../img/capri_blu_pc_25s_1080p_hq.mp4', import.meta.url).href;
  }
  try { await video.play(); } catch { /* The play button remains available if autoplay is blocked. */ }
  label();
}

toggle.hidden = false;
toggle.addEventListener('click', () => {
  wantsPlayback = video.paused;
  if (wantsPlayback) void play(); else video.pause();
  label();
});
video.addEventListener('play', label);
video.addEventListener('pause', label);
video.addEventListener('error', () => { toggle.hidden = true; });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) video.pause(); else if (wantsPlayback) void play();
});
reducedMotion.addEventListener('change', () => {
  wantsPlayback = !reducedMotion.matches && !saveData;
  if (wantsPlayback && !document.hidden) void play(); else video.pause();
  label();
});
new MutationObserver(label).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
label();
if (wantsPlayback && !document.hidden) void play();
