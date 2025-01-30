require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

// Middleware para parsear datos enviados desde el frontend
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para manejar el envío de correos
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: `Hola ${name},\n\n Tu mensaje fue el siguiente: \n\n${message}\n\n\nPronto un representante de Blindev se contactará contigo!\n\nGracias por contactarnos.`,
        };

        const ownMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_OWNER,
            subject: "BLINDEV - Nuevo mensaje de contacto",
            text: `\nNombre del cliente:  ${name}\n\nCorreo del cliente:  ${email}\n\nMotivo del contacto:  ${subject}\n\n Su mensaje fue el siguiente:\n${message}\n\n`,
        };

        await Promise.all([
            transporter.sendMail(mailOptions),
            transporter.sendMail(ownMailOptions)
        ]);

        res.status(200).json({ message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error enviando el correo:', error);
        res.status(500).json({ message: 'Error enviando el correo' });
    }
});

// Iniciar el servidor
const PORT = 3000;
//const PORT_PRODUCTION = process.env.PORT; //For shark

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
