/* ============================================================
   ENERGHER — carousel.js
   Products carousel: arrows, dots, keyboard, touch/swipe
   ============================================================ */
(function () {
  'use strict';

  const track = document.getElementById('carousel-track');
  if (!track) return;

  const cards   = Array.from(track.querySelectorAll('.carousel__card'));
  const total   = cards.length;
  if (total < 2) return;

  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  const dotsWrap = document.getElementById('carousel-dots');
  const counter  = document.getElementById('carousel-counter');

  let current    = 0;
  let touchStartX = 0;
  let isDragging  = false;

  /* ── Helpers ── */
  function getSlideOffset() {
    // Width of one card + gap
    const card = cards[0];
    const gap  = parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.carousel__dot').forEach((d, i) => {
      d.classList.toggle('carousel__dot--active', i === current);
    });
  }

  function updateCounter() {
    if (!counter) return;
    counter.textContent = `${current + 1} / ${total}`;
  }

  function updateAriaLabels() {
    cards.forEach((card, i) => {
      card.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });
  }

  function goTo(index, instant = false) {
    current = ((index % total) + total) % total;

    if (instant) {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(-${current * getSlideOffset()}px)`;
    if (instant) {
      // Re-enable transition on next frame
      requestAnimationFrame(() => {
        track.style.transition = '';
      });
    }

    updateDots();
    updateCounter();
    updateAriaLabels();
  }

  /* ── Arrow buttons ── */
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  /* ── Dots ── */
  dotsWrap?.querySelectorAll('.carousel__dot').forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  /* ── Keyboard ── */
  document.addEventListener('keydown', (e) => {
    // Only when carousel is in viewport
    const rect = track.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  /* ── Touch / swipe ── */
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isDragging  = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) goTo(current + (diff > 0 ? 1 : -1));
  }, { passive: true });

  track.addEventListener('touchcancel', () => { isDragging = false; });

  /* ── Recalc on resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(current, true), 150);
  }, { passive: true });

  /* ── Init ── */
  goTo(0, true);
})();
