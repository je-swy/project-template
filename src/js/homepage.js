// src/js/homepage.js
// Bootstraps homepage: loads components, data, renders blocks and attaches cart delegation.

import { includeComponents } from './components-loader.js';
import { loadProducts } from './products-data.js';
import { renderBlock } from './product-renderer.js';
import { attachCartDelegation } from './cart.js';
import { initCarousel } from './carousel.js';
import { initCartCountAuto, updateCartCountUI } from './cart-count.js';

async function init() {
  const products = await loadProducts();

  // Selected Products
  const selected = products.filter(p => Array.isArray(p.blocks) && p.blocks.includes('Selected Products'));
  renderBlock({ products: selected, containerSelector: '#selected-products-list', limit: 4, variant: 'grid' });

  // New Products Arrival
  const news = products.filter(p => Array.isArray(p.blocks) && p.blocks.includes('New Products Arrival'));
  renderBlock({ products: news, containerSelector: '#new-products-list', limit: 4, variant: 'grid' });

  // Recommendations (random 4)
  const shuffled = products.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const recs = shuffled.slice(0, 4);
  renderBlock({ products: recs, containerSelector: '#recommendations-list', limit: 4, variant: 'compact' });

  // attach cart after render
  if (typeof attachCartDelegation === 'function') attachCartDelegation();

  // init cart counter
  // if (typeof initCartCountAuto === 'function') initCartCountAuto();
  if (typeof updateCartCountUI === 'function') updateCartCountUI();

  // init carousel
  if (typeof initCarousel === 'function') initCarousel();
}

document.addEventListener('DOMContentLoaded', async () => {
  await includeComponents(); // load header/footer first
  await init();              // then render homepage content
});
