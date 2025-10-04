import { getCartItems, setCartItems, clearCart } from './cart-ui.js';
import { resolveAssetPath, esc } from './product-renderer.js';

const SHIPPING_COST = 30;
const DISCOUNT_THRESHOLD = 3000;
const DISCOUNT_PERCENT = 0.10;

function renderCart () {
  const items = getCartItems();
  const tableBody = document.getElementById('cart-items-body');
  const cartLayout = document.querySelector('.cart-layout');
  const emptyCartMessage = document.querySelector('.cart-empty-message');

  if (!tableBody || !cartLayout || !emptyCartMessage) return;

  if (items.length === 0) {
    cartLayout.hidden = true;
    emptyCartMessage.hidden = false;
  } else {
    cartLayout.hidden = false;
    emptyCartMessage.hidden = true;
  }

  tableBody.innerHTML = items.map(item => `
    <tr class="cart-item" data-key="${esc(item.cartKey)}">
      <td class="col-image">
        <img src="${esc(resolveAssetPath(item.imageUrl))}" alt="${esc(item.name)}" class="cart-item-img" />
      </td>
      <td class="col-product">
        <a href="/src/pages/product-details-template.html?id=${esc(item.id)}" class="cart-item-name">${esc(item.name)}</a>
      </td>
      <td class="col-price">$${item.price.toFixed(2)}</td>
      <td class="col-quantity">
        <div class="cart-item-qty">
          <button type="button" class="qty-btn" data-action="dec">-</button>
          <input type="number" value="${item.qty}" min="1" readonly />
          <button type="button" class="qty-btn" data-action="inc">+</button>
        </div>
      </td>
      <td class="col-total">$${(item.price * item.qty).toFixed(2)}</td>
      <td class="col-delete">
        <button type="button" class="cart-item-remove" aria-label="Remove item">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
        </button>
      </td>
    </tr>
  `).join('');

  updateSummary(items);
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

function updateSummary (items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_PERCENT : 0;
  const total = subtotal > 0 ? subtotal - discount + SHIPPING_COST : 0;

  document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summary-shipping').textContent = subtotal > 0 ? `$${SHIPPING_COST.toFixed(2)}` : '$0.00';

  const discountRow = document.querySelector('.summary-discount-row');
  if (discount > 0) {
    document.getElementById('summary-discount').textContent = `-$${discount.toFixed(2)}`;
    discountRow.hidden = false;
  } else {
    discountRow.hidden = true;
  }

  document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
}

function initCartPage () {
  renderCart();
  window.addEventListener('cart-updated', renderCart);

  const tableBody = document.getElementById('cart-items-body');
  if (tableBody) {
    tableBody.addEventListener('click', (event) => {
      const items = getCartItems();
      const target = event.target;
      const itemRow = target.closest('.cart-item');
      if (!itemRow) return;

      const itemKey = itemRow.dataset.key;
      const itemIndex = items.findIndex(item => item.cartKey === itemKey);
      if (itemIndex === -1) return;

      if (target.closest('[data-action="inc"]')) {
        items[itemIndex].qty++;
      } else if (target.closest('[data-action="dec"]')) {
        if (items[itemIndex].qty > 1) {
          items[itemIndex].qty--;
        } else {
          items.splice(itemIndex, 1);
        }
      } else if (target.closest('.cart-item-remove')) {
        items.splice(itemIndex, 1);
      }

      setCartItems(items);
      renderCart();
    });
  }

  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (getCartItems().length > 0 && confirm('Are you sure you want to clear the cart?')) {
        clearCart();
        renderCart();
      }
    });
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (getCartItems().length > 0) {
        alert('Thank you for your purchase.');
        clearCart();
        renderCart();
      } else {
        alert('Your cart is empty.');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initCartPage);
