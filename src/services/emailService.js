const nodemailer = require("nodemailer");
//require('dotenv').config(); 

exports.sendEmail = async (name, email, subject, message) => {
  try {
    console.log('Iniciando proceso de envío de correo...');
    console.log('Usuario de correo (MAIL_USER):', process.env.MAIL_USER ? process.env.MAIL_USER.substring(0, 5) + '...' : 'No definido');

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      const errorMsg = 'Error: MAIL_USER o MAIL_PASS no están definidos en las variables de entorno.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      text: `Hola ${name},\n\n Tu mensaje fue el siguiente: \n\n${message}\n\n\nPronto un representante de Blindev se contactará contigo!\n\nGracias por contactarnos.`,
    };

    const ownMailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: "BLINDEV - Nuevo mensaje de contacto",
      text: `\nNombre del cliente:  ${name}\n\nCorreo del cliente:  ${email}\n\nMotivo del contacto:  ${subject}\n\n Su mensaje fue el siguiente:\n${message}\n\n`,
    };

    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(ownMailOptions),
    ]);

  } catch (error) {
    console.error('--- ERROR en emailService ---');
    console.error('Mensaje de Error :', error.message);

    if (error.response) {
      console.error('Respuesta del servicio de correo (Nodemailer):', error.response);
    }
    if (error.code) {
      console.error('Código de error (Nodemailer):', error.code);
    }
    if (error.command) {
      console.error('Comando fallido (Nodemailer):', error.command);
    }

    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    } else {
      console.error('Objeto de error completo (no es instancia de Error):', error);
    }
    console.error('-----------------------------------------------');
    throw error;
  }
};
