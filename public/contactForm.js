
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
            document.getElementById('sendmessage').style.display = 'block';
            document.getElementById('errormessage').style.display = 'none';
            e.target.reset();
        } else {
            document.getElementById('sendmessage').style.display = 'none';
            document.getElementById('errormessage').style.display = 'block';
            document.getElementById('errormessage').textContent = result.message || 'Error enviando el correo';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('sendmessage').style.display = 'none';
        document.getElementById('errormessage').style.display = 'block';
        document.getElementById('errormessage').textContent = 'Ocurrió un error al procesar tu solicitud.';
    }
});