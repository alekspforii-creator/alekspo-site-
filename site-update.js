/* One-shot ambient playback: no controls, no loop, pauses offscreen.
   On reduced-motion, narrow viewport or save-data: stable poster only. */
(() => {
 const host=document.querySelector('.experience-ambient');
 const video=document.getElementById('experienceAmbientVideo');
 if(!host||!video)return;
 const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const saveData=navigator.connection?.saveData===true;
 const small=window.matchMedia('(max-width: 760px)').matches;
 if(reduceMotion||saveData||small){video.removeAttribute('autoplay');video.pause();return;}
 let started=false,finished=false;
 video.addEventListener('ended',()=>{finished=true;host.classList.add('is-ended');video.pause();});
 video.addEventListener('error',()=>{host.classList.add('is-ended');});
 if('IntersectionObserver' in window){
   const io=new IntersectionObserver(entries=>{
     for(const e of entries){
       if(finished)continue;
       if(e.isIntersecting && e.intersectionRatio>.40){
         if(!started){started=true;video.preload='auto';}
         video.muted=true;
         video.play().catch(()=>{host.classList.add('is-ended');});
       }else if(!video.paused){video.pause();}
     }
   },{threshold:[0,.4,.65]});
   io.observe(host);
 }
})();
