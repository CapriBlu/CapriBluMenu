const video = document.getElementById('menu-background');
const toggle = document.getElementById('background-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const saveData = Boolean(navigator.connection?.saveData) || ['slow-2g','2g'].includes(navigator.connection?.effectiveType);
let menuReady = document.documentElement.dataset.menuReady === 'true';
let wantsPlayback = !reducedMotion.matches && !saveData;

function label() {
  const language=document.documentElement.lang;
  const paused = video.paused;
  const words={it:['Avvia sfondo','Pausa sfondo'],en:['Play background','Pause background'],es:['Reproducir fondo','Pausar fondo'],pt:['Reproduzir fundo','Pausar fundo']}[language]||['Avvia sfondo','Pausa sfondo'];toggle.textContent=words[paused?0:1];
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
  if (document.hidden) video.pause(); else if (wantsPlayback && (menuReady || video.src)) void play();
});
reducedMotion.addEventListener('change', () => {
  wantsPlayback = !reducedMotion.matches && !saveData;
  if (wantsPlayback && menuReady && !document.hidden) void play(); else video.pause();
  label();
});
new MutationObserver(label).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
label();
function startAfterMenu() {
  menuReady = true;
  const start = () => { if (wantsPlayback && !document.hidden) void play(); };
  if ('requestIdleCallback' in window) requestIdleCallback(start, {timeout:1800});
  else setTimeout(start, 400);
}
if (menuReady) startAfterMenu();
else document.addEventListener('menu-ready', startAfterMenu, {once:true});
