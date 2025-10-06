// Description: Dynamically load header and footer components, fix relative links, and initialize header functionalities.

import { initCartCountAuto } from './cart-count.js';

function fixComponentLinks (basePath, componentElement) {
  const links = componentElement.querySelectorAll('a[href]');
  for (const link of links) {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('http') &&
      !href.startsWith('#') &&
      !href.startsWith('/')
    ) {
      link.setAttribute('href', `${basePath}${href}`);
    }
  }
  const images = componentElement.querySelectorAll('img[src]');
  for (const img of images) {
    const src = img.getAttribute('src');
    if (
      src &&
      !src.startsWith('http') &&
      !src.startsWith('#') &&
      !src.startsWith('/')
    ) {
      img.setAttribute('src', `${basePath}${src}`);
    }
  }
}

// Initialize header components: modal login, burger menu, cart count
// Called after header is loaded into DOM
// Assumes certain HTML structure in header component
function initHeaderComponents () {
  const openModalBtn = document.querySelector('.icon-btn[aria-label="User account"]');
  const modal = document.getElementById('loginModal');

  // Modal login functionality
  if (openModalBtn && modal) {
    const form = modal.querySelector('#loginForm');
    const emailInput = modal.querySelector('#email');
    const passwordInput = modal.querySelector('#password');
    const togglePasswordBtn = modal.querySelector('.toggle-password');
    const closeModalBtns = modal.querySelectorAll('[data-close]');

    const openModal = () => {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (form) {
        form.reset();
        emailInput.nextElementSibling.textContent = '';
        passwordInput.closest('.password-wrapper').nextElementSibling.textContent = '';
      }
    };

    openModalBtn.addEventListener('click', openModal);
    for (const btn of closeModalBtns) {
      btn.addEventListener('click', closeModal);
    }
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener('click', () => {
        const type =
          passwordInput.getAttribute('type') === 'password'
            ? 'text'
            : 'password';
        passwordInput.setAttribute('type', type);
      });
    }

    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        let isValid = true;
        const emailValue = emailInput.value.trim();
        const emailErrorMsg = emailInput.nextElementSibling;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(emailValue)) {
          emailErrorMsg.textContent = '';
        } else {
          emailErrorMsg.textContent = 'Please enter a valid email.';
          isValid = false;
        }
        const passwordValue = passwordInput.value.trim();
        const passwordErrorMsg =
          passwordInput.closest('.password-wrapper').nextElementSibling;
        if (passwordValue === '') {
          passwordErrorMsg.textContent = 'Password is required.';
          isValid = false;
        } else {
          passwordErrorMsg.textContent = '';
        }
        if (isValid) {
          alert('Login successful!');
          closeModal();
        }
      });
    }
  }

  // Burger menu functionality
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active')
        ? 'hidden'
        : '';
    });
  }

  initCartCountAuto();
}

// Main function to include header and footer components
// Determines correct relative paths based on current URL
// Fixes relative links in loaded components
// Initializes header functionalities after loading
export async function includeComponents () {
  const isInPages = globalThis.location.pathname.includes('/pages/');
  const base = isInPages ? '../' : './';
  const headerPath = `${base}components/header.html`;
  const footerPath = `${base}components/footer.html`;

  try {
    const response = await fetch(headerPath);
    if (!response.ok) throw new Error('Header not found');
    const html = await response.text();
    const headerEl = document.getElementById('header');
    if (headerEl) {
      headerEl.innerHTML = html;
      fixComponentLinks(base, headerEl);
      initHeaderComponents();
    }
  } catch (error) {
    console.error('Failed to load header:', error);
  }

  try {
    const response = await fetch(footerPath);
    if (!response.ok) throw new Error('Footer not found');
    const html = await response.text();
    const footerEl = document.getElementById('footer');
    if (footerEl) {
      footerEl.innerHTML = html;
      fixComponentLinks(base, footerEl);
    }
  } catch (error) {
    console.error('Failed to load footer:', error);
  }
}
