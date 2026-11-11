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
  // paired service menu: sticky photo follows the heading at the viewport mid-line
  d.querySelectorAll('.pmenu').forEach(function(m){
    var rows=[].slice.call(m.querySelectorAll('.prow')),frames=[].slice.call(m.querySelectorAll('.pf'));
    if(!rows.length)return;
    var rmMenu=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current=null, pending=null, timer=null, ticking=false;
    function act(r){
      if(!r||r===current)return;
      current=r;
      rows.forEach(function(x){x.classList.toggle('act',x===r)});
      var f=r.getAttribute('data-f');
      frames.forEach(function(x){x.classList.toggle('on',x.getAttribute('data-f')===f)});
    }
    function rowAtMid(){
      var mid=window.innerHeight*0.5, chosen=rows[0];
      rows.forEach(function(r){
        var h=r.querySelector('h3')||r, b=h.getBoundingClientRect();
        if(b.top<=mid) chosen=r;
      });
      return chosen;
    }
    function consider(r){
      if(r===pending)return;
      pending=r;
      if(timer)clearTimeout(timer);
      timer=setTimeout(function(){act(pending)}, rmMenu?0:180);
    }
    function onScroll(){
      if(ticking)return;
      ticking=true;
      requestAnimationFrame(function(){ticking=false;consider(rowAtMid())});
    }
    frames.forEach(function(f){
      var img=f.querySelector('img'); if(!img)return;
      var pre=new Image();
      if(img.sizes)pre.sizes=img.sizes;
      if(img.srcset)pre.srcset=img.srcset;
      pre.src=img.currentSrc||img.src;
    });
    act(rows[0]);
    consider(rowAtMid());
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);
  });
  // accordion
  d.querySelectorAll('.acc-b').forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-expanded',b.getAttribute('aria-expanded')==='true'?'false':'true')})});
})();

/* pot docks at footer */
(function(){
  var pot=document.querySelector('.pot'), footer=document.querySelector('footer');
  if(!pot||!footer)return;
  var ticking=false, gap=32;
  function measureGap(){
    var base=window.matchMedia('(max-width:620px)').matches?16:32;
    var el=document.createElement('div');
    el.style.cssText='padding-bottom:env(safe-area-inset-bottom,0px);position:absolute;visibility:hidden;pointer-events:none';
    document.body.appendChild(el);
    var safe=parseFloat(getComputedStyle(el).paddingBottom)||0;
    el.remove();
    gap=base+safe;
  }
  function sync(){
    ticking=false;
    var ft=footer.getBoundingClientRect().top;
    pot.style.bottom=Math.max(gap, window.innerHeight-ft)+'px';
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(sync)}}
  function onResize(){measureGap();sync()}
  measureGap();
  sync();
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onResize);
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',onResize);
    window.visualViewport.addEventListener('scroll',onScroll,{passive:true});
  }
})();
(function(){document.querySelectorAll('.res-car').forEach(function(car){var t=car.querySelector('.res-mix');if(!t)return;var d=document,rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches,hold=false,vis=false;function step(){var c=t.querySelector('.res-card');return c?c.offsetWidth+parseFloat(getComputedStyle(t).columnGap||16):0}function max(){return t.scrollWidth-t.clientWidth}function go(dir){var s=step(),m=max();if(m<4)return;var cur=t.scrollLeft,d=dir||1;var x;if(d>0){x=cur>=m-4?0:Math.min(m,cur+s)}else{x=cur<=4?m:Math.max(0,cur-s)}t.scrollTo({left:x,behavior:rm?'auto':'smooth'})}function tick(){if(hold||!vis||d.hidden||rm)return;go(1)}var prev=car.querySelector('.res-arrow.prev'),nxt=car.querySelector('.res-arrow.next');if(prev)prev.addEventListener('click',function(){hold=true;go(-1)});if(nxt)nxt.addEventListener('click',function(){hold=true;go(1)});['mouseenter','touchstart','focusin'].forEach(function(e){car.addEventListener(e,function(){hold=true},{passive:true})});['mouseleave','focusout'].forEach(function(e){car.addEventListener(e,function(){hold=false})});t.addEventListener('touchend',function(){setTimeout(function(){hold=false},4000)},{passive:true});if('IntersectionObserver' in window){new IntersectionObserver(function(en){vis=en[0].isIntersecting},{threshold:0.35}).observe(t)}else vis=true;if(!rm)setInterval(tick,3500)})})();
(function(){
  var d=document,rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vids=[].slice.call(d.querySelectorAll('.res-card.vid video'));
  if(!vids.length)return;
  vids.forEach(function(v){
    var card=v.closest('.res-card');
    function setPaused(p){if(card)card.classList.toggle('is-paused',p)}
    setPaused(true);
    if(rm&&card)card.classList.add('rm');
    v.addEventListener('play',function(){setPaused(false)});
    v.addEventListener('pause',function(){setPaused(true)});
    function toggle(e){if(e)e.preventDefault();if(v.paused)v.play().catch(function(){});else v.pause()}
    var btn=card&&card.querySelector('.res-play');
    if(btn)btn.addEventListener('click',toggle);
    v.addEventListener('click',toggle);
  });
  if(!rm && 'IntersectionObserver' in window){
    var vio=new IntersectionObserver(function(en){
      en.forEach(function(x){
        if(x.isIntersecting){x.target.play().catch(function(){})}
        else{x.target.pause()}
      });
    },{threshold:0.45});
    vids.forEach(function(v){vio.observe(v)});
  }
})();
(function(){
  var top=document.querySelector('.top'), bar=top&&top.querySelector('.bar');
  if(!top)return;
  var mq=window.matchMedia('(max-width:980px)');
  var threshold=80;
  function sync(){
    if(bar && !top.classList.contains('is-compact') && bar.offsetHeight){threshold=Math.max(56, bar.offsetHeight-8)}
    top.classList.toggle('is-compact', !mq.matches && window.scrollY>threshold);
  }
  sync();
  window.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',sync);
})();

(function(){
  document.querySelectorAll('.lz-sum').forEach(function(b){
    b.addEventListener('click',function(){
      var open=b.getAttribute('aria-expanded')==='true';
      b.setAttribute('aria-expanded', open?'false':'true');
    });
  });
})();
