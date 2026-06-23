/* ============================================================
   ENERGHER — cursor-trail.js
   Glowing particle trail that follows the cursor
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const MAX_PARTICLES = 55;

  // Fixed overlay, no pointer events
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0', left: '0',
    pointerEvents: 'none',
    zIndex: '9998',
  });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('mousemove', (e) => {
    // Cap particle count
    if (particles.length >= MAX_PARTICLES) particles.shift();

    particles.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4 - 0.5,
      life: 1.0,
      radius: Math.random() * 5 + 2,
      // Golden-amber to green hue range: 35-95
      hue: Math.random() * 60 + 35,
      sat: Math.round(Math.random() * 30 + 50),
    });
  });

  function animate() {
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life  -= 0.034;
      p.x     += p.vx;
      p.y     += p.vy;
      p.radius *= 0.964;

      if (p.life <= 0 || p.radius < 0.4) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life * 0.85;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      // Glow via shadow
      ctx.shadowColor = `hsl(${p.hue}, ${p.sat}%, 55%)`;
      ctx.shadowBlur  = 14;
      ctx.fillStyle   = `hsl(${p.hue}, ${p.sat}%, 72%)`;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
