/* ============================================================
   ENERGHER — cart.js
   Cart state (localStorage), drawer UI, checkout summary
   ============================================================ */
const Cart = (function () {
  'use strict';

  const STORAGE_KEY  = 'energher_cart';

  /* ── State ── */
  let items = [];

  function load() {
    try {
      items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (_) {
      items = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  /* ── Mutations ── */
  function add(product, qty, bundleQty, price) {
    const idx = items.findIndex(i => i.product === product && i.bundleQty === bundleQty);
    if (idx > -1) {
      items[idx].qty += qty;
    } else {
      items.push({ product, qty, bundleQty, price });
    }
    save();
    render();
    openDrawer();
  }

  function remove(index) {
    items.splice(index, 1);
    save();
    render();
  }

  function updateQty(index, delta) {
    if (!items[index]) return;
    items[index].qty = Math.max(1, items[index].qty + delta);
    save();
    render();
  }

  /* ── Computed ── */
  function getSubtotal() {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getTotalCans() {
    return items.reduce((sum, i) => sum + i.bundleQty * i.qty, 0);
  }

  /* ── Render drawer ── */
  function render() {
    const container  = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const warningEl  = document.getElementById('cart-warning');
    const checkoutBtn= document.getElementById('cart-checkout');
    const countBadge = document.getElementById('cart-count');

    // Update cart count badge if present
    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    if (countBadge) {
      countBadge.textContent = totalItems;
      countBadge.hidden = totalItems === 0;
    }

    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = '<p class="cart-empty">Your basket is empty.</p>';
    } else {
      container.innerHTML = items.map((item, i) => {
        const isHim = item.product.toLowerCase().includes('him');
        const isPeach = item.product.toLowerCase().includes('peach');
        const imgSrc = isHim ? 'assets/energhim.png' : (isPeach ? 'assets/ENERGHER2.png' : 'assets/can-her-front.png');
        const variant = isHim ? 'him' : 'her';
        return `
        <div class="cart-item">
          <div class="cart-item__can can can--xs can--${variant}">
            <img src="${imgSrc}" alt="${item.product} Can" class="can__img"
                 onerror="this.hidden=true">
            <div class="can__body">
              <div class="can__label">
                <span class="can__label-text">${isHim ? 'Him' : 'Her'}</span>
              </div>
              <div class="can__shine"></div>
            </div>
            <div class="can__top"></div>
            <div class="can__bottom"></div>
          </div>
          <div class="cart-item__info">
            <p class="cart-item__name">${item.product}</p>
            <p class="cart-item__meta">${item.bundleQty}-Pack</p>
            <div class="cart-item__qty-row">
              <button class="cart-qty-btn" data-action="dec" data-index="${i}" aria-label="Decrease quantity">−</button>
              <span class="cart-item__qty">${item.qty}</span>
              <button class="cart-qty-btn" data-action="inc" data-index="${i}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="cart-item__right">
            <p class="cart-item__price">€${(item.price * item.qty).toFixed(2)}</p>
            <button class="cart-item__remove" data-index="${i}" aria-label="Remove item">×</button>
          </div>
        </div>
      `}).join('');
    }

    // Update subtotal
    if (subtotalEl) subtotalEl.textContent = '€' + getSubtotal().toFixed(2);

    // Enable checkout if cart has items
    if (warningEl)   warningEl.hidden = true;
    if (checkoutBtn) checkoutBtn.classList.toggle('btn--disabled', items.length === 0);

    // Bind qty + remove buttons
    container.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx    = parseInt(btn.dataset.index, 10);
        const action = btn.dataset.action;
        updateQty(idx, action === 'inc' ? 1 : -1);
      });
    });
    container.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        remove(parseInt(btn.dataset.index, 10));
      });
    });

    // Sync checkout page if we're on it
    renderCheckout();
  }

  /* ── Render checkout summary ── */
  function renderCheckout() {
    const itemsEl = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    if (!itemsEl) return;

    if (items.length === 0) {
      itemsEl.innerHTML = '<p class="checkout-empty">No items in basket.</p>';
    } else {
      itemsEl.innerHTML = items.map(i => `
        <div class="checkout-item">
          <span>${i.product} ${i.bundleQty}-Pack ×${i.qty}</span>
          <span>€${(i.price * i.qty).toFixed(2)}</span>
        </div>
      `).join('');
    }

    if (totalEl) {
      totalEl.textContent = '€' + getSubtotal().toFixed(2);
    }
  }

  /* ── Drawer open/close ── */
  function showToast(msg) {
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 350);
    }, 2500);
  }

  function openDrawer() {
    const drawer  = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const drawer  = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  /* ── Init ── */
  function init() {
    load();
    render();

    // Add-to-cart button
    const addBtn = document.getElementById('add-to-cart');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const selectedInput = document.querySelector('.bundle-option:not(.is-locked) input[name="bundle"]:checked')
                           || document.querySelector('input[name="bundle"]:not(:disabled):checked');
        const bundleLabel   = selectedInput?.closest('.bundle-option');
        const qty     = parseInt(document.getElementById('qty-val')?.textContent || '1', 10);
        const bundleQty = parseInt(bundleLabel?.dataset.qty || '4', 10);
        const price     = parseFloat(bundleLabel?.dataset.price || '11.90');
        let name = document.querySelector('.pd-hero__bg-text')?.textContent?.trim()
                || document.querySelector('.pd-hero__subtitle')?.textContent?.replace(/^Formulated for /, '').trim()
                || (document.title.includes('Him') ? 'EnergHim' : 'EnergHer');
        // Append selected flavor for EnergHer
        const activeFlavor = document.querySelector('.flavor-picker__option.is-active');
        if (activeFlavor) {
          const flavorName = activeFlavor.querySelector('.flavor-picker__name')?.textContent?.trim();
          if (flavorName) name = name + ' — ' + flavorName;
        }
        add(name, qty, bundleQty, price);
        showToast(`Added ${bundleQty}-Pack to basket`);
      });
    }

    // Close drawer
    document.getElementById('cart-close')?.addEventListener('click', closeDrawer);
    document.getElementById('cart-overlay')?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    // Cart icon button (if any)
    document.getElementById('cart-icon-btn')?.addEventListener('click', openDrawer);

    // Checkout submit with inline validation
    document.getElementById('checkout-submit')?.addEventListener('click', (e) => {
      e.preventDefault();
      const form = document.getElementById('checkout-form');
      if (!form) return;

      // Clear previous errors
      form.querySelectorAll('.checkout-error').forEach(el => el.remove());
      form.querySelectorAll('.checkout-input--error').forEach(el => el.classList.remove('checkout-input--error'));

      const inputs = form.querySelectorAll('[required]');
      let valid = true;
      let firstInvalid = null;

      inputs.forEach(inp => {
        let errorMsg = '';
        const val = inp.value.trim();

        if (inp.type === 'checkbox' && !inp.checked) {
          errorMsg = 'You must accept the terms to continue.';
        } else if (!val) {
          const label = inp.closest('.full-width, div')?.querySelector('.checkout-input-label')?.textContent
                     || inp.getAttribute('aria-label') || 'This field';
          errorMsg = `${label.replace(' *', '')} is required.`;
        } else if (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errorMsg = 'Please enter a valid email address.';
        } else if (inp.type === 'tel' && val.length < 7) {
          errorMsg = 'Please enter a valid phone number.';
        }

        if (errorMsg) {
          valid = false;
          if (inp.type === 'checkbox') {
            const errorEl = document.createElement('p');
            errorEl.className = 'checkout-error';
            errorEl.textContent = errorMsg;
            inp.closest('.checkout-terms')?.after(errorEl);
          } else {
            inp.classList.add('checkout-input--error');
            const errorEl = document.createElement('p');
            errorEl.className = 'checkout-error';
            errorEl.textContent = errorMsg;
            inp.after(errorEl);
          }
          if (!firstInvalid) firstInvalid = inp;
        }
      });

      if (firstInvalid) firstInvalid.focus();

      if (valid) {
        localStorage.removeItem(STORAGE_KEY);
        document.getElementById('checkout-success')?.removeAttribute('hidden');
        document.getElementById('checkout-form-wrap')?.setAttribute('hidden', '');
      }
    });

    // Membership form submit — unlock members bundles
    const memberForm = document.getElementById('membership-form');
    if (memberForm) {
      memberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('energher_member', 'true');
        memberForm.innerHTML = '<p class="form-success">Welcome to the EnergHer community! Members-only bundles are now unlocked.</p>';
        // Reload bundle options if on product page
        document.querySelectorAll('.bundle-option--members').forEach(label => {
          label.classList.remove('is-locked');
          const inp = label.querySelector('input');
          if (inp) inp.disabled = false;
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return { add, remove, openDrawer, closeDrawer, render };
})();
