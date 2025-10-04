// in this file we will initialize the homepage specific scripts

import { renderBlock } from './product-renderer.js';
import { loadProducts } from './products-data.js';
import { attachCartDelegation } from './cart.js';
import { initCarousel } from './carousel.js';

// Initialize homepage: load products, render selected and new arrivals, set up cart and carousel
export async function initHomepage () {
  // Load products data
  const products = await loadProducts();

  // Filter and render selected products and new arrivals
  const selected = products.filter((p) => p.blocks?.includes('Selected Products'));
  renderBlock({
    products: selected,
    containerSelector: '#selected-products-list',
    limit: 4
  });

  // New Products Arrival block
  const news = products.filter((p) => p.blocks?.includes('New Products Arrival'));
  renderBlock({
    products: news,
    containerSelector: '#new-products-list',
    limit: 4
  });

  // Set up cart and carousel functionality
  attachCartDelegation();
  initCarousel();
}
