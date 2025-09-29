// src/js/cart-ui.js
// Storage helpers for cart. No DOM logic here.

const CART_KEY = 'cart_v1';

/**
 * Return cart items array from localStorage.
 * Always returns an array.
 */
export function getCartItems () {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (e) {
    console.warn('getCartItems parse error', e);
    return [];
  }
}

/**
 * Persist cart items array to localStorage.
 * Returns the items for convenience.
 */
export function setCartItems (items = []) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    // Update storage event manually for other windows is automatic;
    // for same-window listeners we fire a custom event (handled in cart.js and cart-count.js)
  } catch (e) {
    console.warn('Could not save cart', e);
  }
  return items;
}

/**
 * Clear cart.
 */
export function clearCart () {
  try {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items: [] } }));
  } catch (e) {
    console.warn('Could not clear cart', e);
  }
}
