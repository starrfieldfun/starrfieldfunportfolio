(() => {
  const film = document.querySelector('.one-take-film');
  const screen = document.querySelector('.one-take-screen');
  if (!film || !screen) return;

  document.documentElement.classList.add('one-take-js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layers = [...screen.querySelectorAll('.one-take-layer')];
  const hudScene = screen.querySelector('.one-take-hud-scene');
  const time = screen.querySelector('.one-take-time');
  const projects = [...screen.querySelectorAll('.one-take-project')];

  if (reduce) {
    layers.forEach(x => x.classList.add('is-live'));
    projects.forEach(x => x.classList.add('is-live'));
    return;
  }

  const clamp = (n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const smooth = t => {t=clamp(t); return t*t*(3-2*t);};
  const range = (p,a,b)=>smooth((p-a)/Math.max(b-a,.0001));
  const mix = (a,b,t)=>a+(b-a)*t;
  const pulse = (p,a,b,c,d)=>range(p,a,b)*(1-range(p,c,d));

  // Overlap is intentional: no scene fully disappears before the next has already arrived.
  const shots = {
    opening:[0.000,0.018,0.085,0.115],
    think:[0.090,0.112,0.160,0.190],
    design:[0.165,0.188,0.235,0.265],
    build:[0.240,0.263,0.310,0.340],
    bridge:[0.315,0.340,0.395,0.425],
    starr:[0.400,0.430,0.485,0.515],
    work:[0.490,0.520,0.635,0.665],
    services:[0.640,0.665,0.720,0.750],
    method:[0.725,0.750,0.805,0.835],
    photo:[0.810,0.838,0.900,0.930],
    final:[0.905,0.935,1.000,1.000]
  };

  const labels = {
    opening:'OPENING', think:'THINK', design:'DESIGN', build:'BUILD', bridge:'TITLE CARD',
    starr:'STARR', work:'WORK', services:'SERVICES', method:'METHOD', photo:'PHOTOGRAPHY', final:'FINAL FRAME'
  };

  let target = window.scrollY, current = target, raf = 0;
  let top = 0, distance = 1, vh = innerHeight;

  const refresh = () => {
    const r = film.getBoundingClientRect();
    top = r.top + window.scrollY;
    vh = Math.max(innerHeight,1);
    distance = Math.max(film.offsetHeight - vh, 1);
  };

  const show = (el, alpha, x, y, scale=1, rot=0) => {
    if (!el) return;
    el.style.opacity = clamp(alpha).toFixed(4);
    el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)}) rotate(${rot.toFixed(3)}deg)`;
    el.classList.toggle('is-live', alpha > .50);
  };

  const renderLayer = (layer, p) => {
    const key = layer.dataset.shot;
    const s = shots[key]; if (!s) return 0;
    // Opening is the literal first frame: visible at scroll position 0, then released into THINK.
    const alpha = key === 'opening'
      ? (1 - range(p,s[2],s[3]))
      : (key === 'final' ? range(p,s[0],s[1]) : pulse(p,...s));
    const enter = key === 'opening' ? 1 : range(p,s[0],s[1]);
    const exit = key === 'final' ? 0 : range(p,s[2],s[3]);
    const local = clamp((p-s[0]) / Math.max(s[3]-s[0],.0001));

    // The same physical camera rule for every layer: rise in, settle, then drift through frame.
    const y = mix(38,0,enter) - exit*28;
    const x = mix(10,0,enter) - exit*8;
    const scale = mix(.985,1,enter) + local*.008 + exit*.006;
    show(layer, alpha, x, y, scale, 0);

    // Content-specific movement stays inside the same geometry, never inventing a new motion language.
    if (key === 'opening') {
      const h1 = layer.querySelector('h1');
      if (h1) h1.style.transform = `translate3d(0,${mix(26,-8,local)}px,0) scale(${mix(.99,1.018,local)})`;
    }
    if (['think','design','build'].includes(key)) {
      const copy = layer.querySelector('.one-take-shot-copy');
      if (copy) copy.style.transform = `translate3d(0,${mix(22,-12,local)}px,0) scale(${mix(.985,1.012,local)})`;
    }
    if (key === 'work') {
      const wp = clamp((p-.515)/(.635-.515));
      const segment = Math.min(2, Math.floor(wp*3));
      projects.forEach((card,i)=>{
        const center=(i+.5)/3;
        const d=Math.abs(wp-center);
        const a=clamp(1-d*5.2);
        const yy=(i-segment)*20;
        show(card,a,0,yy,mix(.975,1,a));
        const img=card.querySelector('img');
        if(img) img.style.transform=`scale(${(1.025 + wp*.018).toFixed(4)})`;
      });
    }
    if (key === 'services') {
      layer.querySelectorAll('.one-take-service-stack>a').forEach((item,i)=>{
        const a=range(local,.16+i*.10,.31+i*.10)*(1-exit*.8);
        item.style.opacity=a.toFixed(3);
        item.style.transform=`translate3d(0,${mix(18,0,a).toFixed(2)}px,0)`;
      });
    }
    if (key === 'method') {
      layer.querySelectorAll('.one-take-method-stack>div').forEach((item,i)=>{
        const a=range(local,.17+i*.10,.31+i*.10)*(1-exit*.8);
        item.style.opacity=a.toFixed(3);
        item.style.transform=`translate3d(0,${mix(18,0,a).toFixed(2)}px,0)`;
      });
    }
    if (key === 'photo') {
      const a=layer.querySelector('.one-take-photo-a');
      const b=layer.querySelector('.one-take-photo-b');
      if(a) a.style.transform=`translate3d(0,${mix(18,-14,local)}px,0) scale(${mix(.99,1.015,local)})`;
      if(b) b.style.transform=`translate3d(0,${mix(-12,16,local)}px,0) scale(${mix(.995,1.01,local)})`;
    }
    return alpha;
  };

  const render = () => {
    current += (target-current)*.09;
    if (Math.abs(target-current)<.05) current=target;
    const p = clamp((current-top)/distance);
    document.documentElement.style.setProperty('--ot-p',p.toFixed(4));

    // One continuous stock / lighting transition across the entire film.
    const dark = pulse(p,.075,.12,.36,.43);
    document.documentElement.style.setProperty('--ot-dark',(.93*dark).toFixed(4));
    // One continuous projector spotlight. The path bends gently rather than travelling in a straight line.
    const lightX = mix(78,28,p) + Math.sin(p*Math.PI*2.15)*7.5;
    const lightY = mix(20,66,p) + Math.sin(p*Math.PI*3.0 + .45)*8.0;
    const lightRot = mix(-20,10,p) + Math.sin(p*Math.PI*1.7)*5;
    const lightScale = 1 + Math.sin(p*Math.PI*2.0)*.055;
    const lightStrength = .56 + .18*Math.sin(p*Math.PI*2.35 + .25) + dark*.10;
    document.documentElement.style.setProperty('--ot-light-x',`${lightX.toFixed(2)}%`);
    document.documentElement.style.setProperty('--ot-light-y',`${lightY.toFixed(2)}%`);
    document.documentElement.style.setProperty('--ot-light-rot',`${lightRot.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--ot-light-scale',lightScale.toFixed(4));
    document.documentElement.style.setProperty('--ot-light-strength',clamp(lightStrength,.38,.86).toFixed(4));
    document.body.classList.toggle('ot-dark', dark>.45);

    let bestKey='OPENING', bestAlpha=-1;
    layers.forEach(layer=>{
      const a=renderLayer(layer,p);
      if(a>bestAlpha){bestAlpha=a;bestKey=labels[layer.dataset.shot]||'FILM';}
    });
    if(hudScene) hudScene.textContent=bestKey;
    if(time){const sec=Math.round(p*74);time.textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}

    const moving=Math.abs(target-current)>.05;
    if(moving) raf=requestAnimationFrame(render); else raf=0;
  };

  const request = () => { target=window.scrollY; if(!raf) raf=requestAnimationFrame(render); };
  const resize = () => { refresh(); target=current=window.scrollY; request(); };
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',resize,{passive:true});
  addEventListener('load',resize,{once:true});
  refresh(); request();
})();
