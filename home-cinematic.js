(() => {
  const body = document.body;
  const hero = document.querySelector('.home-hero-cinematic');
  const intro = document.querySelector('.cinematic-intro');
  if (!hero || !intro) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  body.classList.add('cinema-ready');

  const revealNodes = document.querySelectorAll('[data-cinema-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-inview');
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-inview'));
  }

  if (reduceMotion) return;

  let pointerX = 0;
  let pointerY = 0;
  let ticking = false;

  const updateScroll = () => {
    const rect = hero.getBoundingClientRect();
    const total = Math.max(hero.offsetHeight, 1);
    const progress = Math.min(1, Math.max(0, -rect.top / total));
    body.style.setProperty('--hero-scroll', progress.toFixed(4));
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    body.style.setProperty('--mx', pointerX.toFixed(3));
    body.style.setProperty('--my', pointerY.toFixed(3));
  }, { passive: true });

  hero.addEventListener('pointerleave', () => {
    body.style.setProperty('--mx', '0');
    body.style.setProperty('--my', '0');
  });

  updateScroll();
})();
