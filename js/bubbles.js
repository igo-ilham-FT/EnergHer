/* ============================================================
   ENERGHER — bubbles.js
   Floating bubble effect on hero after 10s of idle
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('bubble-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let bubbles    = [];
  let animActive = false;
  let animId     = null;
  let idleTimer  = null;
  const MAX_BUBBLES = 35;

  function resize() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    W = canvas.width  = rect.width;
    H = canvas.height = rect.height;
  }
  resize();
  window.addEventListener('resize', () => { resize(); }, { passive: true });

  function spawnBubble() {
    if (bubbles.length >= MAX_BUBBLES) return;
    const r = Math.random() * 18 + 6;
    bubbles.push({
      x:     Math.random() * W,
      y:     H + r + 10,
      r:     r,
      vy:    -(Math.random() * 0.7 + 0.3),
      alpha: Math.random() * 0.35 + 0.1,
      wobble:      Math.random() * Math.PI * 2,
      wobbleSpeed: (Math.random() - 0.5) * 0.025,
      hue: Math.random() * 40 + 40,   // golden-yellow to green
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.y       += b.vy;
      b.wobble  += b.wobbleSpeed;
      b.x       += Math.sin(b.wobble) * 0.6;

      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);

      // Stroke outline
      ctx.strokeStyle = `hsla(${b.hue}, 55%, 40%, 0.7)`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Radial fill (inner shimmer)
      const grad = ctx.createRadialGradient(
        b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.08,
        b.x, b.y, b.r
      );
      grad.addColorStop(0, 'rgba(255,255,255,0.45)');
      grad.addColorStop(1, `hsla(${b.hue}, 55%, 60%, 0.08)`);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // Remove if above canvas
      if (b.y + b.r < 0) bubbles.splice(i, 1);
    }

    // Occasionally spawn new bubbles while active
    if (animActive && Math.random() < 0.05) spawnBubble();

    if (bubbles.length > 0 || animActive) {
      animId = requestAnimationFrame(drawFrame);
    }
  }

  function startBubbles() {
    if (animActive) return;
    animActive = true;
    drawFrame();
  }

  function stopBubbles() {
    if (!animActive) return;
    animActive = false;
    // Let bubbles drift off screen naturally (cancel after 5s)
    setTimeout(() => {
      cancelAnimationFrame(animId);
      bubbles = [];
      ctx.clearRect(0, 0, W, H);
    }, 5000);
  }

  function resetIdleTimer() {
    stopBubbles();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startBubbles, 10000);
  }

  // Start idle countdown immediately
  resetIdleTimer();

  // Reset on any interaction
  ['scroll', 'mousemove', 'keydown', 'touchstart', 'click'].forEach(evt =>
    window.addEventListener(evt, resetIdleTimer, { passive: true })
  );
})();
