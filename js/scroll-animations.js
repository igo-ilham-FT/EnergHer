/* ============================================================
   ENERGHER — scroll-animations.js
   IntersectionObserver reveal for .js-reveal elements
   ============================================================ */
(function () {
  'use strict';

  const items = document.querySelectorAll('.js-reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold:   0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  items.forEach((el) => {
    // Skip timeline items on desktop — GSAP ScrollTrigger handles them
    if (el.closest('.timeline') && window.innerWidth > 640 && window.gsap) return;
    observer.observe(el);
  });
})();
