/* Continuous muted ambient loop, scroll-pause for performance.
   Motion-reduction and data-saver preferences are respected. */
(() => {
  const host = document.querySelector('.experience-ambient');
  const video = document.getElementById('experienceAmbientVideo');
  if (!host || !video) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  host.classList.remove('is-ended');
  if (reduceMotion || saveData) {
    video.pause();
    return;
  }
  let inView = false;
  async function start() {
    if (!inView || document.hidden) return;
    if (video.preload === 'none') video.preload = 'auto';
    try { await video.play(); } catch (_) { /* poster remains visible */ }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        inView = entry.isIntersecting;
        if (inView) start();
        else video.pause();
      }
    }, { threshold: 0.14 });
    observer.observe(host);
  } else {
    inView = true;
    start();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else start();
  });
})();