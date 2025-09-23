document.addEventListener("DOMContentLoaded", initSuitcasesCarousel);

function initSuitcasesCarousel() {
  const scrollContainer = document.getElementById("scroll-container");
  const progressBar     = document.getElementById("scroll-progress-bar");
  const btnLeft         = document.getElementById("scroll-left");
  const btnRight        = document.getElementById("scroll-right");
  const scrollAmount    = scrollContainer.clientWidth * 0.8;

  if (!scrollContainer || !progressBar || !btnLeft || !btnRight) return;

  // Оновлення прогрес-бара
  function updateProgress() {
    const maxScroll  = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const percent    = (scrollContainer.scrollLeft / maxScroll) * 100;
    progressBar.style.width = `${percent}%`;
  }

  // Прокрутка
  btnRight.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
  btnLeft.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  scrollContainer.addEventListener("scroll", updateProgress);
  // Ініціальна ініціалізація
  updateProgress();
}
