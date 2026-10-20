/* STARRFIELD FUN / FIELD NOTES EXPERIMENT
   An additional motion layer for three case-study reveals. V10 untouched. */
(()=>{
  'use strict';
  const stage=document.querySelector('.sf-film-stage');
  const track=document.querySelector('.sf-film-track');
  if(!stage||!track)return;
  const demos=Array.from(stage.querySelectorAll('.sf-project-frame .sf-demo'));
  if(demos.length!==3)return;
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
  const centers=[.15,.50,.84];
  let queued=false;
  function update(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      demos.forEach(el=>{el.style.setProperty('--demo-reveal','1');el.style.setProperty('--demo-phase','1')});
      return;
    }
    // Read the precise eased frame produced by the existing V10 film engine.
    // This keeps our three demonstrations in perfect sync with the original reel.
    const p=clamp(Number(stage.style.getPropertyValue('--film-p')) || 0);
    const reel=clamp((p-.54)/.15);
    demos.forEach((el,i)=>{
      const reveal=smooth(centers[i]-.11,centers[i]+.045,reel);
      const phase=smooth(centers[i]-.24,centers[i]-.065,reel);
      el.style.setProperty('--demo-reveal',reveal.toFixed(4));
      el.style.setProperty('--demo-phase',phase.toFixed(4));
      // The monitor visual demonstrates state going from misaligned to aligned.
      if(i===1){
        const rest=1-phase;
        el.querySelectorAll('.sf-demo__display').forEach((display,index)=>{
          const offsets=[[-15,-7],[26,7],[-20,-6]];
          display.style.transform=`translateY(${(rest*offsets[index][0]).toFixed(2)}px) rotate(${(rest*offsets[index][1]).toFixed(2)}deg)`;
        });
      }
    });
  }
  const observer=new MutationObserver(update);
  observer.observe(stage,{attributes:true,attributeFilter:['style']});
  window.addEventListener('resize',update,{passive:true});
  update();
})();
