// Catalog page script: handles product listing, filtering, sorting, pagination, and search functionality.
// Also initializes the "Top Sets" widget with random luggage sets.
// Imports necessary modules and functions for product data loading, rendering, and cart functionality.
// Sets up event listeners for user interactions with filters, search, and pagination controls.
// Renders products based on current filters and pagination state.
// Manages the state of active filters and updates the product list accordingly.
// Handles redirection to product details page on exact search match.
// Updates the cart count in the UI when products are added to the cart.
// Uses local storage to persist cart data across sessions.

import { loadProducts } from './products-data.js';
import { renderBlock, resolveAssetPath, esc } from './product-renderer.js';
import { attachCartDelegation } from './cart.js';

const filtersForm = document.getElementById('catalog-filters-form');
const searchInput = document.getElementById('catalog-search');
const productListContainer = document.getElementById('catalog-list');
const clearFiltersBtn = document.getElementById('filter-clear');
const salesCheckbox = document.getElementById('sales-checkbox');
const hideFiltersBtn = document.getElementById('filter-toggle-compact');
const filtersContainer = document.getElementById('catalog-filters');
const paginationContainer = document.getElementById('pagination-controls');
const resultsContainer = document.getElementById('catalog-results');
const sortSelect = document.getElementById('sort-select');
const topSetsContainer = document.getElementById('top-sets-container');

// State variables
let allProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Active filters state
const activeFilters = {
  category: '',
  color: '',
  size: '',
  salesStatus: '',
  searchQuery: '',
  sortBy: 'default'
};

// Render pagination controls based on total pages and current page
function renderPagination (totalPages) {
  // Clear existing pagination
  paginationContainer.innerHTML = '';
  if (totalPages <= 1) return;
  const prevButton = document.createElement('button');
  prevButton.textContent = '< Previous';
  prevButton.className = 'btn btn_pagination-next-prev';
  prevButton.disabled = currentPage === 1;

  // Add event listener for previous button
  // Decrement currentPage and update product list if not on first page
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; updateProductList(); }
  });
  // Append previous button to pagination container
  paginationContainer.appendChild(prevButton);
  const btnContainer = document.createElement('article');
  btnContainer.className = 'btn_container';
  paginationContainer.appendChild(btnContainer);
  // Create page number buttons
  // Loop from 1 to totalPages to create buttons for each page
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = 'btn btn_pagination';
    if (i === currentPage) pageButton.classList.add('is-active');
    pageButton.addEventListener('click', () => {
      currentPage = i; updateProductList();
    });
    btnContainer.appendChild(pageButton);
  }
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next >';
  nextButton.className = 'btn btn_pagination-next-prev';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage++; updateProductList(); }
  });
  paginationContainer.appendChild(nextButton);
}

// Render star rating HTML for a given rating value
function renderWidgetRatingStars (rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  // Create star rating HTML using full and empty stars
  const starsHTML = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  // Return HTML string with appropriate ARIA label for accessibility
  return `<span class="rating-stars" aria-label="Rating: ${rating} out of 5 stars">${starsHTML}</span>`;
}

function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderTopSets () {
  const sets = allProducts.filter(p => p.category === 'luggage sets');

  const setsCopy = [...sets];

  const shuffledSets = shuffleArray(setsCopy);

  const randomSets = shuffledSets.slice(0, 4);

  const listElement = topSetsContainer.querySelector('.widget-list');
  if (!listElement) {
    console.error('Render Top Sets: list element not found');
    return;
  }

  listElement.innerHTML = randomSets.map(product => {
    const ratingHtml = product.rating ? renderWidgetRatingStars(product.rating) : '';
    return `
      <li>
        <a href="/src/pages/product-details-template.html?id=${esc(product.id)}">
          <img src="${esc(resolveAssetPath(product.imageUrl))}" alt="${esc(product.name)}">
        </a>
        <article>
          <a href="/src/pages/product-details-template.html?id=${esc(product.id)}">${esc(product.name)}</a>
          <br>
          ${ratingHtml}
          <p>$${product.price.toFixed(2)}</p>
        </article>
      </li>
    `;
  }).join('');
}

// Update the results count display based on total filtered products and products on current page
function updateResultsCount (totalFilteredProducts, productsOnPage) {
  if (totalFilteredProducts === 0) {
    resultsContainer.textContent = '';
    return;
  }
  const start = (currentPage - 1) * productsPerPage + 1;
  const end = start + productsOnPage.length - 1;
  resultsContainer.textContent = `Showing ${start}–${end} of ${totalFilteredProducts} results`;
}

