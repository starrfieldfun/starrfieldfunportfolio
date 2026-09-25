(() => {
  document.documentElement.classList.add('home-film-js');
  const chapters = [...document.querySelectorAll('.home-film-chapter')];
  const reveals = [...document.querySelectorAll('.film-reveal')];
  if (!chapters.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      chapters.forEach(ch => ch.classList.toggle('is-active', ch === entry.target));
      document.body.dataset.homeFilmScene = entry.target.dataset.filmScene || '';
    });
  }, { threshold: 0.45 });
  chapters.forEach(ch => chapterObserver.observe(ch));

  let raf = null;
  const onPointer = (event) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const active = document.querySelector('.home-film-chapter.is-active');
      if (active) {
        const rect = active.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / Math.max(rect.width,1) - .5) * 18;
        const y = ((event.clientY - rect.top) / Math.max(rect.height,1) - .5) * 14;
        active.style.setProperty('--film-x', x.toFixed(2));
        active.style.setProperty('--film-y', y.toFixed(2));
      }
      raf = null;
    });
  };
  window.addEventListener('pointermove', onPointer, { passive:true });
})();
