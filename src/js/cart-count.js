// src/js/cart-count.js
// Cart counter UI logic (reads from storage).

import { getCartItems } from './cart-ui.js';

const CART_COUNT_SELECTOR = '.cart-count';

/**
 * Compute total quantity across items.
 */

export function computeCartTotal (items = []) {
  return items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}

/**
 * Update the DOM counter: data-count, textContent, aria-hidden, is-visible class.
 */

export function updateCartCountUI () {
  const el = document.querySelector(CART_COUNT_SELECTOR);
  if (!el) return;
  const items = getCartItems();
  const total = computeCartTotal(items);

  el.setAttribute('data-count', String(total));
  el.textContent = total > 0 ? String(total) : '0';
  el.setAttribute('aria-hidden', total === 0 ? 'true' : 'false');

  if (total > 0) el.classList.add('is-visible'); else el.classList.remove('is-visible');
}

/**
 * Initialize counter UI and subscribe to storage events to stay in sync across tabs.
 * Call this after DOM is ready.
 */
export function initCartCountAuto () {
  updateCartCountUI();

  // Listen to storage events (other tabs/windows)
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart_v1') updateCartCountUI();
  });

  // Also listen to custom in-window event fired when cart updated
  window.addEventListener('cart-updated', () => {
    updateCartCountUI();
  });
}
