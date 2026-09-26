(() => {
  const track = document.querySelector('.sf-film-track');
  const stage = document.querySelector('.sf-film-stage');
  if (!track || !stage) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const shots = [...stage.querySelectorAll('.sf-shot')];
  const projectFrames = [...stage.querySelectorAll('.sf-project-frame')];
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

  // Deliberate overlaps only: old shot releases while new shot arrives.
  const ranges = [
    ['opening', 0.000, 0.000, 0.080, 0.115],
    ['think',   0.078, 0.105, 0.165, 0.195],
    ['design',  0.160, 0.190, 0.250, 0.280],
    ['build',   0.245, 0.275, 0.335, 0.365],
    ['title',   0.330, 0.360, 0.420, 0.450],
    ['starr',   0.415, 0.445, 0.515, 0.545],
    ['work',    0.510, 0.540, 0.690, 0.720],
    ['services',0.685, 0.715, 0.780, 0.810],
    ['method',  0.775, 0.805, 0.855, 0.882],
    ['photo',   0.850, 0.878, 0.925, 0.950],
    ['final',   0.920, 0.948, 1.000, 1.000]
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

  function setShot(el, alpha, y, scale=1){
    if (!el) return;
    el.style.opacity = alpha.toFixed(4);
    el.style.transform = `translate3d(0,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
    el.classList.toggle('is-visible', alpha > .015);
    el.classList.toggle('is-active', alpha > .58);
  }

  function morphFrame(p){
    // One visual object that quietly changes purpose through the film.
    let w=1,h=1,x=50,y=50,r=0,radius=0,alpha=0,opacity=0,corners=0,shadow=0;
    if (p < .16) {
      opacity = smooth(.05,.13,p) * (1-smooth(.14,.17,p));
      w=mix(1,22,smooth(.06,.13,p)); h=mix(1,22,smooth(.06,.13,p)); radius=999;
      x=77; y=43; alpha=.15; corners=0;
    } else if (p < .36) {
      const t=smooth(.16,.30,p); opacity=.55; w=mix(22,48,t); h=mix(22,36,t); x=mix(77,65,t); y=mix(43,50,t); radius=mix(999,2,t); alpha=.18; corners=t;
    } else if (p < .53) {
      const t=smooth(.36,.48,p); opacity=.65; w=mix(48,30,t); h=mix(36,58,t); x=mix(65,29,t); y=51; radius=mix(2,2,t); alpha=.16; corners=.7; shadow=.10*t;
    } else if (p < .72) {
      const t=smooth(.53,.58,p); opacity=.75; w=mix(30,52,t); h=mix(58,55,t); x=mix(29,72,t); y=52; radius=mix(2,18,t); alpha=.16; corners=.85; shadow=.13;
    } else if (p < .86) {
      const t=smooth(.72,.80,p); opacity=.42*(1-t); w=mix(52,75,t); h=mix(55,1,t); x=50; y=50; radius=0; alpha=.12; corners=.25*(1-t);
    } else {
      opacity=0;
    }
    stage.style.setProperty('--frame-w', `${w}vw`);
    stage.style.setProperty('--frame-h', `${h}vh`);
    stage.style.setProperty('--frame-x', `${x}%`);
    stage.style.setProperty('--frame-y', `${y}%`);
    stage.style.setProperty('--frame-r', `${r}deg`);
    stage.style.setProperty('--frame-radius', `${radius}px`);
    stage.style.setProperty('--frame-alpha', alpha.toFixed(3));
    stage.style.setProperty('--frame-opacity', opacity.toFixed(3));
    stage.style.setProperty('--frame-corners', corners.toFixed(3));
    stage.style.setProperty('--frame-shadow', shadow.toFixed(3));
  }

  function workReel(p){
    const local = clamp((p-.54)/(.69-.54));
    const centers=[.15,.5,.84];
    projectFrames.forEach((el,i)=>{
      const d=Math.abs(local-centers[i]);
      const a=clamp(1-d/.26);
      const eased=a*a*(3-2*a);
      el.style.opacity=eased.toFixed(3);
      el.style.transform=`translate3d(0,${(1-eased)*28}px,0) scale(${(.965+eased*.035).toFixed(3)})`;
      el.classList.toggle('is-current', eased>.04);
      el.style.zIndex=String(10+i);
    });
  }

  function render(){
    // Lerp gives the camera inertia without making the input feel disconnected.
    const delta = target-current;
    current += delta * (Math.abs(delta) > .08 ? .105 : .145);
    if (Math.abs(delta) < .00006) current = target;
    const p=current;

    stage.style.setProperty('--film-p', p.toFixed(4));
    stage.style.setProperty('--grain-x', `${Math.sin(p*90)*1.4}px`);
    stage.style.setProperty('--grain-y', `${Math.cos(p*73)*1.1}px`);

    // Continuous projector / spotlight — one slow sweep, not one effect per scene.
    stage.style.setProperty('--spot-x', `${mix(22,-18,p).toFixed(2)}vw`);
    stage.style.setProperty('--spot-y', `${mix(-16,16,smooth(0,1,p)).toFixed(2)}vh`);
    stage.style.setProperty('--spot-r', `${mix(-14,12,p).toFixed(2)}deg`);
    stage.style.setProperty('--spot-opacity', `${(.70 + Math.sin(p*Math.PI)*.18).toFixed(3)}`);
    stage.style.setProperty('--guide-opacity', `${mix(.36,.16,smooth(.72,.92,p)).toFixed(3)}`);

    let dominant=0;
    let best=-1;
    ranges.forEach(([name,a,b,c,d],i)=>{
      let alpha;
      if (i===0 && p <= b) alpha=1;
      else if (name==='final') alpha=smooth(a,b,p);
      else alpha=pulse(p,a,b,c,d);
      if (alpha>best){best=alpha;dominant=i;}
      const enter = smooth(a,b,p);
      const exit = name==='final' ? 0 : smooth(c,d,p);
      const y = mix(34,0,enter) - exit*22;
      const scale = .985 + enter*.015 + exit*.008;
      setShot(shotMap[name],alpha,y,scale);
    });

    // Opening typography fractures into the first thought.
    const fracture=smooth(.055,.112,p);
    const op=shotMap.opening;
    if(op){
      const lines=op.querySelectorAll('.sf-opening-line');
      if(lines[0]) lines[0].style.transform=`translate3d(${-fracture*8}vw,${-fracture*4}vh,0) rotate(${-fracture*.6}deg)`;
      if(lines[1]) lines[1].style.transform=`translate3d(${fracture*9}vw,${fracture*.2}vh,0) rotate(${fracture*.4}deg)`;
      if(lines[2]) lines[2].style.transform=`translate3d(${-fracture*5}vw,${fracture*5}vh,0) rotate(${-fracture*.3}deg)`;
    }

    // Photography changes the film stock, then finale returns to ivory.
    document.body.classList.toggle('is-dark', p>.852 && p<.948);

    workReel(p);
    morphFrame(p);

    const labels=['OPENING','THINK','DESIGN','BUILD','TITLE CARD','STARR','WORK','SERVICES','METHOD','PHOTOGRAPHY','FINAL'];
    chapter.textContent=`${labels[dominant]} / ${String(dominant+1).padStart(2,'0')}`;
    progressLabel.textContent=`${String(dominant+1).padStart(2,'0')} / 11`;
    const sec=Math.floor(p*26), fr=Math.floor((p*26-sec)*24);
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
