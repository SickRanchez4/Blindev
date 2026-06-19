const showMessage = (elementId, message, timeout = 3500, isError = false) => {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
    element.className = isError ? 'alert alert-danger' : 'alert alert-success';
    if (message) element.textContent = message;
    setTimeout(() => {
        element.style.display = 'none';
    }, timeout);
};

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData(e.target);

        const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        };

        const response = await fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('sendmessage', result.message || 'Message sent successfully!', 3500, false);
            e.target.reset();
        } else {
            // Handle error response with standardized format
            const errorMessage = result.message || 'An error occurred while sending your message';
            showMessage('errormessage', errorMessage, 5000, true);
            console.error('Error details:', result);
        }
    } catch (error) {
        console.error('Network or parsing error:', error);
        showMessage('errormessage', 'An unexpected error occurred. Please try again later.', 5000, true);
    }
});