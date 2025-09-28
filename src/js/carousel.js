
export function initCarousel() {
    const list    = document.getElementById("carousel-list");
    const prevBtn = document.querySelector(".carousel-prev");
    const nextBtn = document.querySelector(".carousel-next");
  
    if (!list || !prevBtn || !nextBtn) return;
  
    // Зчитуємо gap зі стилю контейнера
    const listStyle = getComputedStyle(list);
    const gap       = parseFloat(listStyle.getPropertyValue("gap")) || 0;
  
    // Функція для обчислення актуальної ширини одного "крока"
    function getStep() {
      const slide = list.querySelector(".carousel-item");
      if (!slide) return 0;
      const slideWidth = slide.getBoundingClientRect().width;
      return slideWidth + gap;
    }
  
    prevBtn.addEventListener("click", () => {
      const step = getStep();
      list.scrollBy({ left: -step, behavior: "smooth" });
    });
  
    nextBtn.addEventListener("click", () => {
      const step = getStep();
      list.scrollBy({ left: step, behavior: "smooth" });
    });
  }
  