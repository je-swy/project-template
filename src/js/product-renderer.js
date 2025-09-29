// src/js/renderer.js

// Safe escape for HTML attributes/text
export function esc (s = '') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/**
 * Нормалізує шлях до картинки:
 * - http/https → залишаємо як є
 * - /src/... → залишаємо як є
 * - src/... → додаємо /
 * - assets/... → додаємо /src/
 * - тільки ім'я файлу → додаємо /src/assets/images/suitcases/
 */
export function resolveAssetPath (path = '') {
  const p = String(path).trim();
  if (!p || p === 'false') return '';

  // Абсолютні URL
  if (/^(https?:)?\/\//.test(p)) return p;

  // Якщо вже починається з /src/ → залишаємо
  if (p.startsWith('/src/')) return p;

  // Якщо починається з src/ → додаємо /
  if (p.startsWith('src/')) return '/' + p;

  // Якщо починається з assets/ → додаємо /src/
  if (p.startsWith('assets/')) return '/src/' + p;

  // Якщо лише ім’я файлу → підставляємо suitcases/
  // eslint-disable-next-line no-useless-escape
  if (/^[^\/]+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(p)) {
    return `/src/assets/images/suitcases/${p}`;
  }

  return p;
}

/**
 * Render list of products inside containerSelector.
 */
export function renderBlock ({ products = [], containerSelector, limit = 4, variant = 'grid' } = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.warn('renderBlock: container not found', containerSelector);
    return;
  }
  const items = (products || []).slice(0, limit);
  container.innerHTML = items.map(p => productToHtml(p, { variant })).join('');
}

/**
 * Create HTML for single product card
 */
export function productToHtml (p = {}, { variant = 'grid' } = {}) {
  const id = esc(p.id ?? p.sku ?? '');
  const title = esc(p.name ?? p.title ?? 'Unnamed product');

  let rawThumb = p.thumbnail ??
   (Array.isArray(p.images) && p.images[0]) ??
   p.imageUrl ??
   p.image ??
   p.src ?? '';

  if (rawThumb === 'false') rawThumb = '';

  const finalSrc = resolveAssetPath(rawThumb);

  // eslint-disable-next-line quotes
  const badge = p.salesStatus ? `<span class="product-card__badge">SALE</span>` : '';
  const nameLink = `/src/pages/product-details-template.html?id=${encodeURIComponent(id)}`;
  const compactClass = variant === 'compact' ? ' product-card--compact' : '';

  return `
<li class="product-card${compactClass}" data-id="${esc(id)}" role="listitem">
  ${badge}
  <a class="product-card__link" href="${esc(nameLink)}" aria-label="${title}">
    <img class="product-card__img" src="${esc(finalSrc)}" alt="${title}" loading="lazy" />
  </a>
  <div class="product-card__body">
    <a class="product-card__name" href="${esc(nameLink)}">${title}</a>
    <div class="product-card__price">$${Number(p.price || 0).toFixed(0)}</div>
    <div class="product-card__actions">
      <button class="btn btn_pink product-card__add" data-action="add-to-cart" data-id="${esc(id)}" aria-label="Add ${title} to cart">Add To Cart</button>
    </div>
  </div>
</li>`.trim();
}
