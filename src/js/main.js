// main file to initialize the app

import { includeComponents } from './components-loader.js';
import { initHomepage } from './homepage.js';
import { initCatalog } from './catalog.js';
import { initProductDetails } from './product-details.js';

// On DOMContentLoaded, load header and footer, then initialize page-specific scripts
document.addEventListener('DOMContentLoaded', async () => {
  // Always include header and footer components
  await includeComponents();

  // Initialize page-specific scripts based on the presence of certain elements
  if (document.querySelector('.homepage_promo')) {
    initHomepage();
  } else if (document.querySelector('.catalog')) {
    initCatalog();
  } else if (document.querySelector('.product-details-page')) {
    initProductDetails();
  }
});
