const nodemailer = require("nodemailer");
// require('dotenv').config(); 

exports.sendEmail = async (name, email, subject, message) => {
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
};
