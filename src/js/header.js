document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("loginModal");
  const openBtn = document.querySelector('.icon-btn[aria-label="User account"]');
  const closeBtns = modal.querySelectorAll("[data-close]");
  const form = document.getElementById("loginForm");
  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const togglePasswordBtn = form.querySelector(".toggle-password");

  // Відкрити модалку
  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Закрити модалку
  closeBtns.forEach(btn =>
    btn.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    })
  );

  // Закриття по кліку на оверлей
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target.hasAttribute("data-close")) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Показати/сховати пароль
  togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePasswordBtn.setAttribute(
      "aria-label",
      type === "password" ? "Show password" : "Hide password"
    );
  });

  // Валідація
  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    // Email перевірка
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailError = emailInput.nextElementSibling;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email";
      valid = false;
    } else {
      emailError.textContent = "";
    }

    // Пароль перевірка
    const passwordError = passwordInput.closest(".form-group").querySelector(".error-msg");
    if (passwordInput.value.trim() === "") {
      passwordError.textContent = "Password is required";
      valid = false;
    } else {
      passwordError.textContent = "";
    }

    // Якщо все валідно — закриваємо модалку
    if (valid) {
      alert("Login successful!");
      modal.classList.remove("active");
      document.body.style.overflow = "";
      form.reset();
    }
  });
});
