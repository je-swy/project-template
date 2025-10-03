// src/js/product-renderer.js

// Utility to render product listings into a container element
export function esc(s = '') {
  
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

export function resolveAssetPath(path = '') {
  const p = String(path).trim();
  if (!p || p === 'false') return '';

  if (p.startsWith('/')) {
    return p;
  }
  return `/${p}`;
}

export function renderBlock({ products = [], containerSelector, limit }) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.warn('renderBlock: container not found', containerSelector);
    return;
  }
  const items = limit ? (products || []).slice(0, limit) : (products || []);
  container.innerHTML = items.map(p => productToHtml(p)).join('');
}

export function productToHtml(p = {}) {
  const id = esc(p.id ?? p.sku ?? '');
  const title = esc(p.name ?? p.title ?? 'Unnamed product');
  const rawThumb = p.imageUrl ?? p.image ?? '';
  const finalSrc = resolveAssetPath(rawThumb);

  const badge = p.salesStatus ? `<span class="product-card__badge">SALE</span>` : '';
  const nameLink = `/src/pages/product-details-template.html?id=${encodeURIComponent(id)}`;

  return `
<li class="product-card" data-id="${esc(id)}" role="listitem">
  ${badge}
  <a class="product-card__link" href="${nameLink}" aria-label="${title}">
    <img class="product-card__img" src="${finalSrc}" alt="${title}" loading="lazy" />
  </a>
  <section class="product-card__body">
    <a class="product-card__name" href="${nameLink}">${title}</a>
    <p class="product-card__price">$${Number(p.price || 0).toFixed(0)}</p>
    <footer class="product-card__actions">
      <button class="btn btn_pink product-card__add" data-action="add-to-cart" data-id="${esc(id)}">Add To Cart</button>
    </footer>
  </section>
</li>`.trim();
}