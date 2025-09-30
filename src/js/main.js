// src/js/main.js
// For all non-home pages: just load header/footer.

import { includeComponents } from './components-loader.js';
import { initHomepage } from './homepage.js';
import { initCatalog } from './catalog.js';
import { initProductDetails } from './product-details.js';

// Єдина точка входу в додаток
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Завжди завантажуємо хедер і футер
  await includeComponents();

  // 2. Визначаємо, на якій ми сторінці, і запускаємо її унікальний скрипт
  if (document.querySelector('.homepage_promo')) {
    initHomepage();
  } else if (document.querySelector('.catalog')) {
    initCatalog();
  } else if (document.querySelector('.product-details')) {
    initProductDetails();
  }
  // Тут можна буде додати else if для інших сторінок (cart, about і т.д.)
});