// src/js/cart.js
// Delegation for add-to-cart buttons.
// Uses cart storage helpers from cart-ui.js

import { getCartItems, setCartItems } from './cart-ui.js';
import { loadProducts } from './products-data.js';

export function attachCartDelegation() {
  document.body.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action="add-to-cart"]');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    // Ensure products loaded so PRODUCT_INDEX is available
    if (!window.PRODUCTS || window.PRODUCTS.length === 0) {
      await loadProducts();
    }

    // Try to find product by id or renderer id
    const product = window.PRODUCT_INDEX?.get(id) || window.PRODUCTS?.find(p => String(p.id) === String(id));
    if (!product) {
      console.warn(`Product with id "${id}" not found.`);
      return;
    }

    addToCart(product);
  });
}

function addToCart(product) {
  const items = getCartItems(); // array of items in cart { ...product, qty }
  // Use unique key for cart item: product id (prefer id, fallback to _rendererId)
  const key = String(product.id ?? product._rendererId ?? product.sku ?? '');

  const existingIndex = items.findIndex(it => String(it.id ?? it._rendererId ?? it.sku ?? '') === key);

  if (existingIndex > -1) {
    // increment qty
    items[existingIndex].qty = (Number(items[existingIndex].qty) || 0) + 1;
  } else {
    // clone minimal product data to cart with qty
    const cartItem = Object.assign({}, product);
    cartItem.qty = 1;
    items.push(cartItem);
  }

  setCartItems(items);

  // Notify other listeners in same window/tab
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items } }));

  console.log('✅ Added to cart:', product.id ?? product._rendererId);
}
