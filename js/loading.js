/* ============================================================
   ENERGHER — loading.js
   Animates the lightning bolt fill and fades out the loading screen.
   Skips animation on return visits within the same session.
   ============================================================ */
(function () {
  'use strict';

  const screen = document.getElementById('loading-screen');
  const bolt   = document.getElementById('loading-bar');
  if (!screen || !bolt) return;

  // Return visit within session — skip loading animation entirely
  if (sessionStorage.getItem('energher_loaded')) {
    screen.classList.add('is-hidden');
    document.body.classList.add('is-loaded');
    return;
  }

  // First visit — show full animation
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    bolt.classList.add('is-filling');
  }, 400);

  function finish() {
    setTimeout(() => {
      screen.classList.add('is-hidden');
      document.body.style.overflow = '';
      document.body.classList.add('is-loaded');
      sessionStorage.setItem('energher_loaded', '1');
    }, 2800);
  }

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
    setTimeout(finish, 5000);
  }
})();
