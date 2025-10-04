// src/js/product-renderer.js

import { esc, resolveAssetPath } from './utils.js'; // Ми винесемо утиліти в окремий файл

let cardTemplate = null; // Змінна для кешування нашого HTML-шаблону

// Асинхронна функція для завантаження шаблону (робить це тільки один раз)
async function getCardTemplate () {
  if (cardTemplate) {
    return cardTemplate;
  }

  // Визначаємо правильний шлях до компонента
  const path = '/src/components/product-card.html';
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error('Product card template not found');
    cardTemplate = await response.text();
    return cardTemplate;
  } catch (error) {
    console.error(error);
    return '<p>Error loading product card.</p>';
  }
}

/**
 * Render list of products inside containerSelector.
 */
export async function renderBlock ({ products = [], containerSelector, limit, variant = 'grid' }) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.warn('renderBlock: container not found', containerSelector);
    return;
  }

  const items = limit ? (products || []).slice(0, limit) : (products || []);

  // Оскільки productToHtml тепер асинхронна, чекаємо на виконання всіх промісів
  const htmlItems = await Promise.all(items.map(p => productToHtml(p, { variant })));

  container.innerHTML = htmlItems.join('');
}

/**
 * Створює HTML для картки, заповнюючи шаблон даними.
 */
export async function productToHtml (p = {}, { variant = 'grid' } = {}) {
  const template = await getCardTemplate();

  const id = esc(p.id ?? '');
  const name = esc(p.name ?? 'Unnamed product');
  const price = Number(p.price || 0).toFixed(0);
  const imageUrl = esc(resolveAssetPath(p.imageUrl));
  const link = `/src/pages/product-details-template.html?id=${encodeURIComponent(id)}`;
  // eslint-disable-next-line quotes
  const badge = p.salesStatus ? `<span class="product-card__badge">SALE</span>` : '';
  const compactClass = variant === 'compact' ? 'product-card--compact' : '';

  // Замінюємо "заглушки" на реальні дані
  return template
    .replace(/{{id}}/g, id)
    .replace(/{{name}}/g, name)
    .replace('{{price}}', price)
    .replace('{{imageUrl}}', imageUrl)
    .replace(/{{link}}/g, link)
    .replace('{{badge}}', badge)
    .replace('{{compactClass}}', compactClass);
}
