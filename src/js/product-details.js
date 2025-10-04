// In this file is implementing the product details page,
// including rendering product information, handling tabs, review form, and thumbnail gallery.

import { loadProducts } from './products-data.js';
import { renderBlock, resolveAssetPath, esc } from './product-renderer.js';
import { addToCart } from './cart.js';

// Render star rating based on a numeric value (0-5)
function renderRatingStars (rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  const starsHTML = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  return `<div class='product-details__rating' aria-label='Rating: ${rating} out of 5 stars'>${starsHTML}</div>`;
}

// function to handle tab switching
// it adds click event listeners to tab buttons
// when a tab button is clicked, it activates the corresponding tab pane and deactivates others
function handleTabs () {
  const tabContainer = document.querySelector('.product-tabs-container');
  if (!tabContainer) return;

  const tabButtons = tabContainer.querySelectorAll('.product-tabs__btn');
  const tabPanes = tabContainer.querySelectorAll('.product-tabs__pane');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // deactivate all buttons and panes
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabPanes.forEach((pane) => pane.classList.remove('active'));

      // activate the clicked button and corresponding pane
      const tabId = button.dataset.tab;
      const activePane = document.getElementById(`tab-${tabId}`);

      button.classList.add('active');
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });
}

// function to handle review form submission
function handleReviewForm () {
  const form = document.getElementById('review-form');
  if (!form) return;

  const messageEl = document.getElementById('review-form-message');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const rating = form.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('review-text');
    const nameInput = document.getElementById('review-name');
    const emailInput = document.getElementById('review-email');

    // Basic validation
    if (
      !rating ||
      reviewText.value.trim() === '' ||
      nameInput.value.trim() === '' ||
      emailInput.value.trim() === ''
    ) {
      messageEl.textContent =
        'Error: Please fill in all required fields (*) and select a rating.';
      messageEl.style.color = 'red';
      return;
    }

    // Імітація успішної відправки
    messageEl.textContent = 'Success! Thank you for your review.';
    messageEl.style.color = 'green';
    form.reset();
    // Clear message after 4 seconds
    setTimeout(() => {
      messageEl.textContent = '';
    }, 4000);
  });
}

// Initialize thumbnail gallery functionality
function initThumbnailGallery () {
  const mainImage = document.querySelector('.product-details__img');
  const thumbnails = document.querySelectorAll('#thumbnail-gallery img');

  // if no main image or thumbnails, exit
  if (!mainImage || thumbnails.length === 0) return;

  // add click event listeners to each thumbnail
  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      mainImage.src = thumb.src; // change main image source
      // remove active class from all thumbnails
      thumbnails.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

// Main function to initialize product details page
export async function initProductDetails () {
  const allProducts = await loadProducts();
  const productDetailsContainer = document.getElementById('product-details');
  // Get product ID from URL query parameters
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  // Find the product by ID
  const product = allProducts.find((p) => p.id === productId);

  // If product found, render its details
  if (product) {
    const ratingHtml = product.rating ? renderRatingStars(product.rating) : '';
    productDetailsContainer.innerHTML = `
      <section class='product-details__card'>
        <figure class='product-details__media'>
          <img class='product-details__img' src='${esc(resolveAssetPath(product.imageUrl))}' alt='${esc(product.name)}' />
          <div id='thumbnail-gallery' class='thumbnail-gallery'>
            <img src='${esc(resolveAssetPath(product.imageUrl))}' alt='thumbnail' class='active'>
            <img src='${esc(resolveAssetPath(product.imageUrl))}' alt='thumbnail'>
            <img src='${esc(resolveAssetPath(product.imageUrl))}' alt='thumbnail'>
            <img src='${esc(resolveAssetPath(product.imageUrl))}' alt='thumbnail'>
          </div>
        </figure>
        <article class='product-details__info'>
          <h1 class='product-details__title'>${esc(product.name)}</h1>
          ${ratingHtml}
          <p class='product-details__price'>$${product.price.toFixed(2)}</p>
          <p class='product-details__description'>${esc(product.description || 'No description available.')}</p>
          <div class='form-group'>
              <label>Size</label>
              <select disabled><option>${esc(product.size)}</option></select>
          </div>
          <div class='form-group'>
              <label>Color</label>
              <select disabled><option>${esc(product.color)}</option></select>
          </div>
          <div class='product-details__qty'>
            <button class='qty-btn' type='button' data-action='dec'>-</button>
            <input type='number' id='quantity-input' value='1' min='1' readonly />
            <button class='qty-btn' type='button' data-action='inc'>+</button>
          </div>
          <button class='btn btn_pink' id='add-to-cart-btn'>Add to Cart</button>
        </article>
      </section>
    `;

    // Populate product description in the details tab
    const detailsContentEl = document.getElementById('details-content');
    if (detailsContentEl) {
      detailsContentEl.textContent = product.description || '';
    }

    // Set up quantity buttons and add to cart functionality
    const qtyInput = document.getElementById('quantity-input');
    document
      .querySelector('[data-action="dec"]')
      .addEventListener('click', () => {
        const val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
      });
    document
      .querySelector('[data-action="inc"]')
      .addEventListener('click', () => {
        const val = parseInt(qtyInput.value);
        qtyInput.value = val + 1;
      });
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
      const quantity = parseInt(qtyInput.value);
      addToCart(product, quantity);
      alert(`${product.name} (x${quantity}) added to cart!`);
    });
  } else {
    // eslint-disable-next-line quotes
    productDetailsContainer.innerHTML = `<p>Product not found.</p>`;
  }

  // Render related products (4 random products excluding current)
  const relatedContainer = document.getElementById('related-products');
  if (relatedContainer) {
    const relatedProducts = allProducts
      .filter((p) => p.id !== productId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    renderBlock({
      products: relatedProducts,
      containerSelector: '#related-products'
    });
  }

  handleTabs();
  handleReviewForm();
  initThumbnailGallery();
}
