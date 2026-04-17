(function(){
  var hdr=document.getElementById('hdr'),
      burger=document.getElementById('burger'),
      mnav=document.getElementById('mnav'),
      toTop=document.getElementById('toTop'),
      mCta=document.getElementById('mCta'),
      scrollProg=document.getElementById('scrollProg');

  // === PARALLAX ===
  var parallaxEls=document.querySelectorAll('.parallax-bg');

  // === SCROLL: header, progress, parallax, toTop ===
  var ticking=false;
  window.addEventListener('scroll',function(){
    var y=window.scrollY;
    hdr.classList.toggle('scrolled',y>60);
    toTop.classList.toggle('show',y>800);
    if(mCta)mCta.classList.toggle('show',y>500);

    // Scroll progress
    var h=document.documentElement.scrollHeight-window.innerHeight;
    scrollProg.style.width=(y/h*100)+'%';

    // Parallax
    if(!ticking){
      requestAnimationFrame(function(){
        parallaxEls.forEach(function(el){
          var speed=parseFloat(el.dataset.speed)||0.2;
          var rect=el.parentElement.getBoundingClientRect();
          if(rect.bottom>0&&rect.top<window.innerHeight){
            el.style.transform='translate3d(0,'+(y*speed)+'px,0) scale(1.15)';
          }
        });
        ticking=false;
      });
      ticking=true;
    }
  },{passive:true});

  // === HERO WORD SPLIT ===
  var heroH1=document.querySelector('.hero h1');
  if(heroH1){
    var html=heroH1.innerHTML;
    var parts=html.split(/(\s+|<[^>]+>)/);
    var out='',inTag=false,wordIdx=0;
    parts.forEach(function(p){
      if(p.match(/^</)){ out+=p; if(p.match(/^<em/))inTag=true; if(p.match(/^<\/em/))inTag=false; return; }
      if(p.match(/^\s+$/)){out+=p;return;}
      var delay=0.5+wordIdx*0.12;
      out+='<span class="hero-word" style="animation-delay:'+delay+'s">'+p+'</span>';
      wordIdx++;
    });
    heroH1.innerHTML=out;
    heroH1.style.opacity='1';heroH1.style.animation='none';heroH1.style.transform='none';
  }

  // === SCROLL TO TOP ===
  toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

  // === BURGER ===
  burger.addEventListener('click',function(){
    burger.classList.toggle('open');
    mnav.classList.toggle('open');
    document.body.style.overflow=mnav.classList.contains('open')?'hidden':'';
  });
  document.querySelectorAll('.mnav-link').forEach(function(a){
    a.addEventListener('click',function(){
      burger.classList.remove('open');mnav.classList.remove('open');document.body.style.overflow='';
    });
  });

  // === FAQ ===
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=this.closest('.faq-item'),open=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(el){el.classList.remove('open')});
      if(!open)item.classList.add('open');
    });
  });

  // === FORM ===
  var form=document.getElementById('leadForm'),
      wrap=document.getElementById('formWrap'),
      ok=document.getElementById('formOk');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var d=new FormData(form),o={};
    d.forEach(function(v,k){o[k]=v});
    console.log('Lead:',o);
    wrap.style.display='none';
    ok.classList.add('show');
  });

  // === TILT CARDS ===
  document.querySelectorAll('.tilt-card').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var rect=card.getBoundingClientRect();
      var x=(e.clientX-rect.left)/rect.width-.5;
      var y=(e.clientY-rect.top)/rect.height-.5;
      card.style.transform='perspective(800px) rotateY('+x*6+'deg) rotateX('+(-y*6)+'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='perspective(800px) rotateY(0) rotateX(0) translateY(0)';
    });
  });

  // === MAGNETIC BUTTONS ===
  document.querySelectorAll('.btn-fill,.btn-inv').forEach(function(btn){
    btn.addEventListener('mousemove',function(e){
      var rect=btn.getBoundingClientRect();
      var x=e.clientX-rect.left-rect.width/2;
      var y=e.clientY-rect.top-rect.height/2;
      btn.style.transform='translate('+x*0.15+'px,'+y*0.15+'px)';
    });
    btn.addEventListener('mouseleave',function(){
      btn.style.transform='';
    });
  });

  // === REVEAL ===
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}
    });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv,.rv-scale,.rv-left,.rv-right').forEach(function(el){obs.observe(el)});

  // === COUNTERS ===
  var cObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){countUp(e.target);cObs.unobserve(e.target)}
    });
  },{threshold:0.5});
  document.querySelectorAll('.stat-num[data-count]').forEach(function(el){cObs.observe(el)});

  function countUp(el){
    var target=parseInt(el.dataset.count),dur=2200,start=null;
    var suffix=el.querySelector('.suffix');
    var sfx=suffix?suffix.textContent:'';
    function step(ts){
      if(!start)start=ts;
      var p=Math.min((ts-start)/dur,1);
      var ease=1-Math.pow(1-p,3);
      var cur=Math.floor(ease*target);
      el.textContent=cur>=1000?cur.toLocaleString('ru-RU'):cur;
      if(suffix){var s=document.createElement('span');s.className='suffix';s.textContent=sfx;el.appendChild(s)}
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();
