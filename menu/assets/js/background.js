const video = document.getElementById('menu-background');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const saveData = Boolean(navigator.connection?.saveData) || ['slow-2g','2g'].includes(navigator.connection?.effectiveType);
let menuReady = document.documentElement.dataset.menuReady === 'true';
let wantsPlayback = !reducedMotion.matches && !saveData;

async function play() {
  if (!video.src) {
    const mobile = matchMedia('(max-width: 600px)').matches && Boolean(video.canPlayType('video/webm'));
    video.src = new URL(mobile ? '../../../img/vid.webM.mobile.webm' : '../../../img/capri_blu_pc_25s_1080p_hq.mp4', import.meta.url).href;
  }
  try { await video.play(); } catch { /* Keep the poster when autoplay is blocked. */ }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) video.pause(); else if (wantsPlayback && (menuReady || video.src)) void play();
});
reducedMotion.addEventListener('change', () => {
  wantsPlayback = !reducedMotion.matches && !saveData;
  if (wantsPlayback && menuReady && !document.hidden) void play(); else video.pause();
});
function startAfterMenu() {
  menuReady = true;
  const start = () => { if (wantsPlayback && !document.hidden) void play(); };
  if ('requestIdleCallback' in window) requestIdleCallback(start, {timeout:1800});
  else setTimeout(start, 400);
}
if (menuReady) startAfterMenu();
else document.addEventListener('menu-ready', startAfterMenu, {once:true});
