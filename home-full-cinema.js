(() => {
  document.documentElement.classList.add('home-film-js');

  const chapters = [...document.querySelectorAll('.home-film-chapter')];
  const prologue = document.querySelector('.cinema-prologue');
  const reveals = [...document.querySelectorAll('.film-reveal')];
  const continuity = document.querySelector('.home-film-continuity');
  const continuityLabel = continuity?.querySelector('.home-film-continuity-label b');
  const continuityTime = continuity?.querySelector('.home-film-continuity-time');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!chapters.length) return;

  if (reduced) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      chapters.forEach(ch => ch.classList.toggle('is-active', ch === entry.target));
      document.body.dataset.homeFilmScene = entry.target.dataset.filmScene || '';
      if (continuityLabel) continuityLabel.textContent = entry.target.dataset.filmLabel || entry.target.dataset.filmScene || 'SCENE';
    });
  }, { threshold: 0.45 });
  chapters.forEach(ch => chapterObserver.observe(ch));

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  let ticking = false;

  const updateFilm = () => {
    const vh = Math.max(window.innerHeight, 1);
    const doc = document.documentElement;
    const maxScroll = Math.max(doc.scrollHeight - vh, 1);
    const overall = clamp(window.scrollY / maxScroll, 0, 1);
    document.body.style.setProperty('--home-film-progress', overall.toFixed(4));

    if (continuityTime) {
      const totalSeconds = Math.round(overall * 62);
      continuityTime.textContent = `00:${String(totalSeconds).padStart(2, '0')}`;
    }

    const prologueBottom = prologue ? prologue.getBoundingClientRect().bottom : 0;
    document.documentElement.classList.toggle('home-film-running', prologueBottom < vh * .92);

    chapters.forEach((chapter) => {
      const rect = chapter.getBoundingClientRect();
      if (rect.bottom < -vh || rect.top > vh * 2) return;

      const travel = rect.height + vh;
      const progress = clamp((vh - rect.top) / travel, 0, 1);
      const centered = clamp((rect.top + rect.height / 2 - vh / 2) / vh, -1.4, 1.4);
      const drift = centered * -22;
      const mediaDrift = centered * 32;
      const horizontal = centered * 18;
      const scale = 1 + (1 - Math.abs(clamp(centered, -1, 1))) * .018;
      const sweep = `${-135 + progress * 270}%`;

      chapter.style.setProperty('--film-copy-y', `${drift.toFixed(2)}px`);
      chapter.style.setProperty('--film-media-y', `${mediaDrift.toFixed(2)}px`);
      chapter.style.setProperty('--film-horizontal', `${horizontal.toFixed(2)}px`);
      chapter.style.setProperty('--film-media-scale', scale.toFixed(4));
      chapter.style.setProperty('--film-light-x', `${(centered * 42).toFixed(2)}px`);
      chapter.style.setProperty('--film-light-y', `${(centered * -28).toFixed(2)}px`);
      chapter.style.setProperty('--film-sweep', sweep);
      chapter.style.setProperty('--film-photo-a', `${(centered * 22).toFixed(2)}px`);
      chapter.style.setProperty('--film-photo-b', `${(centered * -28).toFixed(2)}px`);
    });

    ticking = false;
  };

  const queueUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateFilm);
  };

  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueUpdate, { passive: true });
  queueUpdate();
})();
