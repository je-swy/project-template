// src/js/catalog.js

import { loadProducts } from './products-data.js';
import { renderBlock, resolveAssetPath, esc } from './product-renderer.js';
import { attachCartDelegation } from './cart.js';
import { initCartCountAuto } from './cart-count.js';

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

let allProducts = [];
let currentPage = 1;
const productsPerPage = 12;

const activeFilters = {
  category: '', color: '', size: '',
  salesStatus: '', searchQuery: '', sortBy: 'default'
};

function renderPagination(totalPages) {
  paginationContainer.innerHTML = '';
  if (totalPages <= 1) return;
  const prevButton = document.createElement('button');
  prevButton.textContent = '< Previous';
  prevButton.className = 'btn btn_pagination';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; updateProductList(); }
  });
  paginationContainer.appendChild(prevButton);
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = 'btn btn_pagination';
    if (i === currentPage) pageButton.classList.add('is-active');
    pageButton.addEventListener('click', () => {
      currentPage = i; updateProductList();
    });
    paginationContainer.appendChild(pageButton);
  }
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next >';
  nextButton.className = 'btn btn_pagination';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage++; updateProductList(); }
  });
  paginationContainer.appendChild(nextButton);
}

function renderWidgetRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  let starsHTML = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  return `<span class="rating-stars" aria-label="Rating: ${rating} out of 5 stars">${starsHTML}</span>`;
}

function renderTopSets() {
  const sets = allProducts.filter(p => p.category === "luggage sets");
  const randomSets = sets.sort(() => 0.5 - Math.random()).slice(0, 4);
  const listElement = topSetsContainer.querySelector('.widget-list');
  if (!listElement) return;
  listElement.innerHTML = randomSets.map(product => {
    const ratingHtml = product.rating ? renderWidgetRatingStars(product.rating) : '';
    return `
    <li>
      <a href="/src/pages/product-details-template.html?id=${esc(product.id)}">
        <img src="${esc(resolveAssetPath(product.imageUrl))}" alt="${esc(product.name)}">
      </a>
      <article>
        <a href="/src/pages/product-details-template.html?id=${esc(product.id)}">${esc(product.name)}</a>
        ${ratingHtml}
        <p>$${product.price.toFixed(2)}</p>
      </article>
    </li>
  `}).join('');
}

function updateResultsCount(totalFilteredProducts, productsOnPage) {
  if (totalFilteredProducts === 0) {
    resultsContainer.textContent = '';
    return;
  }
  const start = (currentPage - 1) * productsPerPage + 1;
  const end = start + productsOnPage.length - 1;
  resultsContainer.textContent = `Showing ${start}–${end} of ${totalFilteredProducts} results`;
}

function updateProductList() {
  let productsToRender = [...allProducts];
  const searchQuery = activeFilters.searchQuery.trim().toLowerCase();
  if (searchQuery) productsToRender = productsToRender.filter(p => p.name.toLowerCase().includes(searchQuery) || p.id.toLowerCase().includes(searchQuery));
  if (activeFilters.category) productsToRender = productsToRender.filter(p => p.category === activeFilters.category);
  if (activeFilters.color) productsToRender = productsToRender.filter(p => p.color === activeFilters.color);
  if (activeFilters.size) {
    productsToRender = productsToRender.filter(p => activeFilters.size.includes(p.size));
  }
  if (activeFilters.salesStatus === 'true') productsToRender = productsToRender.filter(p => p.salesStatus === true);
  const sortBy = activeFilters.sortBy;
  if (sortBy === 'price-asc') productsToRender.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') productsToRender.sort((a, b) => b.price - a.price);
  else if (sortBy === 'popularity') productsToRender.sort((a, b) => b.popularity - a.popularity);
  else if (sortBy === 'rating') productsToRender.sort((a, b) => b.rating - a.rating);
  const totalFilteredProducts = productsToRender.length;
  const totalPages = Math.ceil(totalFilteredProducts / productsPerPage);
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = productsToRender.slice(startIndex, startIndex + productsPerPage);
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

function handleStateChange() {
  currentPage = 1;
  updateProductList();
}

export async function initCatalog() {
  allProducts = await loadProducts('../assets/data.json');
  updateProductList();
  renderTopSets();
  attachCartDelegation();
  // initCartCountAuto();

  function redirectToProduct() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    const exactMatch = allProducts.find(p => p.id.toLowerCase() === query);
    if (exactMatch) {
      window.location.href = `/src/pages/product-details-template.html?id=${exactMatch.id}`;
    }
  }

  searchInput.addEventListener('input', () => {
    activeFilters.searchQuery = searchInput.value;
    handleStateChange();
  });
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      redirectToProduct();
    }
  });
  const searchButton = document.querySelector('.search-widget button');
  if (searchButton) {
    searchButton.addEventListener('click', redirectToProduct);
  }
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
  salesCheckbox.addEventListener('change', () => {
    activeFilters.salesStatus = salesCheckbox.checked ? 'true' : '';
    handleStateChange();
  });
  sortSelect.addEventListener('change', () => {
    activeFilters.sortBy = sortSelect.value;
    handleStateChange();
  });
  clearFiltersBtn.addEventListener('click', () => {
    filtersForm.reset();
    salesCheckbox.checked = false;
    sortSelect.value = 'default';
    Object.keys(activeFilters).forEach(key => activeFilters[key] = '');
    activeFilters.sortBy = 'default';
    filtersForm.querySelectorAll('.filter-selected').forEach(label => {
      const filterItem = label.closest('.filter-item');
      label.textContent = (filterItem && filterItem.dataset.filter === 'category') ? 'All' : 'Any';
    });
    handleStateChange();
  });
  hideFiltersBtn.addEventListener('click', () => {
    filtersContainer.classList.toggle('compact');
    hideFiltersBtn.textContent = filtersContainer.classList.contains('compact') ? 'SHOW FILTERS' : 'HIDE FILTERS';
  });
}
