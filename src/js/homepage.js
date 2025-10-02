// src/js/homepage.js

import { renderBlock } from './product-renderer.js';
import { loadProducts } from './products-data.js';
import { attachCartDelegation } from './cart.js';
import { initCarousel } from './carousel.js';

// Змінюємо функцію, щоб її можна було імпортувати
export async function initHomepage() { 
  const products = await loadProducts();

  const selected = products.filter(p => p.blocks?.includes('Selected Products'));
  renderBlock({ products: selected, containerSelector: '#selected-products-list', limit: 4 });
  
  const news = products.filter(p => p.blocks?.includes('New Products Arrival'));
  renderBlock({ products: news, containerSelector: '#new-products-list', limit: 4 });

  attachCartDelegation();
  initCarousel();
}

// ВИДАЛИ ЗВІДСИ ВЕСЬ БЛОК document.addEventListener('DOMContentLoaded', ...), ЯКЩО ВІН Є!