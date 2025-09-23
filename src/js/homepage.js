document.addEventListener('DOMContentLoaded', initCarousel);

function initCarousel() {
  const slides  = document.querySelector('.carousel__slides');
  const prevBtn = document.querySelector('.carousel__btn--prev');
  const nextBtn = document.querySelector('.carousel__btn--next');
  if (!slides || !prevBtn || !nextBtn) return;

  nextBtn.addEventListener('click', () => {
    slides.scrollBy({ left: slides.clientWidth * 0.8, behavior: 'smooth' });
  });
  prevBtn.addEventListener('click', () => {
    slides.scrollBy({ left: -slides.clientWidth * 0.8, behavior: 'smooth' });
  });
}
