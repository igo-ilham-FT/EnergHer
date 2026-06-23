/* ============================================================
   ENERGHER — story-timeline.js
   Horizontal scroll-hijacked timeline powered by GSAP ScrollTrigger
   ============================================================ */
(function () {
  'use strict';

  var story = document.querySelector('.story');
  if (!story) return;

  var pinWrap  = story.querySelector('.story__pin-wrap');
  var timeline = story.querySelector('.timeline');
  var line     = story.querySelector('.timeline__wave');
  var items    = story.querySelectorAll('.timeline__item');
  var hint     = story.querySelector('.story__scroll-hint');

  // ── Reduced motion: show everything immediately, no GSAP ──
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (item) {
      item.classList.add('is-visible');
      item.classList.remove('js-reveal');
    });
    if (line) line.style.transform = 'scaleX(1)';
    return;
  }

  // ── Guard: GSAP must be loaded ──
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    items.forEach(function (item) {
      item.style.opacity = '1';
      item.style.transform = 'none';
      item.classList.add('is-visible');
    });
    if (line) line.style.transform = 'scaleX(1)';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── Desktop-only scroll hijacking via matchMedia ──
  ScrollTrigger.matchMedia({

    // ═══════════════════════════════════
    // DESKTOP (> 640px)
    // ═══════════════════════════════════
    '(min-width: 641px)': function () {

      var hintHidden = false;

      // ── Main horizontal tween (pin + scrub) ──
      var getDistance = function () { return timeline.scrollWidth - window.innerWidth; };
      var mainTween = gsap.to(timeline, {
        x: function () { return -getDistance(); },
        ease: 'none',
        scrollTrigger: {
          trigger: story,
          pin: pinWrap,
          scrub: 0.8,
          start: 'top top',
          end: function () { return '+=' + timeline.scrollWidth; },
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            if (!hintHidden && hint && self.progress > 0.015) {
              hintHidden = true;
              hint.classList.add('is-hidden');
            }
          }
        }
      });

      // ── Progressive line draw ──
      if (line) {
        gsap.to(line, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: story,
            start: 'top top',
            end: function () { return '+=' + timeline.scrollWidth; },
            scrub: 0.8
          }
        });
      }

      // ── Per-item reveals + active highlighting ──
      items.forEach(function (item, i) {

        gsap.fromTo(item,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              containerAnimation: mainTween,
              start: i === 0 ? 'left 95%' : 'left 82%',
              toggleActions: 'play none none reverse'
            },
            onComplete: function () {
              item.classList.add('is-visible');
            }
          }
        );

        ScrollTrigger.create({
          trigger: item,
          containerAnimation: mainTween,
          start: 'center 62%',
          end: 'center 38%',
          onToggle: function (self) {
            if (self.isActive) {
              item.classList.add('timeline__item--active');
            } else {
              item.classList.remove('timeline__item--active');
            }
          }
        });
      });

      // ── Decorative line art growth animations ──
      var decos = timeline.querySelectorAll('.timeline__deco');
      decos.forEach(function (deco) {
        gsap.to(deco, {
          opacity: 0.7,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: deco,
            containerAnimation: mainTween,
            start: 'left 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      // ── Parallax background text ──
      gsap.fromTo(story, {
        '--parallax-y': '-15px'
      }, {
        '--parallax-y': '25px',
        ease: 'none',
        scrollTrigger: {
          trigger: story,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

    },

    // ═══════════════════════════════════
    // MOBILE (<= 640px) — no scroll hijacking
    // ═══════════════════════════════════
    '(max-width: 640px)': function () {
      items.forEach(function (item) {
        item.classList.add('is-visible');
        item.classList.remove('js-reveal');
      });
      if (line) line.style.transform = 'scaleX(1)';

      if (timeline && hint) {
        var scrolled = false;
        timeline.addEventListener('scroll', function () {
          if (!scrolled && timeline.scrollLeft > 30) {
            scrolled = true;
            hint.classList.add('is-hidden');
          }
        }, { passive: true });
      }
    }

  });

})();
