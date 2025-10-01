// src/js/cart.js

import { getCartItems, setCartItems } from './cart-ui.js';
import { loadProducts } from './products-data.js';

export function addToCart(product, quantity = 1) {
  const items = getCartItems();
  const key = String(product.id ?? '');

  if (!key) {
    console.error('Product has no ID.');
    return;
  }

  const existingIndex = items.findIndex(it => String(it.id ?? '') === key);

  if (existingIndex > -1) {
    // ОСЬ ТУТ БУЛА ПОМИЛКА (existing-index -> existingIndex)
    items[existingIndex].qty = (Number(items[existingIndex].qty) || 0) + quantity;
  } else {
    const cartItem = { ...product, qty: quantity };
    items.push(cartItem);
  }

  setCartItems(items);

  window.dispatchEvent(new CustomEvent('cart-updated'));
  console.log(`✅ Added ${quantity} of ${product.name} to cart.`);
}

export function attachCartDelegation() {
  document.body.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action="add-to-cart"]');
    if (!btn) return;

    if (btn.id === 'add-to-cart-btn') {
      return;
    }

    const id = btn.dataset.id;
    if (!id) return;

    if (!window.PRODUCTS || window.PRODUCTS.length === 0) {
      await loadProducts();
    }

    const product = window.PRODUCT_INDEX?.get(id) || window.PRODUCTS?.find(p => String(p.id) === String(id));
    if (!product) {
      console.warn(`Product with id "${id}" not found.`);
      return;
    }

    addToCart(product, 1);
  });
}