// src/js/contact.js

export function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const emailInput = document.getElementById('contact-email');
    const messageEl = document.getElementById('contact-form-message');
    const requiredInputs = form.querySelectorAll('[required]');

    // Валідація email в реальному часі
    emailInput.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailErrorMsg = emailInput.nextElementSibling;
        
        // Показуємо помилку, тільки якщо поле не порожнє і формат неправильний
        if (emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value)) {
            emailErrorMsg.textContent = 'Invalid email format.';
        } else {
            emailErrorMsg.textContent = '';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Забороняємо перезавантаження сторінки
        let isValid = true;
        let firstInvalidField = null;

        // Перевірка, чи всі обов'язкові поля заповнені
        requiredInputs.forEach(input => {
            if (input.value.trim() === '') {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = input;
                }
            }
        });

        if (!isValid) {
            messageEl.textContent = 'Error: Please fill in all required fields.';
            messageEl.style.color = 'red';
            if (firstInvalidField) firstInvalidField.focus(); // Фокус на першому порожньому полі
            return;
        }
        
        // Додаткова перевірка формату email при відправці
        if (emailInput.nextElementSibling.textContent !== '') {
            messageEl.textContent = 'Error: Please correct the errors before submitting.';
            messageEl.style.color = 'red';
            emailInput.focus();
            return;
        }

        // Імітація успішної відправки
        messageEl.textContent = 'Success! Your message has been sent.';
        messageEl.style.color = 'green';
        form.reset();
        
        setTimeout(() => {
            messageEl.textContent = '';
        }, 4000);
    });
}