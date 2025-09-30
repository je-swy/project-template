// src/js/components-loader.js

import { initCartCountAuto } from './cart-count.js';

// --- Допоміжна функція для виправлення шляхів ---
function fixComponentLinks(basePath, componentElement) {
  componentElement.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/')) {
      link.setAttribute('href', `${basePath}${href}`);
    }
  });
  componentElement.querySelectorAll('img[src]').forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('#') && !src.startsWith('/')) {
      img.setAttribute('src', `${basePath}${src}`);
    }
  });
}

// --- Функція для ініціалізації ВСІХ компонентів хедера ---
function initHeaderComponents() {
  // 1. Логіка для модального вікна
  const openModalBtn = document.querySelector('.icon-btn[aria-label="User account"]');
  const modal = document.getElementById('loginModal');
  
  if (openModalBtn && modal) {
    const form = modal.querySelector('#loginForm');
    const emailInput = modal.querySelector('#email');
    const passwordInput = modal.querySelector('#password');
    const togglePasswordBtn = modal.querySelector('.toggle-password');
    const closeModalBtns = modal.querySelectorAll('[data-close]');

    const openModal = () => {
      modal.hidden = false;
    };

    const closeModal = () => {
      modal.hidden = true;
      if (form) {
          form.reset();
          emailInput.nextElementSibling.textContent = '';
          passwordInput.closest('.password-wrapper').nextElementSibling.textContent = '';
      }
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            // ... (тут вся логіка валідації)
            let isValid = true;
            const emailValue = emailInput.value.trim();
            const emailErrorMsg = emailInput.nextElementSibling;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                emailErrorMsg.textContent = 'Please enter a valid email.';
                isValid = false;
            } else {
                emailErrorMsg.textContent = '';
            }
            const passwordValue = passwordInput.value.trim();
            const passwordErrorMsg = passwordInput.closest('.password-wrapper').nextElementSibling;
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

  // 2. Логіка для бургер-меню
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }

  // 3. Ініціалізація лічильника кошика
  initCartCountAuto();
}


// --- ГОЛОВНА ФУНКЦІЯ ЗАВАНТАЖЕННЯ ---
export async function includeComponents() {
  const isInPages = window.location.pathname.includes('/pages/');
  const base = isInPages ? '../' : './';
  const headerPath = `${base}components/header.html`;
  const footerPath = `${base}components/footer.html`;

  // Завантажуємо хедер
  try {
    const response = await fetch(headerPath);
    const html = await response.text();
    const headerEl = document.getElementById('header');
    if (headerEl) {
      headerEl.innerHTML = html;
      fixComponentLinks(base, headerEl);
      // Ініціалізуємо скрипти ТІЛЬКИ ПІСЛЯ вставки HTML
      initHeaderComponents();
    }
  } catch (error) {
    console.error('Failed to load header:', error);
  }
  
  // Завантажуємо футер
  try {
    const response = await fetch(footerPath);
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