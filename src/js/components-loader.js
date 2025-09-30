// src/js/components-loader.js

import { initCartCountAuto } from './cart-count.js';

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

export async function includeComponents() {
  const isInPages = window.location.pathname.includes('/pages/');
  const base = isInPages ? '../' : './';
  const headerPath = `${base}components/header.html`;
  const footerPath = `${base}components/footer.html`;

  try {
    const headerRes = await fetch(headerPath);
    if (!headerRes.ok) throw new Error('Header not found');
    const headerHtml = await headerRes.text();
    const headerEl = document.getElementById('header');
    if (headerEl) {
      headerEl.innerHTML = headerHtml;
      fixComponentLinks(base, headerEl);
      initHeaderComponents();
    }
  } catch (err) {
    console.error('Failed to load header:', err);
  }

  try {
    const footerRes = await fetch(footerPath);
    if (footerRes.ok) {
      const footerHtml = await footerRes.text();
      const footerEl = document.getElementById('footer');
      if (footerEl) {
        footerEl.innerHTML = footerHtml;
        fixComponentLinks(base, footerEl);
      }
    }
  } catch (err) {
    console.warn('Footer not found');
  }
}

function initHeaderComponents() {
  // --- Логіка для модального вікна ---
  const openModalBtn = document.querySelector('.icon-btn[aria-label="User account"]');
  const modal = document.getElementById('loginModal');
  
  if (openModalBtn && modal) {
    const closeModalBtns = modal.querySelectorAll('[data-close]');
    const form = modal.querySelector('#loginForm');
    const emailInput = modal.querySelector('#email');
    const passwordInput = modal.querySelector('#password');
    const togglePasswordBtn = modal.querySelector('.toggle-password');

    const openModal = () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      form.reset(); // Очищуємо форму при закритті
      // Скидаємо повідомлення про помилки
      emailInput.nextElementSibling.textContent = '';
      passwordInput.closest('.password-wrapper').nextElementSibling.textContent = '';
    };

    // 1. Відкриваємо вікно
    openModalBtn.addEventListener('click', openModal);

    // 2. Закриваємо вікно
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // --- НОВА ЛОГІКА: Перемикач видимості пароля ---
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
    });

    // --- НОВА ЛОГІКА: Валідація форми при відправці ---
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Забороняємо перезавантаження сторінки
      let isValid = true;

      // Перевірка Email
      const emailValue = emailInput.value.trim();
      const emailErrorMsg = emailInput.nextElementSibling;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailValue)) {
        emailErrorMsg.textContent = 'Please enter a valid email.';
        isValid = false;
      } else {
        emailErrorMsg.textContent = '';
      }

      // Перевірка пароля
      const passwordValue = passwordInput.value.trim();
      const passwordErrorMsg = passwordInput.closest('.password-wrapper').nextElementSibling;

      if (passwordValue === '') {
        passwordErrorMsg.textContent = 'Password is required.';
        isValid = false;
      } else {
        passwordErrorMsg.textContent = '';
      }

      // Якщо всі поля валідні
      if (isValid) {
        alert('Login successful!'); // Повідомлення про успішний вхід
        closeModal(); // Закриваємо вікно
      }
    });
  }

  // --- Логіка для бургер-меню ---
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    // ... (код для бургер-меню без змін)
  }

  // --- Ініціалізація лічильника кошика ---
  initCartCountAuto();
}