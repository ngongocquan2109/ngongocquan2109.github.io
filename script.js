(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Count-up numbers
  var counters = document.querySelectorAll('[data-count]');
  function run(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var start = null, dur = 1400;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }
})();
