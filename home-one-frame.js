(() => {
  const track = document.querySelector('.sf-film-track');
  const stage = document.querySelector('.sf-film-stage');
  if (!track || !stage) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const shots = [...stage.querySelectorAll('.sf-shot')];
  const projectFrames = [...stage.querySelectorAll('.sf-project-frame')];
  const serviceWords = [...stage.querySelectorAll('.sf-service-word')];
  const photoFigures = [...stage.querySelectorAll('.sf-photo-stack figure')];
  const perspective = stage.querySelector('.sf-shot-perspective');
  const chapter = stage.querySelector('.sf-film-chapter');
  const progressLabel = stage.querySelector('.sf-film-progress-label');
  const time = stage.querySelector('.sf-film-time');
  const instruction = stage.querySelector('.sf-film-instruction');

  const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
  const mix = (a,b,t) => a + (b-a)*t;
  const smooth = (a,b,x) => {
    const t = clamp((x-a)/(b-a));
    return t*t*(3-2*t);
  };
  const pulse = (x,a,b,c,d) => smooth(a,b,x) * (1-smooth(c,d,x));

  const ranges = [
    ['opening',     0.000, 0.000, 0.080, 0.115],
    ['think',       0.078, 0.105, 0.165, 0.195],
    ['design',      0.160, 0.190, 0.250, 0.280],
    ['build',       0.245, 0.275, 0.335, 0.365],
    ['title',       0.330, 0.360, 0.420, 0.450],
    ['perspective', 0.415, 0.445, 0.515, 0.545],
    ['work',        0.510, 0.540, 0.690, 0.720],
    ['services',    0.685, 0.715, 0.780, 0.810],
    ['method',      0.775, 0.805, 0.855, 0.882],
    ['photo',       0.850, 0.878, 0.925, 0.950],
    ['final',       0.920, 0.948, 1.000, 1.000]
  ];

  const shotMap = Object.fromEntries(shots.map(el => [el.dataset.shot, el]));
  let target = 0;
  let current = 0;
  let raf = 0;

  function targetFromScroll(){
    const r = track.getBoundingClientRect();
    const total = Math.max(track.offsetHeight - innerHeight, 1);
    target = clamp(-r.top / total);
  }

  function setShot(el, alpha, y, scale=1, z=0, tilt=0){
    if (!el) return;
    el.style.opacity = alpha.toFixed(4);
    el.style.transform = `translate3d(0,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateX(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    el.classList.toggle('is-visible', alpha > .015);
    el.classList.toggle('is-active', alpha > .58);

    // Secondary information follows the same arrive / settle / release grammar.
    const credits = el.querySelector('.sf-scene-credits');
    const index = el.querySelector('.sf-scene-index');
    if (credits) {
      const secondary = clamp((alpha - .16) / .84);
      credits.style.opacity = (secondary * .92).toFixed(3);
      credits.style.filter = `blur(${((1-secondary)*1.6).toFixed(2)}px)`;
    }
    if (index) {
      const secondary = clamp((alpha - .08) / .92);
      index.style.opacity = secondary.toFixed(3);
      index.style.transform = `translate3d(0,${((1-secondary)*18).toFixed(2)}px,0)`;
    }
  }

  function projectReel(p){
    const local = clamp((p-.54)/(.69-.54));
    const centers=[.15,.5,.84];
    projectFrames.forEach((el,i)=>{
      const d=Math.abs(local-centers[i]);
      const a=clamp(1-d/.26);
      const eased=a*a*(3-2*a);
      const wipe=clamp(eased*1.35);
      el.style.opacity=eased.toFixed(3);
      el.style.visibility=eased>.015?'visible':'hidden';
      el.style.pointerEvents=eased>.62?'auto':'none';
      el.style.transform=`translate3d(0,${(1-eased)*34}px,${(eased-1)*90}px) rotateX(${(1-eased)*2.4}deg) scale(${(.94+eased*.06).toFixed(3)})`;
      el.style.clipPath=`inset(0 ${(1-wipe)*48}% 0 ${(1-wipe)*48}% round 12px)`;
      el.style.setProperty('--project-image-scale',(1.035-eased*.035).toFixed(3));
      el.style.zIndex=String(20+i);
    });
  }

  function serviceMotion(p){
    const local=clamp((p-.705)/(.79-.705));
    serviceWords.forEach((el,i)=>{
      const t=smooth(i*.16, i*.16+.34, local);
      el.style.opacity=t.toFixed(3);
      el.style.transform=`translate3d(0,${(1-t)*32}px,${(1-t)*-45}px) scale(${(.97+t*.03).toFixed(3)})`;
    });
  }

  function perspectiveMotion(p){
    if(!perspective) return;
    const local=clamp((p-.435)/(.535-.435));
    const top=perspective.querySelector('h2 span');
    const bottom=perspective.querySelector('h2 em');
    if(top){
      const t=smooth(0,.55,local);
      top.style.opacity=t.toFixed(3);
      top.style.transform=`perspective(900px) rotateX(${mix(72,0,t)}deg) translateY(${mix(42,0,t)}px)`;
    }
    if(bottom){
      const t=smooth(.18,.80,local);
      bottom.style.opacity=t.toFixed(3);
      bottom.style.transform=`perspective(900px) rotateX(${mix(-66,0,t)}deg) translateY(${mix(-34,0,t)}px)`;
    }
  }

  function photoMotion(p){
    const local=clamp((p-.865)/(.94-.865));
    photoFigures.forEach((el,i)=>{
      const t=smooth(i*.14, i*.14+.68, local);
      const dir=i===0?-1:1;
      el.style.opacity=t.toFixed(3);
      el.style.clipPath=`inset(${(1-t)*48}% 0 ${(1-t)*48}% 0)`;
      el.style.transform=`translate3d(${dir*(1-t)*5}vw,${(1-t)*18}px,${(1-t)*-80}px) rotate(${dir*(3-t*1.3)}deg) scale(${(.94+t*.06).toFixed(3)})`;
    });
  }

  function exposureCuts(p){
    const cuts=[.112,.194,.279,.364,.449,.544,.718,.808,.881,.949];
    let flash=0;
    cuts.forEach(c=>{
      const d=Math.abs(p-c);
      flash=Math.max(flash, clamp(1-d/.006));
    });
    stage.style.setProperty('--flash-opacity',(flash*.16).toFixed(3));

    const bars = pulse(p,.49,.54,.70,.73)*2.5 + pulse(p,.835,.87,.942,.958)*3.2;
    stage.style.setProperty('--bar-h',`${bars.toFixed(2)}vh`);

    const sweepPhase = smooth(.405,.55,p) + smooth(.83,.93,p);
    stage.style.setProperty('--sweep-x',`${mix(-125,125,clamp(sweepPhase%1)).toFixed(1)}%`);
    stage.style.setProperty('--sweep-opacity',`${(pulse(p,.405,.445,.515,.55)*.34 + pulse(p,.83,.865,.925,.95)*.28).toFixed(3)}`);
  }

  function render(){
    const delta = target-current;
    current += delta * (Math.abs(delta) > .08 ? .10 : .14);
    if (Math.abs(delta) < .00006) current = target;
    const p=current;

    stage.style.setProperty('--film-p', p.toFixed(4));
    stage.style.setProperty('--grain-x', `${Math.sin(p*90)*1.35}px`);
    stage.style.setProperty('--grain-y', `${Math.cos(p*73)*1.05}px`);

    // The projector light now acts like a cinematographer:
    // it follows the current focal point instead of wandering generically.
    const lightKeys = [
      [0.00,  18, -13, -12, .66], // opening
      [0.11, -18,  -6,  -7, .73], // think / left typography
      [0.20,  -2,  -3,  -2, .75], // design
      [0.29,  15,   2,   4, .76], // build
      [0.39,   0,  -4,   0, .78], // title card
      [0.48,   0,  -1,   0, .82], // perspective thesis
      [0.61,  20,   4,   7, .76], // work / project screen
      [0.75,  -8,   1,  -3, .72], // services
      [0.83,   8,   4,   3, .70], // method
      [0.90,  18,   5,   6, .67], // photography / imagery
      [1.00,   0,  -2,   0, .74]  // final
    ];

    function lightAt(progress){
      let left = lightKeys[0], right = lightKeys[lightKeys.length - 1];
      for (let i = 0; i < lightKeys.length - 1; i++) {
        if (progress >= lightKeys[i][0] && progress <= lightKeys[i+1][0]) {
          left = lightKeys[i];
          right = lightKeys[i+1];
          break;
        }
      }
      const t = smooth(left[0], right[0], progress);
      return [
        mix(left[1], right[1], t),
        mix(left[2], right[2], t),
        mix(left[3], right[3], t),
        mix(left[4], right[4], t)
      ];
    }

    const [lx,ly,lr,lo] = lightAt(p);
    stage.style.setProperty('--spot-x', `${lx.toFixed(2)}vw`);
    stage.style.setProperty('--spot-y', `${ly.toFixed(2)}vh`);
    stage.style.setProperty('--spot-r', `${lr.toFixed(2)}deg`);
    stage.style.setProperty('--spot-opacity', `${lo.toFixed(3)}`);

    let dominant=0;
    let best=-1;
    ranges.forEach(([name,a,b,c,d],i)=>{
      let alpha;
      if (i===0 && p <= b) alpha=1;
      else if (name==='final') alpha=smooth(a,b,p);
      else alpha=pulse(p,a,b,c,d);
      if (alpha>best){best=alpha;dominant=i;}
      const enter=smooth(a,b,p);
      const exit=name==='final'?0:smooth(c,d,p);
      const y=mix(30,0,enter)-exit*18;
      const z=mix(-95,0,enter)+exit*58;
      const scale=.975+enter*.025+exit*.006;
      const tilt=mix(2.2,0,enter)-exit*.8;
      setShot(shotMap[name],alpha,y,scale,z,tilt);
    });

    // Opening fractures into the first thought.
    const fracture=smooth(.055,.112,p);
    const op=shotMap.opening;
    if(op){
      const lines=op.querySelectorAll('.sf-opening-line');
      if(lines[0]) lines[0].style.transform=`translate3d(${-fracture*8}vw,${-fracture*4}vh,0) rotate(${-fracture*.6}deg)`;
      if(lines[1]) lines[1].style.transform=`translate3d(${fracture*9}vw,${fracture*.2}vh,0) rotate(${fracture*.4}deg)`;
      if(lines[2]) lines[2].style.transform=`translate3d(${-fracture*5}vw,${fracture*5}vh,0) rotate(${-fracture*.3}deg)`;
    }

    document.body.classList.toggle('is-dark', p>.852 && p<.948);

    perspectiveMotion(p);
    projectReel(p);
    serviceMotion(p);
    photoMotion(p);
    exposureCuts(p);

    const labels=['OPENING','THINK','DESIGN','BUILD','TITLE CARD','PERSPECTIVE','WORK','SERVICES','METHOD','PHOTOGRAPHY','FINAL'];
    chapter.textContent=`${labels[dominant]} / ${String(dominant+1).padStart(2,'0')}`;
    progressLabel.textContent=`${String(dominant+1).padStart(2,'0')} / 11`;
    const sec=Math.floor(p*34), fr=Math.floor((p*34-sec)*24);
    time.textContent=`00:00:${String(sec).padStart(2,'0')}:${String(fr).padStart(2,'0')}`;
    instruction.textContent=p<.025?'SCROLL TO DIRECT':p>.955?'CHOOSE YOUR NEXT SCENE':'DIRECTING';

    if (Math.abs(target-current)>.00005) raf=requestAnimationFrame(render);
    else raf=0;
  }

  function update(){
    targetFromScroll();
    if(!raf) raf=requestAnimationFrame(render);
  }

  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',update,{passive:true});
  targetFromScroll(); current=target; render();
})();
