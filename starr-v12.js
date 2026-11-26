/* Starrfield Fun v12: opt-in scroll choreography. No third-party runtime.
   CSS provides a readable static presentation if JS is unavailable. */
(()=>{
  'use strict';
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
  const stage=document.querySelector('.sf-film-stage');
  const orbit=document.querySelector('.sf-v12-orbit-hero');
  const accent=document.querySelector('.sf-v12-orbit-signature');
  const work=Array.from(document.querySelectorAll('.sf-v12-work .work-project'));
  const photos=Array.from(document.querySelectorAll('.sf-v12-photography .sf-v12-photo-step'));
  let queued=false;

  function update(){
    queued=false;
    if(reduce.matches){
      for(const el of work){const card=el.querySelector('.work-project-visual');if(card)card.removeAttribute('data-v12-active')}
      for(const el of photos){const plane=el.querySelector('.sf-v12-photo-plane');if(plane)plane.removeAttribute('data-v12-active')}
      return;
    }
    const vh=window.innerHeight || 800;
    if(stage && orbit){
      // The original cinema owns the scroll timeline. Read it, never modify it.
      const raw=Number.parseFloat(stage.style.getPropertyValue('--film-p'));
      const track=document.querySelector('.sf-film-track');
      const fallback=track?clamp(-track.getBoundingClientRect().top/Math.max(1,track.offsetHeight-vh)):0;
      const progress=Number.isFinite(raw)?clamp(raw):fallback;
      const retreat=smooth(.075,.30,progress);
      const twist=smooth(0,.28,progress);
      orbit.style.setProperty('--sf-v12-orbit-opacity',(1-retreat).toFixed(3));
      orbit.style.setProperty('--sf-v12-orbit-scale',(1-.30*retreat+.06*Math.sin(twist*Math.PI)).toFixed(4));
      orbit.style.setProperty('--sf-v12-orbit-y',`${(-16+50*twist).toFixed(2)}deg`);
      orbit.style.setProperty('--sf-v12-orbit-x',`${(8-18*twist).toFixed(2)}deg`);
      orbit.style.setProperty('--sf-v12-orbit-z',`${(-3+13*twist).toFixed(2)}deg`);
    }
    if(accent){
      accent.style.setProperty('--sf-v12-mark-angle',`${clamp(window.scrollY/140,0,14).toFixed(2)}deg`);
    }
    for(const [i,section] of work.entries()){
      const card=section.querySelector('.work-project-visual');if(!card)continue;
      const r=section.getBoundingClientRect();
      const visible=r.bottom>0 && r.top<vh;
      if(!visible){card.removeAttribute('data-v12-active');continue}
      const p=clamp((vh*.94-r.top)/Math.max(1,r.height+vh*.28));
      const enter=smooth(.05,.72,p), depart=smooth(.84,1,p);
      const direction=(i%2===0)?-1:1;
      card.style.setProperty('--sf-v12-card-scale',(.71+.31*enter+.065*depart).toFixed(4));
      card.style.setProperty('--sf-v12-card-x',`${(11*(1-enter)-3*depart).toFixed(2)}deg`);
      card.style.setProperty('--sf-v12-card-yaw',`${(direction*18*(1-enter)+direction*3*depart).toFixed(2)}deg`);
      card.style.setProperty('--sf-v12-card-y',`${(36*(1-enter)-12*depart).toFixed(2)}px`);
      card.style.setProperty('--sf-v12-card-alpha',(0.76+.24*enter).toFixed(3));
      card.setAttribute('data-v12-active','true');
    }
    for(const [i,step] of photos.entries()){
      const plane=step.querySelector('.sf-v12-photo-plane');if(!plane)continue;
      const r=step.getBoundingClientRect();
      const visible=r.bottom>0 && r.top<vh;
      if(!visible){plane.removeAttribute('data-v12-active');continue}
      const p=clamp((vh*.90-r.top)/Math.max(vh,1));
      const come=smooth(.02,.86,p);
      const direction=i%2===0?-1:1;
      plane.style.setProperty('--sf-v12-photo-scale',(.68+.35*come).toFixed(4));
      plane.style.setProperty('--sf-v12-photo-yaw',`${(direction*14*(1-come)).toFixed(2)}deg`);
      plane.style.setProperty('--sf-v12-photo-x',`${(8*(1-come)).toFixed(2)}deg`);
      plane.style.setProperty('--sf-v12-photo-y',`${(40*(1-come)).toFixed(2)}px`);
      plane.style.setProperty('--sf-v12-photo-opacity',(.66+.34*come).toFixed(3));
      plane.setAttribute('data-v12-active','true');
    }
  }
  function schedule(){if(!queued){queued=true;window.requestAnimationFrame(update)}}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  reduce.addEventListener('change',schedule);
  // The original animation engine changes a CSS variable while the sticky scene
  // stays at the top, so normal scroll events are enough to keep this in sync.
  schedule();
})();
