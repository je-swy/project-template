// src/js/main.js
// For all non-home pages: just load header/footer.

import { includeComponents } from './components-loader.js';

document.addEventListener('DOMContentLoaded', () => {
  includeComponents();
});
