/* ============================================================
   ENERGHER — nav.js
   Hamburger toggle, full-panel overlay, smooth scroll, sticky nav
   ============================================================ */
(function () {
  'use strict';

  const toggle = document.getElementById('nav-toggle');
  const panel  = document.getElementById('nav-panel');
  if (!toggle || !panel) return;

  const links = panel.querySelectorAll('.nav-panel__link');
  const nav   = document.getElementById('main-nav');

  /* ── Open / Close ── */
  function openPanel() {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    panel.classList.contains('is-open') ? closePanel() : openPanel();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  /* ── Nav link click — smooth scroll or cross-page ── */
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      closePanel();

      // Pure hash link on same page
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      // Cross-page hash links (e.g. index.html#products) — let browser handle
    });
  });

  /* ── Sticky nav background on scroll ── */
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        nav.classList.toggle('nav--scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  /* ── Nav-panel inline newsletter (no-op submit) ── */
  const nlForm = document.getElementById('nav-nl-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input[type="email"]');
      if (input && input.value) {
        nlForm.innerHTML = '<p style="color:var(--color-accent);font-size:0.9rem;">Thanks! You\'re on the list.</p>';
      }
    });
  }
})();
