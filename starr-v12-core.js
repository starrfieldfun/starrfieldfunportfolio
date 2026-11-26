/* V12.1 / True Core — no deployment, no global animation loop outside the hero. */
(() => {
  'use strict';
  const ownScript = document.currentScript || document.querySelector('script[data-starr-core-update]');
  const root = new URL('.', ownScript.src);
  const asset = p => new URL(p, root).href;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
  const effects = [['0','28px','.98'],['-18px','0','.98'],['18px','0','.98'],['0','-16px','.97'],['0','0','.94']];
  async function mountCore(){
    const stage=document.querySelector('.sf-core-stage'),hero=document.querySelector('.sf-film-stage');if(!stage||!hero)return;
    const status=stage.querySelector('.sf-core-status'),fallback=stage.querySelector('.sf-core-fallback');
    const track=hero.closest('.sf-film-track'),mobile=matchMedia('(max-width:620px)');
    // progress, center x/y, width/height, opacity. One model across the entire film.
    const wide=[[0,50,41,77,68,1],[.075,50,41,77,68,1],[.13,76,47,53,64,1],[.22,25,48,51,64,1],[.30,75,47,54,66,1],[.39,50,45,78,77,.27],[.48,50,46,80,76,.24],[.55,53,22,28,27,.52],[.66,53,22,28,27,.52],[.74,78,30,36,44,.30],[.83,76,48,48,62,.92],[.90,50,18,24,25,.48],[.98,50,43,74,75,.24],[1,50,43,74,75,.24]];
    const narrow=[[0,50,37,97,52,1],[.075,50,37,97,52,1],[.13,80,24,58,33,.35],[.22,22,24,58,33,.35],[.30,80,24,58,33,.35],[.39,50,42,96,65,.22],[.48,50,42,96,65,.20],[.55,78,18,40,23,.32],[.66,78,18,40,23,.32],[.74,80,22,50,30,.24],[.83,80,26,52,32,.34],[.90,80,18,38,22,.28],[1,50,42,90,65,.22]];
    function progress(){const v=parseFloat(hero.style.getPropertyValue('--film-p'));return Math.max(0,Math.min(1,Number.isFinite(v)?v:-track.getBoundingClientRect().top/Math.max(1,track.offsetHeight-innerHeight)));}
    function layout(p){if(reduce.matches){for(const k of ['x','y','w','h','opacity'])stage.style.removeProperty('--core-'+k);return;}const keys=mobile.matches?narrow:wide;let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;const a=keys[i],b=keys[i+1];let t=Math.max(0,Math.min(1,(p-a[0])/(b[0]-a[0])));t=t*t*(3-2*t);const k=a.map((v,j)=>v+(b[j]-v)*t);stage.style.setProperty('--core-x',k[1]+'%');stage.style.setProperty('--core-y',k[2]+'%');stage.style.setProperty('--core-w',`min(${k[3]}vw,1000px)`);stage.style.setProperty('--core-h',k[4]+'svh');stage.style.setProperty('--core-opacity',k[5]);}
    layout(progress());addEventListener('scroll',()=>layout(progress()),{passive:true});addEventListener('resize',()=>layout(progress()),{passive:true});reduce.addEventListener('change',()=>layout(progress()));
    const fail = e => {stage.dataset.state='error';stage.querySelector('canvas')?.remove();status.textContent='STARR / CORE · PREVIEW';console.warn('[V12.2] Core:',e);};
    let renderer;
    try {
      // Pinned native ES modules. GLTFLoader resolves the same Three.js version via jsDelivr.
      const [THREE,{GLTFLoader}]=await Promise.all([import('https://cdn.jsdelivr.net/npm/three@0.170.0/+esm'),import('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js/+esm')]);
      renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;stage.prepend(renderer.domElement);
      const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.1,100);
      scene.add(new THREE.HemisphereLight(0xa8b7ff,0x171a36,.75));
      for(const [color,intensity,pos] of [[0xe4eaff,2.1,[4,5,6]],[0x778dff,2.5,[-5,2,-4]],[0xff806f,1.25,[0,-4,3]]]){const l=new THREE.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);}
      // Local procedural lighting environment helps reflective PBR materials without a remote HDR file.
      const envScene=new THREE.Scene();envScene.background=new THREE.Color(0x171a2b);
      for(const [color,pos,size] of [[0xffffff,[0,4,0],5],[0xffffff,[4,1,2],3],[0x829aff,[-4,1,-2],4],[0xffccaa,[0,-3,3],3]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(size,size),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));m.position.set(...pos);m.lookAt(0,0,0);envScene.add(m);}
      const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(envScene,.12);scene.environment=env.texture;pmrem.dispose();envScene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
      const gltf=await new GLTFLoader().loadAsync(asset('images/site/starr-core.glb'));
      let star=null;gltf.scene.traverse(o=>{if(!o.isMesh)return;[o.material].flat().forEach(m=>{const n=m.name||'';if(n.startsWith('01')){m.color.setHex(0x465bff);m.metalness=.28;m.roughness=.24;m.emissive.setHex(0x2436cf);m.emissiveIntensity=.22;star=m;}else if(n.startsWith('02')){m.color.setHex(0x6675cc);m.metalness=.68;m.roughness=.25;}else if(n.startsWith('03')){m.color.setHex(0xff7864);m.emissive.setHex(0xff4937);m.emissiveIntensity=.20;}else if(n.startsWith('04')){m.color.setHex(0xd8ff68);m.emissive.setHex(0xa9dc31);m.emissiveIntensity=.18;}});});const blue=new THREE.Color(0x465bff),coral=new THREE.Color(0xff796b),lime=new THREE.Color(0xa3bd58),tmp=new THREE.Color();
      const box=new THREE.Box3().setFromObject(gltf.scene);const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());const max=Math.max(size.x,size.y,size.z);if(!Number.isFinite(max)||max<=0)throw Error('Invalid model bounds');
      const pivot=new THREE.Group(), centered=new THREE.Group();centered.add(gltf.scene);centered.position.copy(center).multiplyScalar(-1);pivot.add(centered);pivot.scale.setScalar(2.75/max);scene.add(pivot);
      let visible=true, active=true, raf=0,last=0,idle=.35,scrollAngle=0,px=0,py=0;
      let lastW=0,lastH=0;function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h||w===lastW&&h===lastH)return;lastW=w;lastH=h;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(0,0,Math.max(5.0,5.0/camera.aspect));camera.updateProjectionMatrix();renderer.render(scene,camera);}
      function draw(now){raf=0;if(!visible||!active||document.hidden)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;
        if(!reduce.matches){idle+=dt*.43;const t=progress();layout(t);const target=t*Math.PI*8;scrollAngle+=(target-scrollAngle)*Math.min(1,dt*8);pivot.rotation.y=idle+scrollAngle;pivot.rotation.x=.12+py*.13;pivot.rotation.z=-.12+px*.10;pivot.position.y=Math.sin(idle*2)*.055;if(star){tmp.copy(blue).lerp(coral,Math.max(0,1-Math.abs(t-.22)/.1)*.72).lerp(lime,Math.max(0,1-Math.abs(t-.9)/.07)*.60);star.color.copy(tmp);}}
        else {pivot.rotation.set(.12,.45,-.08);pivot.position.y=0;}
        resize();renderer.render(scene,camera);if(!reduce.matches)raf=requestAnimationFrame(draw);
      }
      function start(){if(visible&&active&&!document.hidden&&!raf){last=0;raf=requestAnimationFrame(draw);}}
      const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0});observer.observe(hero);
      document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else start();});
      reduce.addEventListener('change',start);hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const b=hero.getBoundingClientRect();px=(e.clientX-b.left)/b.width*2-1;py=(e.clientY-b.top)/b.height*2-1;},{passive:true});hero.addEventListener('pointerleave',()=>{px=py=0;});
      new ResizeObserver(resize).observe(stage);active=true;stage.dataset.state='ready';fallback.remove();status.textContent='STARR / CORE · 01';resize();start();
    } catch(e){renderer?.dispose();fail(e);}
  }
  function gallery(){const scenes=[...document.querySelectorAll('.sf122-photo-grid')];if(!scenes.length)return;const unique=shuffle(scenes.flatMap(g=>[...g.querySelectorAll('.sf122-photo-card:not([data-repeat])')]));if(unique.length!==11)return;const repeat=unique[0].cloneNode(true);repeat.dataset.repeat='true';const deck=[...unique,repeat];const io=!reduce.matches&&'IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){[...e.target.children].forEach((f,i)=>{const moves=[[0,14],[-10,0],[10,0],[0,-10]], [x,y]=moves[Math.floor(Math.random()*moves.length)];f.style.setProperty('--card-x',x+'px');f.style.setProperty('--card-y',y+'px');f.style.setProperty('--card-delay',i*75+'ms');f.dataset.animate='true';});io.unobserve(e.target);}}),{threshold:.15}):null;scenes.forEach((g,i)=>{g.replaceChildren(...deck.slice(i*3,i*3+3));io?.observe(g);});}
  function archive(){const links=[...document.querySelectorAll('.sf122-open-photo')],d=document.querySelector('.sf122-lightbox');if(!links.length||!d||typeof d.showModal!=='function')return;let current=0,trigger=null;const im=d.querySelector('img'),count=d.querySelector('.sf122-lightbox-count'),caption=d.querySelector('.sf122-lightbox-caption');function show(n){current=(n+links.length)%links.length;const source=links[current].querySelector('img');im.src=links[current].href;im.alt=source.alt;caption.textContent=source.alt;count.textContent=String(current+1).padStart(2,'0')+' / '+links.length;}links.forEach((a,i)=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();trigger=a;show(i);d.showModal();}));d.querySelector('[data-close]').addEventListener('click',()=>d.close());d.querySelector('[data-prev]').addEventListener('click',()=>show(current-1));d.querySelector('[data-next]').addEventListener('click',()=>show(current+1));d.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(current+(e.key==='ArrowLeft'?-1:1));}});d.addEventListener('close',()=>trigger?.focus());}
  function teaser(){const stack=document.querySelector('.sf-shot-photo .sf-photo-stack');if(!stack)return;const paths=['01-sculpture.jpg','02-spiral-stairs.jpg','03-lanterns.jpg','04-rain.jpg','05-street.jpg','06-building.jpg','07-corridor.jpg','08-beach.jpg','09-purple-flowers.jpg','10-plants.jpg','11-porsche-badge.jpg'];const chosen=shuffle(paths).slice(0,3);stack.querySelectorAll('img').forEach((im,i)=>{im.src=asset('images/photography/'+chosen[i]);im.decoding='async';});stack.classList.add('sf-core-triple');}
  // Run after existing deferred cinematic scripts so the three-image teaser doesn't get overwritten.
  function boot(){gallery();teaser();archive();mountCore();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
