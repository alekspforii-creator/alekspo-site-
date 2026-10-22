// Industrial film: progressively enhanced, accessible, no autoplay on phones/data-saving.
(() => {
  const frame = document.getElementById('industryFilm');
  const video = document.getElementById('industryVideo');
  const toggle = document.getElementById('industryVideoToggle');
  const label = document.getElementById('industryVideoLabel');
  const symbol = document.getElementById('industryVideoIcon');
  const progress = document.getElementById('industryProgressFill');
  if (!frame || !video || !toggle || !label || !symbol || !progress) return;
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = window.matchMedia('(max-width: 760px)').matches;
  const saveData = navigator.connection?.saveData === true;
  let started = false;
  let seen = false;

  function updateButton(state) {
    frame.classList.toggle('is-playing', state === 'playing');
    label.textContent = state === 'playing' ? 'Пауза' : state === 'ended' ? 'Повторить' : started ? 'Продолжить' : 'Смотреть';
    symbol.textContent = state === 'playing' ? 'Ⅱ' : '▶';
    toggle.setAttribute('aria-label', state === 'playing' ? 'Приостановить видеоролик' : state === 'ended' ? 'Повторить видеоролик' : started ? 'Продолжить видеоролик' : 'Воспроизвести видеоролик');
  }

  async function play() {
    if (video.ended || (video.duration && video.currentTime >= video.duration - .05)) video.currentTime = 0;
    started = true;
    video.muted = true;
    try { await video.play(); } catch (_) { updateButton('paused'); }
  }
  toggle.addEventListener('click', () => {
    if (video.paused) play(); else video.pause();
  });
  video.addEventListener('play', () => updateButton('playing'));
  video.addEventListener('pause', () => { if(!video.ended) updateButton('paused'); });
  video.addEventListener('ended', () => updateButton('ended'));
  video.addEventListener('timeupdate', () => {
    const fraction = video.duration ? Math.max(0, Math.min(1,video.currentTime/video.duration)) : 0;
    progress.style.width = (fraction * 100).toFixed(2) + '%';
  });
  video.addEventListener('error', () => {
    label.textContent = 'Видео недоступно';
    toggle.disabled = true;
    toggle.setAttribute('aria-label','Видеоролик недоступен');
  });
  updateButton('paused');

  if (!smallScreen && !noMotion && !saveData && 'IntersectionObserver' in window) {
    const watcher = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if(entry.isIntersecting && entry.intersectionRatio >= .6 && !seen) {
          seen = true;
          play();
        } else if(!entry.isIntersecting && !video.paused) {
          video.pause();
        }
      }
    }, {threshold:[0,.6]});
    watcher.observe(frame);
  }
})();
