/* Elevated Aesthetics mockup: motion + menu. Vanilla, no dependencies. */
(function(){
  var d=document,root=d.documentElement;
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // stagger indexes
  d.querySelectorAll('[data-stagger]').forEach(function(p){Array.prototype.forEach.call(p.children,function(c,i){c.style.setProperty('--i',i)})});
  d.querySelectorAll('.drawer li, .drawer .d-h, .drawer-panel > .btn').forEach(function(el,i){el.style.setProperty('--i',i)});
  // header shrink
  var top=d.querySelector('.top');
  function onScroll(){if(top)top.classList.toggle('scrolled',window.scrollY>40)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  // reveal on scroll
  var els=d.querySelectorAll('[data-reveal],[data-stagger],.mask,.svc');
  if(rm||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')})}
  else{
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    els.forEach(function(e){io.observe(e)});
    // anything already scrolled past (anchor jumps, back button) shows immediately
    window.addEventListener('load',function(){els.forEach(function(e){if(e.getBoundingClientRect().bottom<0)e.classList.add('in')})});
  }
  // parallax
  var px=[].slice.call(d.querySelectorAll('[data-parallax]'));
  if(!rm&&px.length){
    var ticking=false;
    var run=function(){var vh=window.innerHeight;px.forEach(function(el){var r=el.parentElement.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;var p=(r.top+r.height/2-vh/2)/(vh+r.height);p=Math.max(-.5,Math.min(.5,p));var amt=Math.min(9,parseFloat(el.getAttribute('data-parallax'))||8);el.style.transform='translate3d(0,'+(-p*2*amt/100*r.height).toFixed(1)+'px,0)'});ticking=false};
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(run)}},{passive:true});
    window.addEventListener('resize',run);run();
  }
  // drawer
  var dr=d.getElementById('drawer'),btn=d.querySelector('.menu-btn');
  function setOpen(o){if(!dr)return;dr.classList.toggle('open',o);dr.setAttribute('aria-hidden',String(!o));btn&&btn.setAttribute('aria-expanded',String(o));d.body.classList.toggle('locked',o);if(o){var f=dr.querySelector('.drawer-x');f&&f.focus()}else{btn&&btn.focus()}}
  btn&&btn.addEventListener('click',function(){setOpen(true)});
  dr&&dr.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',function(){setOpen(false)})});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr&&dr.classList.contains('open'))setOpen(false)});
  // paired service menu: sticky photo follows the service in view
  d.querySelectorAll('.pmenu').forEach(function(m){
    var rows=[].slice.call(m.querySelectorAll('.prow')),frames=[].slice.call(m.querySelectorAll('.pf'));
    function act(r){rows.forEach(function(x){x.classList.toggle('act',x===r)});var f=r.getAttribute('data-f');frames.forEach(function(x){x.classList.toggle('on',x.getAttribute('data-f')===f)})}
    if(rows.length)act(rows[0]);
    if('IntersectionObserver' in window){var o=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting)act(e.target)})},{rootMargin:'-45% 0px -50% 0px'});rows.forEach(function(r){o.observe(r)})}
  });
  // accordion
  d.querySelectorAll('.acc-b').forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-expanded',b.getAttribute('aria-expanded')==='true'?'false':'true')})});
})();
