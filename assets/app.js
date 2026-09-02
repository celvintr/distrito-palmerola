/* ===== Distrito Palmerola — interacciones ===== */
(function () {
  'use strict';

  // Preloader (con respaldo por tiempo para que nunca quede pegado)
  var pre = document.getElementById('preloader');
  function dismissPre() { if (pre) pre.classList.add('done'); }
  window.addEventListener('load', function () { setTimeout(dismissPre, 1000); });
  setTimeout(dismissPre, 2600);

  // Año footer
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Nav solid on scroll
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('solid');
    else nav.classList.remove('solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  function toggleMenu(force) {
    var open = force !== undefined ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { toggleMenu(); });
  menu && menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  // Reveal en cascada por sección (basado en scroll — robusto, con failsafe)
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    var sel = [
      '.reveal',
      '.section .eyebrow', '.section h2', '.section .lead',
      '.info', '.sp-card', '.fase-card', '.amen', '.fig', '.stat', '.pillar',
      '.prog', '.plate', '.sw', '.mp-card', '.aliado', '.data-card', '.logo-box', '.uso',
      '.split-img', '.ubi-map', '.plan-figure', '.radar-wrap', '.credit', '.values',
      '.cta-form', '.contact-lines', '.gal-strip figure', '.grid-gal .g',
      '.hero-eyebrow', '.hero h1', '.hero-sub', '.hero-actions', '.hero-spec .spec',
      '.statement .mark', '.statement h2', '.statement .tag'
    ].join(',');

    var els = [].slice.call(document.querySelectorAll(sel)).filter(function (el) {
      return el.parentElement && !el.parentElement.closest(sel);
    });

    var counts = new Map();
    els.forEach(function (el) {
      var key = el.parentElement;
      var idx = counts.get(key) || 0;
      counts.set(key, idx + 1);
      el.classList.add(el.matches('.split-img, .ubi-map, .plan-figure') ? 'rv-img' : 'rv');
      el.style.transitionDelay = Math.min(idx * 70, 420) + 'ms';
    });

    var pending = els.slice();
    function revealPass() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = pending.length - 1; i >= 0; i--) {
        var r = pending[i].getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > -50) { pending[i].classList.add('in'); pending.splice(i, 1); }
      }
      if (!pending.length) window.removeEventListener('scroll', onScrollRev);
    }
    var ticking = false;
    function onScrollRev() {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { revealPass(); ticking = false; }); }
    }
    window.addEventListener('scroll', onScrollRev, { passive: true });
    window.addEventListener('resize', onScrollRev, { passive: true });
    setTimeout(revealPass, 1150);   // primera pasada tras el preloader (entrada del hero)
    window.addEventListener('load', revealPass);
    setTimeout(function () { pending.forEach(function (el) { el.classList.add('in'); }); pending.length = 0; }, 4500); // failsafe: nada queda oculto
  }

  // Count-up
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var prog = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.round(target * eased);
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { countIO.observe(el); });

  // Hero parallax (suave)
  var media = document.querySelector('[data-parallax] img');
  if (media && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) media.style.transform = 'translateY(' + y * 0.18 + 'px) scale(1.08)';
    }, { passive: true });
  }

  // Form (demo — el envío real se conecta en producción)
  window.DP = {
    submit: function (ev) {
      ev.preventDefault();
      var ok = document.getElementById('formOk');
      if (ok) ok.hidden = false;
      ev.target.reset();
      return false;
    }
  };
})();