// Main function to update the product list based on active filters and pagination
function updateProductList () {
  // Start with all products and apply filters step by step
  let productsToRender = [...allProducts];
  // Apply search query filter
  const searchQuery = activeFilters.searchQuery.trim().toLowerCase();
  // Apply category filter
  if (searchQuery) {
    productsToRender = productsToRender
      .filter(p => p.name.toLowerCase()
        .includes(searchQuery) || p.id.toLowerCase().includes(searchQuery));
  }
  if (activeFilters.category) {
    productsToRender = productsToRender.filter(p => p.category === activeFilters.category);
  }
  if (activeFilters.color) {
    productsToRender = productsToRender.filter(p => p.color === activeFilters.color);
  }
  if (activeFilters.size) {
    productsToRender = productsToRender.filter(p => activeFilters.size.includes(p.size));
  }
  if (activeFilters.salesStatus === 'true') {
    productsToRender = productsToRender.filter(p => p.salesStatus === true);
  }
  // Apply sorting based on selected sort option
  const sortBy = activeFilters.sortBy;
  if (sortBy === 'price-asc') productsToRender.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') productsToRender.sort((a, b) => b.price - a.price);
  else if (sortBy === 'popularity') productsToRender.sort((a, b) => b.popularity - a.popularity);
  else if (sortBy === 'rating') productsToRender.sort((a, b) => b.rating - a.rating);
  // Handle pagination calculations
  const totalFilteredProducts = productsToRender.length;
  // Calculate total pages and adjust current page if out of bounds
  const totalPages = Math.ceil(totalFilteredProducts / productsPerPage);
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = productsToRender.slice(startIndex, startIndex + productsPerPage);
  // Render the products, pagination controls, and update results count
  renderBlock({
    products: paginatedProducts,
    containerSelector: '#catalog-list',
    limit: productsPerPage
  });
  renderPagination(totalPages);
  updateResultsCount(totalFilteredProducts, paginatedProducts);
  if (totalFilteredProducts === 0) {
    productListContainer.innerHTML = '<p>Product not found.</p>';
  }
}

// Handle changes in filter state by resetting to first page and updating product list
function handleStateChange () {
  currentPage = 1;
  updateProductList();
}

// Initialize the catalog page: load products,
// set up event listeners, and render initial UI
export async function initCatalog () {
  allProducts = await loadProducts('../assets/data.json');
  updateProductList();
  renderTopSets();
  attachCartDelegation();

  // Redirect to product details if search input matches a product ID exactly
  function redirectToProduct () {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    const exactMatch = allProducts.find(p => p.id.toLowerCase() === query);
    if (exactMatch) {
      globalThis.location.href = `/src/pages/product-details-template.html?id=${exactMatch.id}`;
    }
  }
  // Set up event listeners for search input, filter options, sales checkbox, sort select, and buttons
  searchInput.addEventListener('input', () => {
    activeFilters.searchQuery = searchInput.value;
    handleStateChange();
  });
  // Handle Enter key press in search input to trigger redirection
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      redirectToProduct();
    }
  });
  // Handle click on search button to trigger redirection
  const searchButton = document.querySelector('.search-widget button');
  if (searchButton) {
    searchButton.addEventListener('click', redirectToProduct);
  }
  // Event delegation for filter options
  filtersForm.addEventListener('click', (event) => {
    const option = event.target.closest('li[role="option"]');
    if (!option) return;
    const filterGroup = option.closest('.filter-item');
    if (!filterGroup) return;
    activeFilters[filterGroup.dataset.filter] = option.dataset.value;
    const selectedLabel = filterGroup.querySelector('.filter-selected');
    if (selectedLabel) selectedLabel.textContent = option.textContent;
    handleStateChange();
  });
  // Handle changes to sales checkbox
  salesCheckbox.addEventListener('change', () => {
    activeFilters.salesStatus = salesCheckbox.checked ? 'true' : '';
    handleStateChange();
  });
  // Handle changes to sort select dropdown
  sortSelect.addEventListener('change', () => {
    activeFilters.sortBy = sortSelect.value;
    handleStateChange();
  });
  // Handle clear filters button click to reset all filters and UI elements
  clearFiltersBtn.addEventListener('click', () => {
    filtersForm.reset();
    salesCheckbox.checked = false;
    sortSelect.value = 'default';
    // Reset activeFilters state
    // eslint-disable-next-line no-return-assign
    for (const key of Object.keys(activeFilters)) {
      activeFilters[key] = '';
    }
    activeFilters.sortBy = 'default';
    // Reset selected labels in the UI
    filtersForm.querySelectorAll('.filter-selected').forEach(label => {
      const filterItem = label.closest('.filter-item');
      label.textContent = (filterItem && filterItem.dataset.filter === 'category') ? 'All' : 'Any';
    });
    handleStateChange();
  });
  // Handle hide/show filters button click to toggle compact mode
  hideFiltersBtn.addEventListener('click', () => {
    filtersContainer.classList.toggle('compact');
    hideFiltersBtn.textContent = filtersContainer.classList.contains('compact') ? 'SHOW FILTERS' : 'HIDE FILTERS';
  });
}
