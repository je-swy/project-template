// src/js/cart-page.js
import { getCartItems, setCartItems } from './cart-ui.js';

function renderCart() {
  const items = getCartItems();
  const list = document.querySelector('#cart-items');
  const totalEl = document.querySelector('#cart-total');

  if (!list || !totalEl) return;

  if (!items.length) {
    list.innerHTML = '<li class="cart__empty">Cart is empty</li>';
    totalEl.textContent = '$0';
    return;
  }

  let total = 0;
  list.innerHTML = items.map(item => {
    const qty = Number(item.qty) || 1;
    total += item.price * qty;
    return `
      <li class="cart__item" data-id="${item.id}">
        <img src="${item.imageUrl}" alt="${item.name}" class="cart__img" />
        <div class="cart__info">
          <span class="cart__name">${item.name}</span>
          <span class="cart__price">$${item.price}</span>
          <span class="cart__qty">x${qty}</span>
        </div>
        <button class="cart__remove" data-id="${item.id}">✕</button>
      </li>
    `;
  }).join('');

  totalEl.textContent = `$${total.toFixed(2)}`;

  // remove buttons
  list.querySelectorAll('.cart__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const newCart = items.filter(p => String(p.id) !== String(id));
      setCartItems(newCart);
      renderCart();
    });
  });
}

document.addEventListener('DOMContentLoaded', renderCart);
window.addEventListener('cart-updated', renderCart);
