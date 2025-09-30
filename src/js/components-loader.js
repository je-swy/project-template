// src/js/components-loader.js

import { initCartCountAuto } from './cart-count.js';

// --- Допоміжна функція для виправлення шляхів ---
function fixComponentLinks(basePath, componentElement) {
  // Виправлення посилань
  componentElement.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/')) {
      link.setAttribute('href', `${basePath}${href}`);
    }
  });
  // Виправлення шляхів до зображень
  componentElement.querySelectorAll('img[src]').forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('#') && !src.startsWith('/')) {
      img.setAttribute('src', `${basePath}${src}`);
    }
  });
}

export async function includeComponents() {
  const isInPages = window.location.pathname.includes('/pages/');
  const base = isInPages ? '../' : ''; 
  const headerPath = `${base}components/header.html`;
  const footerPath = `${base}components/footer.html`;

  // === HEADER ===
  try {
    const headerRes = await fetch(headerPath);
    if (!headerRes.ok) throw new Error('Header not found: ' + headerPath);
    const headerHtml = await headerRes.text();
    const headerEl = document.getElementById('header');
    if (headerEl) {
      headerEl.innerHTML = headerHtml;
      fixComponentLinks(base, headerEl);
      
      // Ініціалізуємо всі компоненти хедера ПІСЛЯ його завантаження
      initHeaderComponents();
    }
  } catch (err) {
    console.error(err);
  }

  // === FOOTER ===
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

// --- Нова централізована функція для ініціалізації хедера ---
function initHeaderComponents() {
  // 1. Логіка для модального вікна
  const modal = document.getElementById("loginModal");
  const openBtn = document.querySelector('.icon-btn[aria-label="User account"]');
  if (modal && openBtn) {
    const closeBtns = modal.querySelectorAll("[data-close]");
    
    const openModal = () => {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    };

    openBtn.addEventListener("click", openModal);
    closeBtns.forEach(btn => btn.addEventListener("click", closeModal));
    modal.addEventListener("click", e => {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
  }
  
  // 2. Логіка для бургер-меню
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
  }

  // 3. Ініціалізація лічильника кошика
  initCartCountAuto();
}