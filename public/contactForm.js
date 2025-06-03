const showMessage = (elementId, message, timeout = 3500) => {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
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

        if (response.ok) {
            showMessage('sendmessage', null);
            e.target.reset();
        } else {
            showMessage('errormessage', 'Error enviando el correo');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('errormessage', 'Ocurrió un error al procesar tu solicitud.');
    }
});