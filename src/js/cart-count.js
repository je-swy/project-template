// Cart count UI logic
import { getCartItems } from './cart-ui.js';

const CART_COUNT_SELECTOR = '.cart-count';

// Compute total quantity from cart items array
export function computeCartTotal (items = []) {
  return items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}

// Update cart count UI element based on current cart contents
export function updateCartCountUI () {
  const el = document.querySelector(CART_COUNT_SELECTOR);
  if (!el) return;
  const items = getCartItems();
  const total = computeCartTotal(items);
  // Update DOM element
  el.dataset.count = total;
  el.textContent = total > 0 ? String(total) : '0';
  el.setAttribute('aria-hidden', total === 0 ? 'true' : 'false');
  // Show/hide based on count
  if (total > 0) el.classList.add('is-visible'); else el.classList.remove('is-visible');
}

// Initialize cart count UI and set up event listeners for updates
// This handles updates from other tabs (storage event) and in-window updates (custom event)
export function initCartCountAuto () {
  updateCartCountUI();

  // Listen to storage events (other tabs/windows)
  globalThis.addEventListener('storage', (e) => {
    if (e.key === 'cart_v1') updateCartCountUI();
  });

  // Also listen to custom in-window event fired when cart updated
  globalThis.addEventListener('cart-updated', () => {
    updateCartCountUI();
  });
}
