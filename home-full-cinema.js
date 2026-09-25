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
  const range = (value, start, end) => smooth((value - start) / Math.max(end - start, .0001));
  const mix = (a, b, t) => a + (b - a) * t;

  /* Scene labels remain functional even when motion is reduced. */
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      chapters.forEach(ch => ch.classList.toggle('is-active', ch === entry.target));
      document.body.dataset.homeFilmScene = entry.target.dataset.filmScene || '';
      if (continuityLabel) continuityLabel.textContent = entry.target.dataset.filmLabel || 'SCENE';
    });
  }, { threshold: 0.38 });
  chapters.forEach(ch => chapterObserver.observe(ch));

  if (reduced) {
    chapters.forEach(ch => ch.classList.add('is-active'));
    return;
  }

  let targetY = window.scrollY;
  let smoothY = targetY;
  let raf = 0;
  let geometry = [];
  let viewportH = Math.max(window.innerHeight, 1);

  const refreshGeometry = () => {
    viewportH = Math.max(window.innerHeight, 1);
    geometry = chapters.map(ch => {
      const r = ch.getBoundingClientRect();
      return {
        top: r.top + window.scrollY,
        height: ch.offsetHeight
      };
    });
  };

  const setTransform = (el, y, scale, opacity) => {
    if (!el) return;
    el.style.transform = `translate3d(0,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
    el.style.opacity = opacity.toFixed(4);
  };

  const animateItems = (items, p, exit, options = {}) => {
    const start = options.start ?? .22;
    const gap = options.gap ?? .055;
    const duration = options.duration ?? .16;
    const y = options.y ?? 22;
    const startScale = options.startScale ?? .985;

    items.forEach((item, index) => {
      const enter = range(p, start + index * gap, start + index * gap + duration);
      const out = exit * .92;
      const opacity = clamp(enter * (1 - out));
      const ty = mix(y, 0, enter) - exit * 14;
      const scale = mix(startScale, 1, enter) + exit * .008;
      setTransform(item, ty, scale, opacity);
    });
  };

  const animateChapter = (chapter, index, p) => {
    const isFinal = chapter.classList.contains('home-film-ending');

    /* Shared timing curve: arrive → settle → hold → release. */
    const arrive = range(p, .04, .20);
    const settle = range(p, .12, .30);
    const release = isFinal ? 0 : range(p, .82, .97);
    const life = clamp(arrive * (1 - release * .94));

    /* Same restrained camera push in every scene. */
    const stageScale = 1 + p * .012 + release * .018;
    const stageY = -release * 10;
    chapter.style.setProperty('--film-stage-scale', stageScale.toFixed(4));
    chapter.style.setProperty('--film-stage-y', `${stageY.toFixed(2)}px`);

    /* Titles always move vertically. This is the core unifying decision. */
    const titleY = mix(34, 0, settle) - release * 24;
    const titleScale = mix(1.028, 1, settle) + release * .012;
    chapter.style.setProperty('--film-title-y', `${titleY.toFixed(2)}px`);
    chapter.style.setProperty('--film-title-scale', titleScale.toFixed(4));
    chapter.style.setProperty('--film-title-opacity', life.toFixed(4));

    const copyIn = range(p, .12, .28);
    chapter.style.setProperty('--film-copy-y', `${(mix(24,0,copyIn)-release*18).toFixed(2)}px`);
    chapter.style.setProperty('--film-copy-opacity', clamp(copyIn * (1-release*.92)).toFixed(4));

    const mediaIn = range(p, .20, .38);
    chapter.style.setProperty('--film-media-y', `${(mix(28,0,mediaIn)-release*18).toFixed(2)}px`);
    chapter.style.setProperty('--film-media-scale', (mix(.988,1,mediaIn)+release*.006).toFixed(4));

    const metaIn = range(p, .02, .16);
    chapter.style.setProperty('--film-meta-y', `${mix(-10,0,metaIn).toFixed(2)}px`);
    chapter.style.setProperty('--film-meta-opacity', (clamp(metaIn*(1-release*.88))*.62).toFixed(4));

    const footerIn = range(p, .32, .48);
    chapter.style.setProperty('--film-footer-y', `${(mix(18,0,footerIn)-release*12).toFixed(2)}px`);
    chapter.style.setProperty('--film-footer-opacity', clamp(footerIn*(1-release*.88)).toFixed(4));

    /* Same slow light drift in every scene; no aggressive exposure sweep. */
    chapter.style.setProperty('--film-light-x', `${mix(-28,28,p).toFixed(2)}px`);
    chapter.style.setProperty('--film-light-y', `${mix(16,-18,p).toFixed(2)}px`);
    chapter.style.setProperty('--film-sweep', `${mix(-125,125,p).toFixed(2)}%`);

    if (chapter.classList.contains('home-film-work')) {
      animateItems([...chapter.querySelectorAll('.home-film-project')], p, release, {
        start:.24, gap:.055, duration:.16, y:24, startScale:.982
      });
      chapter.querySelectorAll('.home-film-project-frame img').forEach((img) => {
        const zoom = 1.025 + range(p,.18,.76)*.018;
        img.style.transform = `scale(${zoom.toFixed(4)})`;
      });
    }

    if (chapter.classList.contains('home-film-services')) {
      animateItems([...chapter.querySelectorAll('.home-film-service-list a')], p, release, {
        start:.23, gap:.06, duration:.15, y:20, startScale:.992
      });
    }

    if (chapter.classList.contains('home-film-method')) {
      animateItems([...chapter.querySelectorAll('.home-film-method-beats > div')], p, release, {
        start:.23, gap:.065, duration:.16, y:20, startScale:.99
      });
    }

    if (chapter.classList.contains('home-film-photo')) {
      const photoP = range(p,.18,.78);
      chapter.style.setProperty('--film-photo-a', `${mix(20,-16,photoP).toFixed(2)}px`);
      chapter.style.setProperty('--film-photo-b', `${mix(-14,18,photoP).toFixed(2)}px`);
      chapter.style.setProperty('--film-photo-a-s', `${mix(.992,1.012,photoP).toFixed(4)}`);
      chapter.style.setProperty('--film-photo-b-s', `${mix(.995,1.008,photoP).toFixed(4)}`);
    }

    if (isFinal) {
      animateItems([...chapter.querySelectorAll('.home-film-ending-actions > a')], p, 0, {
        start:.31, gap:.05, duration:.15, y:22, startScale:.99
      });
      const credits = chapter.querySelector('.home-film-credits');
      if (credits) {
        const cp = range(p,.48,.64);
        setTransform(credits, mix(16,0,cp), 1, cp);
      }
    }
  };

  const render = () => {
    /* Lerp scroll input. This is what removes the trackpad/scroll choppiness. */
    smoothY += (targetY - smoothY) * .115;
    if (Math.abs(targetY - smoothY) < .08) smoothY = targetY;

    const doc = document.documentElement;
    const maxScroll = Math.max(doc.scrollHeight - viewportH, 1);
    const overall = clamp(smoothY / maxScroll);
    document.body.style.setProperty('--home-film-progress', overall.toFixed(4));

    if (continuityTime) {
      const totalSeconds = Math.round(overall * 92);
      continuityTime.textContent = `${String(Math.floor(totalSeconds/60)).padStart(2,'0')}:${String(totalSeconds%60).padStart(2,'0')}`;
    }

    const prologueEnd = prologue ? prologue.offsetTop + prologue.offsetHeight : 0;
    document.documentElement.classList.toggle('home-film-running', smoothY > prologueEnd - viewportH*.92);

    if (desktopQuery.matches) {
      chapters.forEach((chapter,index) => {
        const g = geometry[index];
        if (!g) return;
        const rangePx = Math.max(g.height - viewportH, 1);
        const p = clamp((smoothY - g.top) / rangePx);
        if (smoothY + viewportH < g.top - viewportH*.25 || smoothY > g.top + g.height + viewportH*.25) return;
        animateChapter(chapter,index,p);
      });
    }

    const stillMoving = Math.abs(targetY - smoothY) > .08;
    if (stillMoving) raf = requestAnimationFrame(render);
    else raf = 0;
  };

  const requestRender = () => {
    targetY = window.scrollY;
    if (!raf) raf = requestAnimationFrame(render);
  };

  const onResize = () => {
    targetY = window.scrollY;
    smoothY = targetY;
    refreshGeometry();
    requestRender();
  };

  window.addEventListener('scroll', requestRender, { passive:true });
  window.addEventListener('resize', onResize, { passive:true });
  desktopQuery.addEventListener?.('change', onResize);
  window.addEventListener('load', onResize, { once:true });

  refreshGeometry();
  requestRender();
})();
