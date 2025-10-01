// src/js/homepage.js

import { renderBlock } from './product-renderer.js';
import { loadProducts } from './products-data.js';
import { attachCartDelegation } from './cart.js';
import { initCarousel } from './carousel.js';

export async function initHomepage() {
  const products = await loadProducts();

  // Selected Products
  const selected = products.filter(p => Array.isArray(p.blocks) && p.blocks.includes('Selected Products'));
  renderBlock({ 
    products: selected, 
    containerSelector: '#selected-products-list', 
    limit: 4, 
    variant: 'grid' 
  });

  // New Products Arrival
  const news = products.filter(p => Array.isArray(p.blocks) && p.blocks.includes('New Products Arrival'));
  renderBlock({ 
    products: news, 
    containerSelector: '#new-products-list', 
    limit: 4, 
    variant: 'grid' 
  });

  // Логіку для "Recommendations" звідси прибрано, оскільки на цій сторінці немає для неї контейнера.

  // Прив'язуємо логіку додавання в кошик
  if (typeof attachCartDelegation === 'function') {
    attachCartDelegation();
  }

  // Ініціалізуємо карусель
  if (typeof initCarousel === 'function') {
    initCarousel();
  }
}