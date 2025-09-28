// src/js/products-data.js
// loadProducts(url) -> tries multiple common locations and normalizes items.
// Exposes window.PRODUCTS and window.PRODUCT_INDEX for fallback.

export let PRODUCTS = [];
export let PRODUCT_INDEX = new Map();

async function tryFetch(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (e) {
    return null;
  }
}

export async function loadProducts(url = '/src/assets/data.json') {
  // Try a few likely locations if default fails
  const candidates = unique([
    url,
    '/src/assets/data.json',
    '/assets/data.json',
    './assets/data.json',
    './src/assets/data.json',
    '/data.json',
    './data.json'
  ]);

  let json = null;
  for (const u of candidates) {
    json = await tryFetch(u);
    if (json) break;
  }

  if (!json) {
    console.error('loadProducts: failed to fetch data.json from any candidate location', candidates);
    PRODUCTS = [];
    PRODUCT_INDEX = new Map();
    try { window.PRODUCTS = PRODUCTS; window.PRODUCT_INDEX = PRODUCT_INDEX; } catch (e) {}
    return PRODUCTS;
  }

  // extract array (data / products / root array)
  const arr = Array.isArray(json.data) ? json.data
              : Array.isArray(json.products) ? json.products
              : Array.isArray(json) ? json
              : [];

  const normalized = arr.map((p, i) => {
    const o = Object.assign({}, p || {});
    if (o.id == null) o.id = `auto-${i}`;
    return o;
  });

  // Build index: ensure unique keys (if duplicates, add suffix)
  const idx = new Map();
  const counts = new Map();
  normalized.forEach((p) => {
    let key = String(p.id);
    if (counts.has(key)) {
      const c = counts.get(key) + 1;
      counts.set(key, c);
      key = `${key}-${c}`;
    } else counts.set(key, 0);
    p._rendererId = key;
    idx.set(key, p);
  });

  PRODUCTS = normalized;
  PRODUCT_INDEX = idx;
  // expose globally
  try {
    window.PRODUCTS = PRODUCTS;
    window.PRODUCT_INDEX = PRODUCT_INDEX;
  } catch (e) { /* ignore non-browser */ }

  return PRODUCTS;
}

function unique(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}
