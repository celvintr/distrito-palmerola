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

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
    io.observe(el);
  });

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
