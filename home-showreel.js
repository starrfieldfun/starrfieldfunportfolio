(() => {
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const root = document.documentElement;
  const projector = document.querySelector('.showreel-projector');
  const gate = document.querySelector('.showreel-gate');
  const sections = [...document.querySelectorAll('[data-showreel]')];
  const work = document.querySelector('[data-showreel-work]');
  const projects = [...document.querySelectorAll('.showreel-project')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!projector || reduce) return;

  let targetX = 50, targetY = 48, x = 50, y = 48;
  let targetScroll = window.scrollY, smoothScroll = targetScroll;
  let raf = 0;

  const sectionProgress = (el, scrollY = window.scrollY) => {
    if (!el) return 0;
    const top = el.offsetTop;
    const h = el.offsetHeight;
    const vh = window.innerHeight;
    return clamp((scrollY + vh - top) / (h + vh));
  };

  const updatePointer = (e) => {
    targetX = clamp((e.clientX / window.innerWidth) * 100, 15, 85);
    targetY = clamp((e.clientY / window.innerHeight) * 100, 18, 82);
  };
  window.addEventListener('pointermove', updatePointer, { passive: true });
  window.addEventListener('scroll', () => { targetScroll = window.scrollY; schedule(); }, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  const render = () => {
    raf = 0;
    smoothScroll = lerp(smoothScroll, targetScroll, .105);
    x = lerp(x, targetX, .055);
    y = lerp(y, targetY, .055);
    root.style.setProperty('--spot-x', `${x}%`);
    root.style.setProperty('--spot-y', `${y}%`);

    const prologue = document.querySelector('.cinema-prologue');
    const afterOpening = prologue ? smoothScroll > prologue.offsetTop + prologue.offsetHeight - window.innerHeight * .8 : true;
    projector.classList.toggle('is-on', afterOpening);
    gate?.classList.toggle('is-on', afterOpening);

    sections.forEach((section) => {
      const p = smooth(sectionProgress(section, smoothScroll));
      if (section.classList.contains('showreel-identity')) {
        section.style.setProperty('--ghost-scale', (1.16 - p * .14).toFixed(3));
        section.style.setProperty('--portrait-y', `${(34 - p * 34).toFixed(1)}px`);
        section.style.setProperty('--portrait-r', `${(-3 + p * 2.1).toFixed(2)}deg`);
        section.style.setProperty('--portrait-scale', (.93 + p * .07).toFixed(3));
        section.style.setProperty('--portrait-o', (.25 + p * .75).toFixed(3));
        section.style.setProperty('--copy-y', `${(40 - p * 40).toFixed(1)}px`);
        section.style.setProperty('--copy-o', (.1 + p * .9).toFixed(3));
      }
      if (section.classList.contains('showreel-services')) {
        const lines = [...section.querySelectorAll('.showreel-service-titles a')];
        lines.forEach((line, i) => {
          const local = clamp((p - (.18 + i * .13)) / .22);
          line.style.setProperty('--service-clip', `${((1 - smooth(local)) * 100).toFixed(1)}%`);
        });
      }
      if (section.classList.contains('showreel-method')) {
        const words = [...section.querySelectorAll('.showreel-method-word strong')];
        words.forEach((word, i) => {
          const local = smooth(clamp((p - (.12 + i * .16)) / .28));
          word.style.setProperty('--method-y', `${(30 - local * 30).toFixed(1)}px`);
          word.style.setProperty('--method-o', (.12 + local * .88).toFixed(3));
        });
      }
      if (section.classList.contains('showreel-eye')) {
        section.style.setProperty('--photo-a-y', `${(38 - p * 58).toFixed(1)}px`);
        section.style.setProperty('--photo-b-y', `${(-28 + p * 58).toFixed(1)}px`);
      }
      if (section.classList.contains('showreel-finale')) {
        section.style.setProperty('--final-ghost-scale', (1.1 - p * .08).toFixed(3));
      }
    });

    if (work && projects.length) {
      const rectTop = work.offsetTop;
      const range = Math.max(1, work.offsetHeight - window.innerHeight);
      const p = clamp((smoothScroll - rectTop) / range);
      const position = p * (projects.length - 1);
      projects.forEach((project, i) => {
        const delta = i - position;
        const abs = Math.abs(delta);
        const xvw = delta * 92;
        const scale = Math.max(.76, 1 - abs * .14);
        const opacity = Math.max(.08, 1 - abs * .72);
        project.style.setProperty('--x', `${xvw.toFixed(2)}vw`);
        project.style.setProperty('--scale', scale.toFixed(3));
        project.style.setProperty('--opacity', opacity.toFixed(3));
        project.style.pointerEvents = abs < .55 ? 'auto' : 'none';
      });
    }

    if (Math.abs(smoothScroll - targetScroll) > .15 || Math.abs(x - targetX) > .08 || Math.abs(y - targetY) > .08) schedule();
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };

  schedule();
})();
