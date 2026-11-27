/* V13: replay an abstract optical shutter, not photographs. */
(() => {
  const stage = document.getElementById('ss-aperture-stage');
  const trigger = document.getElementById('ss-aperture-trigger');
  if (!stage || !trigger) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const expose = () => {
    if (motion.matches) return;
    stage.classList.remove('is-exposing');
    void stage.offsetWidth;
    stage.classList.add('is-exposing');
  };
  trigger.addEventListener('click', expose);
  requestAnimationFrame(expose);
})();
