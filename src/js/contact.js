// Initialize contact form validation and submission handling

export function initContactForm () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const emailInput = document.getElementById('contact-email');
  const messageEl = document.getElementById('contact-form-message');
  const requiredInputs = form.querySelectorAll('[required]');

  // Real-time email validation
  emailInput.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailErrorMsg = emailInput.nextElementSibling;

    // Show error only if input is non-empty and invalid
    if (emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value)) {
      emailErrorMsg.textContent = 'Invalid email format.';
    } else {
      emailErrorMsg.textContent = '';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    let isValid = true;
    let firstInvalidField = null;

    // Check all required fields
    for (const input of requiredInputs) {
      if (input.value.trim() === '') {
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = input;
        }
      }
    }

    if (!isValid) {
      messageEl.textContent = 'Error: Please fill in all required fields.';
      messageEl.style.color = 'red';
      if (firstInvalidField) firstInvalidField.focus(); // Focus first invalid field
      return;
    }

    // Check for email format errors
    if (emailInput.nextElementSibling.textContent !== '') {
      messageEl.textContent =
        'Error: Please correct the errors before submitting.';
      messageEl.style.color = 'red';
      emailInput.focus();
      return;
    }

    // If all validations pass
    messageEl.textContent = 'Success! Your message has been sent.';
    messageEl.style.color = 'green';
    form.reset();

    setTimeout(() => {
      messageEl.textContent = '';
    }, 4000);
  });
}
