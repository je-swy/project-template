// Storage helpers for cart

const CART_KEY = 'cart_v1';

// Retrieve cart items array from localStorage
// Returns empty array if none or on parse error.
export function getCartItems () {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (e) {
    console.warn('getCartItems parse error', e);
    return [];
  }
}

// Save cart items array to localStorage
// Always returns the items array.
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

// Clear cart completely
export function clearCart () {
  try {
    localStorage.removeItem(CART_KEY);
    globalThis.dispatchEvent(new CustomEvent('cart-updated', { detail: { items: [] } }));
  } catch (e) {
    console.warn('Could not clear cart', e);
  }
}
