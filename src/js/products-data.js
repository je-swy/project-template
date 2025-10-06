// Module to load and manage product data from a JSON file
// It tries multiple paths to locate the file and builds an index for quick access.

export const PRODUCTS = [];
export const PRODUCT_INDEX = new Map();

/**
 * Try fetching JSON from a URL, return null on failure
 * @param {string} url - The URL to fetch
 * @returns {Promise<object|null>} The JSON data or null
 */
async function tryFetch (url) {
  try {
    // Using no-store to ensure the latest data is fetched during development/testing
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    // Log errors for debugging, but return null to indicate failure
    console.warn(`Failed to fetch from ${url}:`, e);
    return null;
  }
}

/**
 * Return array with unique, truthy values
 * @param {Array} arr - The array to process
 * @returns {Array} A new array with unique values
 */
function unique (arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

/**
 * Load products from a JSON file, trying multiple locations if needed.
 * This function will mutate the exported PRODUCTS array and PRODUCT_INDEX map.
 * @param {string} [url='/src/assets/data.json'] - The base URL for the data file
 * @returns {Promise<Array>} A promise that resolves with the products array
 */
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

  // Clear existing data regardless of outcome
  PRODUCTS.length = 0;
  PRODUCT_INDEX.clear();

  // If all attempts fail, log error and return the empty products array
  if (!json) {
    console.error(
      'loadProducts: failed to fetch data.json from any candidate location',
      candidates
    );
    try {
      globalThis.PRODUCTS = PRODUCTS;
      globalThis.PRODUCT_INDEX = PRODUCT_INDEX;
    } catch (e) { /* ignore non-browser */ }
    return PRODUCTS;
  }

  // Extract array (data / products / root array)
  const arr = Array.isArray(json.data)
    ? json.data
    : Array.isArray(json.products)
      ? json.products
      : Array.isArray(json)
        ? json
        : [];

  // Normalize: ensure each item is an object with an id
  const normalized = arr.map((p, i) => {
    const o = Object.assign({}, p || {});
    if (o.id == null) o.id = `auto-${i}`;
    return o;
  });

  // Build index: ensure unique keys (if duplicates, add suffix)
  const idx = new Map();
  const counts = new Map();

  for (const p of normalized) {
    let key = String(p.id);
    if (counts.has(key)) {
      const c = counts.get(key) + 1;
      counts.set(key, c);
      key = `${key}-${c}`;
    } else {
      counts.set(key, 0);
    }
    p._rendererId = key;
    idx.set(key, p);
  }

  // Populate the exported constants with new data
  // Using push with spread operator for efficiency
  PRODUCTS.push(...normalized);
  for (const [key, product] of idx.entries()) {
    PRODUCT_INDEX.set(key, product);
  }

  try {
    // Using globalThis for better cross-environment compatibility (browser, workers, etc.)
    globalThis.PRODUCTS = PRODUCTS;
    globalThis.PRODUCT_INDEX = PRODUCT_INDEX;
  } catch (e) {
    /* ignore non-browser */
  }

  return PRODUCTS;
}
