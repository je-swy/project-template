// src/components/product-details.js
import { loadProducts } from './products-data.js';
import { resolveAssetPath, esc, productToHtml } from './product-renderer.js';
import { attachCartDelegation } from './cart.js';
import { initCartCountAuto } from './cart-count.js';

async function initProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  const products = await loadProducts('../assets/data.json');
  const product = products.find(p => String(p.id) === String(productId));

  const container = document.querySelector('#product-details');

  if (product) {
    container.innerHTML = `
      <article class="product-details__card">
        <div class="product-details__media">
          <img class="product-details__img"
               src="${esc(resolveAssetPath(product.imageUrl))}"
               alt="${esc(product.name)}" />
        </div>
        <div class="product-details__info">
          <h1 class="product-details__title">${esc(product.name)}</h1>
          <p class="product-details__price">$${Number(product.price).toFixed(2)}</p>
          <p class="product-details__meta">
            Color: ${esc(product.color)} | Size: ${esc(product.size)}
          </p>
          <div class="product-details__qty">
            <button class="qty-btn" data-action="dec">-</button>
            <input type="number" value="1" min="1" />
            <button class="qty-btn" data-action="inc">+</button>
          </div>
          <button class="btn btn_pink"
                  data-action="add-to-cart"
                  data-id="${esc(product.id)}">
            Add to Cart
          </button>
        </div>
      </article>
    `;

    // Related products
    const related = products
      .filter(p => p.id !== product.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    const relatedContainer = document.querySelector('#related-products');
    relatedContainer.innerHTML = related.map(p => productToHtml(p, { variant: 'grid' })).join('');
  } else {
    container.innerHTML = `<p>Product not found.</p>`;
  }

  attachCartDelegation();
  // initCartCountAuto();
}



document.addEventListener('DOMContentLoaded', initProductDetails);
