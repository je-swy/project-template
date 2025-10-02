// src/js/main.js

import { includeComponents } from './components-loader.js';
import { initHomepage } from './homepage.js';
import { initCatalog } from './catalog.js';
import { initProductDetails } from './product-details.js';
import { initContactForm } from './contact.js';

// Єдина точка входу, яка запускає все в правильному порядку
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Завжди завантажуємо хедер і футер ПЕРШИМ
  await includeComponents();

  // 2. Визначаємо, на якій ми сторінці, і запускаємо ТІЛЬКИ її унікальний скрипт
  if (document.querySelector('.homepage_promo')) {
    initHomepage();
  } else if (document.querySelector('.catalog')) {
    initCatalog();
  } else if (document.querySelector('.product-details-page')) {
    initProductDetails();
  } else if (document.querySelector('.contact-page')) { 
    initContactForm();
  }
});