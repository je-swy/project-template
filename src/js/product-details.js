// src/js/product-details.js

import { loadProducts } from './products-data.js';
import { renderBlock, resolveAssetPath, esc } from './product-renderer.js';
import { addToCart } from './cart.js';

function renderRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  const starsHTML = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  return `<div class="product-details__rating" aria-label="Rating: ${rating} out of 5 stars">${starsHTML}</div>`;
}

function handleTabs() {
  const tabContainer = document.querySelector('.product-tabs-container');
  if (!tabContainer) return;

  const tabButtons = tabContainer.querySelectorAll('.product-tabs__btn');
  const tabPanes = tabContainer.querySelectorAll('.product-tabs__pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Деактивуємо всі кнопки та панелі
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // Активуємо натиснуту кнопку та відповідну панель
      const tabId = button.dataset.tab;
      const activePane = document.getElementById(`tab-${tabId}`);
      
      button.classList.add('active');
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });
}

function handleReviewForm() {
    const form = document.getElementById('review-form');
    if (!form) return;

    const messageEl = document.getElementById('review-form-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('review-name');
        const textInput = document.getElementById('review-text');

        // Проста валідація
        if (nameInput.value.trim() === '' || textInput.value.trim() === '') {
            messageEl.textContent = 'Error: Please fill in all fields.';
            messageEl.style.color = 'red';
            return;
        }

        // Імітація успішної відправки
        messageEl.textContent = 'Success! Thank you for your review.';
        messageEl.style.color = 'green';
        form.reset();
    });
}

export async function initProductDetails() {
  const allProducts = await loadProducts();
  const productDetailsContainer = document.getElementById('product-details');
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = allProducts.find(p => p.id === productId);

  if (product) {
    const ratingHtml = product.rating ? renderRatingStars(product.rating) : '';
    
    productDetailsContainer.innerHTML = `
      <section class="product-details__card">
        <figure class="product-details__media">
          <img class="product-details__img" src="${esc(resolveAssetPath(product.imageUrl))}" alt="${esc(product.name)}" />
          <div id="thumbnail-gallery" class="thumbnail-gallery">
            <img src="${esc(resolveAssetPath(product.imageUrl))}" alt="thumbnail" class="active">
            <img src="${esc(resolveAssetPath(product.imageUrl))}" alt="thumbnail">
            <img src="${esc(resolveAssetPath(product.imageUrl))}" alt="thumbnail">
            <img src="${esc(resolveAssetPath(product.imageUrl))}" alt="thumbnail">
          </div>
        </figure>
        
        <article class="product-details__info">
          <h1 class="product-details__title">${esc(product.name)}</h1>
          ${ratingHtml}
          <p class="product-details__price">$${product.price.toFixed(2)}</p>
          <p class="product-details__description">${esc(product.description || 'No description available.')}</p>
          
          <div class="form-group">
              <label>Size</label>
              <select disabled><option>${esc(product.size)}</option></select>
          </div>
          <div class="form-group">
              <label>Color</label>
              <select disabled><option>${esc(product.color)}</option></select>
          </div>
          
          <div class="product-details__qty">
            <button class="qty-btn" type="button" data-action="dec">-</button>
            <input type="number" id="quantity-input" value="1" min="1" readonly />
            <button class="qty-btn" type="button" data-action="inc">+</button>
          </div>
          
          <button class="btn btn_pink" id="add-to-cart-btn">Add to Cart</button>
        </article>
      </section>
    `;

    document.getElementById('details-content').textContent = product.description || '';

    // Ініціалізуємо логіку селектора, табів та форми
    const qtyInput = document.getElementById('quantity-input');
    document.querySelector('[data-action="dec"]').addEventListener('click', () => {
      let val = parseInt(qtyInput.value);
      if (val > 1) qtyInput.value = val - 1;
    });
    document.querySelector('[data-action="inc"]').addEventListener('click', () => {
      let val = parseInt(qtyInput.value);
      qtyInput.value = val + 1;
    });
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
      const quantity = parseInt(qtyInput.value);
      addToCart(product, quantity);
      alert(`${product.name} (x${quantity}) added to cart!`);
    });
    
  } else {
    productDetailsContainer.innerHTML = `<p>Product not found.</p>`;
  }
  
  const relatedContainer = document.getElementById('related-products');
  if (relatedContainer) {
    const relatedProducts = allProducts.filter(p => p.id !== productId).sort(() => 0.5 - Math.random()).slice(0, 4);
    renderBlock({ products: relatedProducts, containerSelector: '#related-products' });
  }

  // Ініціалізуємо вкладки та форму відгуків
  handleTabs();
  handleReviewForm();
}