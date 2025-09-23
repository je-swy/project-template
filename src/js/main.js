document.addEventListener('DOMContentLoaded', () => {
  includeComponents();
});

async function includeComponents() {
  const isInPages = window.location.pathname.includes('/pages/');
  const base = isInPages ? '../' : './';

  const headerPath = base + 'components/header.html';
  const footerPath = base + 'components/footer.html';

  // Завантаження header
  try {
    const headerRes = await fetch(headerPath);
    if (!headerRes.ok) throw new Error('Header not found: ' + headerPath);
    const headerHtml = await headerRes.text();

    const headerEl = document.getElementById('header');
    if (headerEl) {
      headerEl.innerHTML = headerHtml;

      fixLinks(base);
      highlightActiveLink();
      initBurgerMenu();
    }
  } catch (err) {
    console.error(err);
  }

  // Завантаження footer
  try {
    const footerRes = await fetch(footerPath);
    if (footerRes.ok) {
      const footerHtml = await footerRes.text();
      const footerEl = document.getElementById('footer');
      if (footerEl) footerEl.innerHTML = footerHtml;
    }
  } catch (err) {
    console.warn('Footer not found');
  }
}

// Виправляємо відносні шляхи для посилань у header/footer
function fixLinks(base) {
  document.querySelectorAll('#header a, #footer a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (!href.startsWith('http') && !href.startsWith(base)) {
      link.setAttribute('href', base + href);
    }
  });
}

// Підсвічування активного пункту меню
function highlightActiveLink() {
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('#header .nav__list a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

// Логіка бургер-меню
function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

// Minimal JS for Prev/Next
const slides = document.querySelector(".carousel__slides");
const prevBtn = document.querySelector(".carousel__btn--prev");
const nextBtn = document.querySelector(".carousel__btn--next");

nextBtn.addEventListener("click", () => {
  slides.scrollBy({
    left: slides.clientWidth * 0.8,
    behavior: "smooth",
  });
});

prevBtn.addEventListener("click", () => {
  slides.scrollBy({
    left: -slides.clientWidth * 0.8,
    behavior: "smooth",
  });
});
