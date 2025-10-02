// src/js/cart.js

import { getCartItems, setCartItems } from './cart-ui.js';
import { loadProducts } from './products-data.js';

// Функція для створення унікального ключа для товару в кошику
function getCartItemKey(product) {
  const size = product.size || 'default';
  const color = product.color || 'default';
  return `${product.id}-${size}-${color}`;
}

// ЦЯ ФУНКЦІЯ ПОВИННА БУТИ ЕКСПОРТОВАНА
export function addToCart(product, quantity = 1) {
  const items = getCartItems();
  const itemKey = getCartItemKey(product);

  const existingIndex = items.findIndex(item => item.cartKey === itemKey);

  if (existingIndex > -1) {
    items[existingIndex].qty += quantity;
  } else {
    const cartItem = { ...product, qty: quantity, cartKey: itemKey };
    items.push(cartItem);
  }

  setCartItems(items);
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

// І ЦЯ ФУНКЦІЯ ТАКОЖ ПОВИННА БУТИ ЕКСПОРТОВАНА
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
      // Використовуємо абсолютний шлях для надійності
      await loadProducts('/src/assets/data.json');
    }

    const product = window.PRODUCT_INDEX?.get(id) || window.PRODUCTS?.find(p => String(p.id) === String(id));
    if (!product) {
      console.warn(`Product with id "${id}" not found.`);
      return;
    }

    addToCart(product, 1);
  });
}