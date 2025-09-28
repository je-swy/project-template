export function initModal() {
  const modal = document.getElementById("loginModal");
  const openBtn = document.querySelector('.icon-btn[aria-label="User account"]');
  const closeBtns = modal.querySelectorAll("[data-close]");
  const form = modal.querySelector("#loginForm");
  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const togglePasswordBtn = form.querySelector(".toggle-password");

  // Відкрити модал
  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Закрити модал
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => closeModal());
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Показати/сховати пароль
  togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePasswordBtn.setAttribute("aria-label", type === "password" ? "Show password" : "Hide password");
  });

  // Валідація форми
  form.addEventListener("submit", e => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(emailInput.value.trim());
    const passwordValid = passwordInput.value.trim().length > 0;

    if (!emailValid) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!passwordValid) {
      alert("Password is required.");
      return;
    }

    // Якщо все ок — закриваємо модал
    alert("Login successful!");
    closeModal();
    form.reset();
  });
}
