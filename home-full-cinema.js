(() => {
  document.documentElement.classList.add('home-film-js');

  const chapters = [...document.querySelectorAll('.home-film-chapter')];
  const prologue = document.querySelector('.cinema-prologue');
  const continuity = document.querySelector('.home-film-continuity');
  const continuityLabel = continuity?.querySelector('.home-film-continuity-label b');
  const continuityTime = continuity?.querySelector('.home-film-continuity-time');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktopQuery = window.matchMedia('(min-width: 981px)');

  if (!chapters.length) return;

  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const smooth = (t) => {
    t = clamp(t);
    return t * t * (3 - 2 * t);
  };
  const range = (value, start, end) => smooth((value - start) / (end - start));
  const mix = (a, b, t) => a + (b - a) * t;

  /* Scene labels remain useful even on mobile / reduced motion. */
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      chapters.forEach(ch => ch.classList.toggle('is-active', ch === entry.target));
      document.body.dataset.homeFilmScene = entry.target.dataset.filmScene || '';
      if (continuityLabel) {
        continuityLabel.textContent = entry.target.dataset.filmLabel || entry.target.dataset.filmScene || 'SCENE';
      }
    });
  }, { threshold: 0.38 });
  chapters.forEach(ch => chapterObserver.observe(ch));

  if (reduced) {
    chapters.forEach(ch => ch.classList.add('is-active'));
    return;
  }

  let ticking = false;

  const setTransform = (el, x, y, scale, opacity, rotate = 0) => {
    if (!el) return;
    el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    el.style.opacity = opacity.toFixed(4);
  };

  const animateItems = (items, p, options = {}) => {
    const {
      start = .17,
      gap = .055,
      duration = .18,
      x = 80,
      y = 32,
      startScale = .94,
      exitScale = 1.03,
      alternate = false,
      exit = 0
    } = options;

    items.forEach((item, index) => {
      const enter = range(p, start + index * gap, start + index * gap + duration);
      const side = alternate && index % 2 ? -1 : 1;
      const opacity = clamp(enter * (1 - exit * .93));
      const tx = side * mix(x, 0, enter) + side * exit * -26;
      const ty = mix(y, 0, enter) - exit * 36;
      const scale = mix(startScale, 1, enter) + exit * (exitScale - 1);
      setTransform(item, tx, ty, scale, opacity);
    });
  };

  const animateDesktopChapter = (chapter, index, vh) => {
    const rect = chapter.getBoundingClientRect();
    const scrollRange = Math.max(rect.height - vh, 1);
    const p = clamp(-rect.top / scrollRange);

    const enter = range(p, .015, .19);
    const settle = range(p, .12, .42);
    const isFinal = chapter.classList.contains('home-film-ending');
    const exit = isFinal ? 0 : range(p, .79, .985);
    const life = clamp(enter * (1 - exit * .96));

    /* Camera: the whole stage makes a restrained push, just like the prologue. */
    const stageScale = 1 + p * .024 + exit * .055;
    const stageY = -exit * 24;
    chapter.style.setProperty('--film-stage-scale', stageScale.toFixed(4));
    chapter.style.setProperty('--film-stage-y', `${stageY.toFixed(2)}px`);

    /* Titles begin slightly oversized / off-axis, settle, then leave frame. */
    const direction = index % 2 === 0 ? -1 : 1;
    const titleX = direction * (1 - enter) * 150 + direction * exit * -105;
    const titleY = (1 - enter) * 72 - exit * 66;
    const titleScale = mix(1.13, .985, settle) + exit * .055;
    chapter.style.setProperty('--film-title-x', `${titleX.toFixed(2)}px`);
    chapter.style.setProperty('--film-title-y', `${titleY.toFixed(2)}px`);
    chapter.style.setProperty('--film-title-scale', titleScale.toFixed(4));
    chapter.style.setProperty('--film-title-opacity', life.toFixed(4));

    const copyX = -direction * (1 - enter) * 76 + direction * exit * 46;
    const copyY = (1 - enter) * 44 - exit * 42;
    chapter.style.setProperty('--film-copy-x', `${copyX.toFixed(2)}px`);
    chapter.style.setProperty('--film-copy-y', `${copyY.toFixed(2)}px`);
    chapter.style.setProperty('--film-copy-opacity', clamp(range(p,.08,.26) * (1 - exit * .92)).toFixed(4));

    const mediaProgress = range(p, .14, .39);
    const mediaX = direction * mix(92, -18, mediaProgress) + direction * exit * -54;
    const mediaY = mix(72, -10, mediaProgress) - exit * 64;
    const mediaScale = mix(.92, 1.015, mediaProgress) + exit * .045;
    chapter.style.setProperty('--film-media-x', `${mediaX.toFixed(2)}px`);
    chapter.style.setProperty('--film-media-y', `${mediaY.toFixed(2)}px`);
    chapter.style.setProperty('--film-media-scale', mediaScale.toFixed(4));

    chapter.style.setProperty('--film-meta-y', `${mix(-18,0,enter).toFixed(2)}px`);
    chapter.style.setProperty('--film-meta-opacity', (clamp(enter * (1 - exit * .9)) * .62).toFixed(4));
    chapter.style.setProperty('--film-footer-y', `${mix(32,0,range(p,.28,.48)) - exit * 32}px`);
    chapter.style.setProperty('--film-footer-opacity', clamp(range(p,.25,.46) * (1 - exit * .9)).toFixed(4));
    chapter.style.setProperty('--film-wipe-opacity', exit.toFixed(4));

    /* Light and exposure sweep stay alive in every scene. */
    chapter.style.setProperty('--film-light-x', `${mix(-72,72,p).toFixed(2)}px`);
    chapter.style.setProperty('--film-light-y', `${mix(38,-44,p).toFixed(2)}px`);
    chapter.style.setProperty('--film-sweep', `${mix(-145,145,p).toFixed(2)}%`);

    if (chapter.classList.contains('home-film-work')) {
      animateItems([...chapter.querySelectorAll('.home-film-project')], p, {
        start:.18, gap:.055, duration:.18, x:110, y:48, startScale:.9, exitScale:1.045, exit
      });
      chapter.querySelectorAll('.home-film-project-frame img').forEach((img, i) => {
        const pan = (p - .5) * (i % 2 ? -18 : 18);
        img.style.transform = `translate3d(${pan.toFixed(2)}px,0,0) scale(${(1.04 + p*.025).toFixed(4)})`;
      });
    }

    if (chapter.classList.contains('home-film-services')) {
      animateItems([...chapter.querySelectorAll('.home-film-service-list a')], p, {
        start:.20, gap:.07, duration:.16, x:125, y:0, startScale:.985, exitScale:1.01, alternate:true, exit
      });
    }

    if (chapter.classList.contains('home-film-method')) {
      animateItems([...chapter.querySelectorAll('.home-film-method-beats > div')], p, {
        start:.20, gap:.075, duration:.17, x:92, y:18, startScale:.975, exitScale:1.015, alternate:true, exit
      });
    }

    if (chapter.classList.contains('home-film-photo')) {
      const photoP = range(p,.12,.86);
      chapter.style.setProperty('--film-photo-a', `${mix(74,-46,photoP).toFixed(2)}px`);
      chapter.style.setProperty('--film-photo-b', `${mix(-64,58,photoP).toFixed(2)}px`);
      chapter.style.setProperty('--film-photo-a-x', `${mix(-56,34,photoP).toFixed(2)}px`);
      chapter.style.setProperty('--film-photo-b-x', `${mix(52,-32,photoP).toFixed(2)}px`);
      chapter.style.setProperty('--film-photo-a-r', `${mix(-5.5,-1.2,photoP).toFixed(2)}deg`);
      chapter.style.setProperty('--film-photo-b-r', `${mix(5.8,1.5,photoP).toFixed(2)}deg`);
      chapter.style.setProperty('--film-photo-a-s', `${mix(.92,1.035,photoP).toFixed(4)}`);
      chapter.style.setProperty('--film-photo-b-s', `${mix(.94,1.02,photoP).toFixed(4)}`);
    }

    if (isFinal) {
      animateItems([...chapter.querySelectorAll('.home-film-ending-actions > a')], p, {
        start:.30, gap:.055, duration:.16, x:0, y:44, startScale:.97, exitScale:1, exit:0
      });
      const credits = chapter.querySelector('.home-film-credits');
      if (credits) {
        const cp = range(p,.48,.68);
        setTransform(credits,0,mix(24,0,cp),1,cp);
      }
    }
  };

  const updateFilm = () => {
    const vh = Math.max(window.innerHeight, 1);
    const doc = document.documentElement;
    const maxScroll = Math.max(doc.scrollHeight - vh, 1);
    const overall = clamp(window.scrollY / maxScroll);
    document.body.style.setProperty('--home-film-progress', overall.toFixed(4));

    if (continuityTime) {
      const totalSeconds = Math.round(overall * 92);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      continuityTime.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    }

    const prologueBottom = prologue ? prologue.getBoundingClientRect().bottom : 0;
    document.documentElement.classList.toggle('home-film-running', prologueBottom < vh * .92);

    if (desktopQuery.matches) {
      chapters.forEach((chapter,index) => {
        const rect = chapter.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 1.35) return;
        animateDesktopChapter(chapter,index,vh);
      });
    }

    ticking = false;
  };

  const queueUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateFilm);
  };

  window.addEventListener('scroll', queueUpdate, { passive:true });
  window.addEventListener('resize', queueUpdate, { passive:true });
  desktopQuery.addEventListener?.('change', queueUpdate);
  queueUpdate();
})();
