/**
 * Contact form - envía el formulario a /contact y muestra el resultado.
 */
(() => {
    const SUCCESS_TIMEOUT_MS = 3500;
    const ERROR_TIMEOUT_MS = 5000;
    const DEFAULT_SUCCESS_MESSAGE = 'Message sent successfully!';
    const DEFAULT_ERROR_MESSAGE = 'An error occurred while sending your message';
    const UNEXPECTED_ERROR_MESSAGE = 'An unexpected error occurred. Please try again later.';

    const form = document.getElementById('contactForm');
    if (!form) return;

    const successBox = document.getElementById('sendmessage');
    const errorBox = document.getElementById('errormessage');
    const loadingIndicator = document.getElementById('contact-loading');
    const submitButton = form.querySelector('button[type="submit"]');
    let hideFeedbackTimer = null;

    const hideFeedback = () => {
        clearTimeout(hideFeedbackTimer);
        successBox.classList.remove('show');
        errorBox.classList.remove('show');
    };

    const showFeedback = (box, message, timeoutMs) => {
        hideFeedback();
        box.textContent = message;
        box.classList.add('show');
        hideFeedbackTimer = setTimeout(hideFeedback, timeoutMs);
    };

    const setLoading = (isLoading) => {
        loadingIndicator.classList.toggle('d-none', !isLoading);
        submitButton.disabled = isLoading;
    };

    const parseJsonSafely = async (response) => {
        try {
            return await response.json();
        } catch {
            return {};
        }
    };

    const sendContactRequest = async (formElement) => {
        const payload = Object.fromEntries(new FormData(formElement));
        const response = await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return { ok: response.ok, result: await parseJsonSafely(response) };
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const { ok, result } = await sendContactRequest(form);

            if (ok) {
                showFeedback(successBox, result.message || DEFAULT_SUCCESS_MESSAGE, SUCCESS_TIMEOUT_MS);
                form.reset();
            } else {
                showFeedback(errorBox, result.message || DEFAULT_ERROR_MESSAGE, ERROR_TIMEOUT_MS);
                console.error('Error details:', result);
            }
        } catch (error) {
            console.error('Network error:', error);
            showFeedback(errorBox, UNEXPECTED_ERROR_MESSAGE, ERROR_TIMEOUT_MS);
        } finally {
            setLoading(false);
        }
    });
})();
