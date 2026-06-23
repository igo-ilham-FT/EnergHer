/* ============================================================
   ENERGHER — product-detail.js
   - Scroll-driven can rotation
   - Orbit layout: CSS trig fallback for older browsers
   ============================================================ */
(function () {
  'use strict';

  /* ── Scroll-driven can rotation ── */
  const can = document.getElementById('pd-can');
  if (can) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const scrolled    = window.scrollY;
        const maxScroll   = document.documentElement.scrollHeight - window.innerHeight;
        const progress    = Math.min(scrolled / maxScroll, 1);
        const rotation    = progress * 320;
        can.style.transform = `rotateY(${rotation}deg)`;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  /* ── Orbit layout: JS fallback for no-CSS-trig browsers ── */
  const supportsTrig = CSS.supports('top', 'calc(50% + 1px * sin(45deg))');

  if (!supportsTrig) {
    document.querySelectorAll('.orbit-layout').forEach((layout) => {
      const items = layout.querySelectorAll('.orbit-item');
      const R = parseFloat(getComputedStyle(layout).getPropertyValue('--orbit-r') || '180');

      items.forEach((item) => {
        const angleDeg = parseFloat(
          item.style.getPropertyValue('--orbit-angle') || '0'
        );
        // Convert to radians; subtract 90° so 0deg = top (12 o'clock)
        const rad = (angleDeg - 90) * (Math.PI / 180);
        const W   = layout.offsetWidth;
        const H   = layout.offsetHeight;
        const cx  = W / 2;
        const cy  = H / 2;

        item.style.left = (cx + R * Math.cos(rad) - item.offsetWidth  / 2) + 'px';
        item.style.top  = (cy + R * Math.sin(rad) - item.offsetHeight / 2) + 'px';
        // Remove the CSS custom-property-driven positioning
        item.style.transform = 'none';
      });
    });
  }

  /* ── Flavor picker (EnergHer page) ── */
  const flavorPicker = document.querySelector('.flavor-picker');
  if (flavorPicker) {
    const flavors = {
      'pineapple-mango': {
        img: 'assets/can-her-front.png',
        desc: 'Pineapple &amp; Mango',
        ingredients: 'Water, Erythritol, Calcium lactate, Lion\u2019s mane extract, <strong>Soy isoflavones</strong>, Mango flavoring, Citric acid, Pineapple flavoring, Bitterness blocker, Guar gum, Red clover extract, Stevia, Vitamin B6',
        glow1: 'rgba(139, 170, 69, 0.38)',
        glow2: 'rgba(245, 195, 80, 0.32)'
      },
      'peach-raspberry': {
        img: 'assets/ENERGHER2.png',
        desc: 'Peach &amp; Raspberry',
        ingredients: 'Water, Erythritol, Calcium lactate, Lion\u2019s mane extract, <strong>Soy isoflavones</strong>, Peach flavoring, Citric acid, Raspberry flavoring, Bitterness blocker, Guar gum, Red clover extract, Stevia, Vitamin B6',
        glow1: 'rgba(232, 160, 184, 0.38)',
        glow2: 'rgba(245, 198, 160, 0.32)'
      }
    };

    const options = flavorPicker.querySelectorAll('.flavor-picker__option');
    options.forEach(option => {
      option.addEventListener('click', () => {
        const flavor = option.dataset.flavor;
        const data = flavors[flavor];
        if (!data) return;

        options.forEach(o => o.classList.remove('is-active'));
        option.classList.add('is-active');

        // Swap images
        const heroImg = document.getElementById('hero-can-img');
        const orbitImg = document.getElementById('orbit-can-img');
        const purchaseImg = document.getElementById('purchase-can-img');
        if (heroImg) { heroImg.src = data.img; heroImg.hidden = false; }
        if (orbitImg) { orbitImg.src = data.img; orbitImg.hidden = false; }
        if (purchaseImg) { purchaseImg.src = data.img; purchaseImg.hidden = false; }

        // Update text
        const descEl = document.getElementById('flavor-desc');
        if (descEl) descEl.innerHTML = data.desc;

        const ingredientsEl = document.getElementById('flavor-ingredients');
        if (ingredientsEl) ingredientsEl.innerHTML = data.ingredients;

        // Update purchase section flavor label
        const purchaseFlavor = document.getElementById('purchase-flavor');
        if (purchaseFlavor) purchaseFlavor.innerHTML = data.desc;

        // Update gradient glows
        document.body.style.setProperty('--glow-1', data.glow1);
        document.body.style.setProperty('--glow-2', data.glow2);
      });
    });
  }

  /* ── Bundle selector ── */
  const bundleOptions = document.querySelectorAll('.bundle-option');
  bundleOptions.forEach((label) => {
    const input = label.querySelector('input[type="radio"]');
    if (!input) return;

    // Disable members-only if not a member
    if (label.classList.contains('bundle-option--members')) {
      const isMember = localStorage.getItem('energher_member') === 'true';
      if (!isMember) {
        input.disabled = true;
        label.classList.add('is-locked');
        label.setAttribute('title', 'Available for members only — join below');
      }
    }

    label.addEventListener('click', () => {
      if (input.disabled) return;
      bundleOptions.forEach(l => l.classList.remove('is-selected'));
      label.classList.add('is-selected');
    });
  });

  // Select first available bundle on load
  const firstAvailable = document.querySelector('.bundle-option:not(.is-locked) input[type="radio"]');
  if (firstAvailable) {
    firstAvailable.checked = true;
    firstAvailable.closest('.bundle-option')?.classList.add('is-selected');
  }

  /* ── Quantity selector ── */
  const qtyVal   = document.getElementById('qty-val');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus  = document.getElementById('qty-plus');

  if (qtyVal && qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', () => {
      const v = parseInt(qtyVal.textContent, 10);
      if (v > 1) qtyVal.textContent = v - 1;
    });
    qtyPlus.addEventListener('click', () => {
      qtyVal.textContent = parseInt(qtyVal.textContent, 10) + 1;
    });
  }
})();
