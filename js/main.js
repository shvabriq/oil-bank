/* OIL BANK DETAILING — site behaviour (no dependencies) */
(function(){

  /* header background on scroll */
  var header = document.querySelector('.site-header');
  if(header){
    var onScroll = function(){
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded','false');
      });
    });
  }

  /* footer year */
  var yearEl = document.querySelector('[data-year]');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  /* services sub-nav: highlight active pill while scrolling */
  var subnavLinks = document.querySelectorAll('.subnav a');
  if(subnavLinks.length){
    var targets = [];
    subnavLinks.forEach(function(link){
      var id = link.getAttribute('href');
      if(id && id.charAt(0) === '#'){
        var section = document.querySelector(id);
        if(section){ targets.push({link:link, section:section}); }
      }
    });
    if(targets.length && 'IntersectionObserver' in window){
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          var match = targets.find(function(t){ return t.section === entry.target; });
          if(match && entry.isIntersecting){
            subnavLinks.forEach(function(l){ l.classList.remove('is-active'); });
            match.link.classList.add('is-active');
          }
        });
      }, {rootMargin:'-35% 0px -55% 0px', threshold:0});
      targets.forEach(function(t){ obs.observe(t.section); });
    }
  }

  /* front-end only form handling: no backend wired up yet */
  var forms = document.querySelectorAll('.js-form');
  forms.forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var success = form.querySelector('.form-success');
      form.classList.add('is-sent');
      if(success){ success.classList.add('is-visible'); }
    });
  });

})();


/* ===== gallery slider ===== */
(function(){
  var wrap   = document.querySelector('.gallery-slider-wrap');
  if(!wrap) return;

  var track  = wrap.querySelector('.ob-gallery-track');
  var slides = Array.from(wrap.querySelectorAll('.ob-slide'));
  var dotsEl = wrap.querySelector('.ob-gallery-dots');
  var prevBtn = wrap.querySelector('.gallery-btn-prev');
  var nextBtn = wrap.querySelector('.gallery-btn-next');
  var total  = slides.length;
  var cur    = 0;
  var timer;
  var startX = 0;
  var dragging = false;

  // build dots
  var dots = slides.map(function(_, i){
    var d = document.createElement('button');
    d.className = 'ob-dot';
    d.setAttribute('aria-label', 'Слайд ' + (i+1));
    d.addEventListener('click', function(){ go(i); });
    dotsEl.appendChild(d);
    return d;
  });

  function go(n){
    slides[cur].classList.remove('is-active');
    dots[cur].classList.remove('is-active');
    cur = (n + total) % total;
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    slides[cur].classList.add('is-active');
    dots[cur].classList.add('is-active');
  }

  function startAuto(){
    timer = setInterval(function(){ go(cur+1); }, 4500);
  }
  function stopAuto(){ clearInterval(timer); }

  go(0);
  startAuto();

  if(prevBtn) prevBtn.addEventListener('click', function(){ stopAuto(); go(cur-1); startAuto(); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ stopAuto(); go(cur+1); startAuto(); });

  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);

  // touch / swipe
  wrap.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; dragging=true; }, {passive:true});
  wrap.addEventListener('touchend', function(e){
    if(!dragging) return;
    var dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){ stopAuto(); go(dx < 0 ? cur+1 : cur-1); startAuto(); }
    dragging = false;
  });

  // keyboard
  document.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft'){ stopAuto(); go(cur-1); startAuto(); }
    if(e.key === 'ArrowRight'){ stopAuto(); go(cur+1); startAuto(); }
  });
})();
