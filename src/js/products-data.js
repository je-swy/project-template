// Module to load and manage product data from a JSON file
// It tries multiple paths to locate the file and builds an index for quick access.

export const PRODUCTS = [];
export const PRODUCT_INDEX = new Map();

// Try fetching JSON from a URL, return null on failure
async function tryFetch (url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (e) {
    return null;
  }
}

// Load products from a JSON file, trying multiple locations if needed
export async function loadProducts (url = '/src/assets/data.json') {
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

  // Attempt to fetch from each candidate URL until one succeeds
  let json = null;
  for (const u of candidates) {
    json = await tryFetch(u);
    if (json) break;
  }

  // If all attempts fail, log error and set empty products
  if (!json) {
    console.error(
      'loadProducts: failed to fetch data.json from any candidate location',
      candidates
    );
    PRODUCTS = [];
    PRODUCT_INDEX = new Map();
    try {
      window.PRODUCTS = PRODUCTS;
      window.PRODUCT_INDEX = PRODUCT_INDEX;
    } catch (e) {}
    return PRODUCTS;
  }

  // extract array (data / products / root array)
  const arr = Array.isArray(json.data)
    ? json.data
    : Array.isArray(json.products)
      ? json.products
      : Array.isArray(json)
        ? json
        : [];

  // Normalize: ensure each item is an object with an id
  const normalized = arr.map((p, i) => {
    // if p is not an object, make it one
    const o = Object.assign({}, p || {});
    // ensure it has an id
    if (o.id == null) o.id = `auto-${i}`;
    return o;
  });

  // Build index: ensure unique keys (if duplicates, add suffix)
  const idx = new Map();
  const counts = new Map();
  // assign unique _rendererId to each product
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
  try {
    window.PRODUCTS = PRODUCTS;
    window.PRODUCT_INDEX = PRODUCT_INDEX;
  } catch (e) {
    /* ignore non-browser */
  }

  return PRODUCTS;
}

// Return array with unique, truthy values
function unique (arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}
