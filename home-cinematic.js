(() => {
  const prologue = document.querySelector('.cinema-prologue');
  const screen = document.querySelector('.cinema-screen');
  if (!prologue || !screen) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const $ = (sel) => screen.querySelector(sel);
  const titleDesign = $('.cinema-title-design');
  const titleExperiences = $('.cinema-title-experiences');
  const titleMove = $('.cinema-title-move');
  const think = $('.cinema-scene-think');
  const design = $('.cinema-scene-design');
  const build = $('.cinema-scene-build');
  const finalCard = $('.cinema-final-card');
  const timecode = $('.cinema-timecode');
  const frameCount = $('.cinema-frame-count');
  const scrollCopy = $('.cinema-scroll-copy');
  const scrollLabel = $('.cinema-scroll-label');

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const pulse = (x, a, b, c, d) => smooth(a, b, x) * (1 - smooth(c, d, x));
  const setTransform = (el, x, y, scale = 1, rotate = 0) => {
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
  };
  const setScene = (el, opacity, y = 0, scale = 1, blur = 0) => {
    if (!el) return;
    el.style.opacity = opacity.toFixed(3);
    el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    el.style.filter = 'none';
    el.style.pointerEvents = opacity > .55 ? 'auto' : 'none';
  };

  let ticking = false;

  const render = () => {
    const rect = prologue.getBoundingClientRect();
    const scrollable = Math.max(prologue.offsetHeight - window.innerHeight, 1);
    const p = clamp(-rect.top / scrollable);
    document.body.style.setProperty('--cinema-p', p.toFixed(4));

    // The movie begins in ivory; the dark stock rolls in after the title fractures.
    // Near the end, the stock dissolves back into ivory so the portfolio release feels continuous.
    const exit = smooth(.955, 1, p);
    const dark = smooth(.26, .40, p) * (1 - exit);
    document.body.style.setProperty('--cinema-dark', dark.toFixed(4));
    document.body.style.setProperty('--cinema-exit', exit.toFixed(4));

    // Camera push: progressive zoom plus small pushes at each chapter cut.
    const zoomBase = smooth(.06, .90, p) * .095;
    const zoomCuts =
      pulse(p, .27, .33, .39, .44) * .020 +
      pulse(p, .45, .51, .57, .62) * .024 +
      pulse(p, .62, .68, .74, .79) * .026 +
      smooth(.80, .93, p) * .018;
    const finalSettle = smooth(.80, .90, p);
    const cameraScale = 1 + (zoomBase + zoomCuts) * (1 - finalSettle * .78);
    const cameraX = (-0.45 * smooth(.18, .88, p) * (1 - finalSettle)).toFixed(3);
    const cameraY = (.65 * smooth(.16, .82, p) * (1 - finalSettle)).toFixed(3);
    document.body.style.setProperty('--cinema-camera-scale', cameraScale.toFixed(4));
    document.body.style.setProperty('--cinema-camera-x', `${cameraX}vw`);
    document.body.style.setProperty('--cinema-camera-y', `${cameraY}vh`);
    document.body.style.setProperty('--cinema-light-x', `${76 - p * 31}%`);
    document.body.style.setProperty('--cinema-light-y', `${28 + p * 21}%`);

    // Opening title: slow camera push, then typographic fracture.
    const fracture = smooth(.10, .29, p);
    const titleOut = smooth(.23, .34, p);
    titleDesign.style.opacity = (1 - titleOut).toFixed(3);
    titleExperiences.style.opacity = (1 - titleOut * .86).toFixed(3);
    titleMove.style.opacity = (1 - titleOut).toFixed(3);
    setTransform(titleDesign, -fracture * 150, -fracture * 60, 1 + p * .025, -fracture * 1.2);
    setTransform(titleExperiences, fracture * 155, -fracture * 4, 1 + p * .035, fracture * .7);
    setTransform(titleMove, -fracture * 84, fracture * 70, 1 + p * .02, fracture * -.6);
    const blur = titleOut * 10;
    titleDesign.style.filter = 'none';
    titleExperiences.style.filter = 'none';
    titleMove.style.filter = 'none';

    // Full-frame chapter cuts. Each gets a strong entrance and a hard exit.
    const tThink = pulse(p, .30, .36, .46, .50);
    const tDesign = pulse(p, .47, .53, .63, .67);
    const tBuild = pulse(p, .64, .70, .80, .84);
    const tFinal = smooth(.81, .89, p) * (1 - smooth(.965, 1, p));

    setScene(think, tThink, (1 - tThink) * 18, .975 + tThink * .025, (1 - tThink) * 8);
    setScene(design, tDesign, (1 - tDesign) * -16, 1.025 - tDesign * .025, (1 - tDesign) * 8);
    setScene(build, tBuild, (1 - tBuild) * 18, .975 + tBuild * .025, (1 - tBuild) * 7);
    // Final title card: let the camera settle instead of pushing the copy beyond frame.
    setScene(finalCard, tFinal, 0, 1, (1 - tFinal) * 4);

    // Film UI / pacing indicators.
    const seconds = Math.floor(p * 12);
    const frames = Math.floor((p * 12 - seconds) * 24);
    timecode.textContent = `00:00:${String(seconds).padStart(2,'0')}:${String(frames).padStart(2,'0')}`;
    let scene = 1;
    if (p >= .30) scene = 2;
    if (p >= .47) scene = 3;
    if (p >= .64) scene = 4;
    if (p >= .81) scene = 5;
    frameCount.textContent = `${String(scene).padStart(2,'0')} / 05`;
    const waiting = p < .08;
    scrollCopy.classList.toggle('is-awaiting-scroll', waiting);
    if (scrollLabel) scrollLabel.textContent = waiting ? 'SCROLL TO PLAY' : p < .88 ? 'PLAYING' : 'END TITLE';

    ticking = false;
  };

  const requestRender = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  };

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender, { passive: true });
  render();
})();
