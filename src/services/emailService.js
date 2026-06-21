const nodemailer = require("nodemailer");
const AppError = require('../utils/AppError');

exports.sendEmail = async (name, email, subject, message) => {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new AppError('Email configuration is missing. Please set MAIL_USER and MAIL_PASS environment variables.', 500);
    }

    const isProduction = process.env.NODE_ENV === 'production';

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      logger: !isProduction,
      family: 4,
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
    const errorTimestamp = new Date().toISOString();
    console.error(`[${errorTimestamp}] EMAIL SERVICE ERROR:`);
    console.error('Message:', error.message);
    console.error('Code:', error.code);

    // Handle specific Nodemailer errors
    if (error.code === 'EAUTH') {
      throw new AppError('Email authentication failed. Please verify your email credentials.', 500);
    }
    if (error.code === 'ECONNREFUSED') {
      throw new AppError('Failed to connect to email server. Please try again later.', 503);
    }
    if (error.response) {
      throw new AppError('Email service returned an error. Please try again later.', 503);
    }

    // Generic email error
    throw new AppError('Failed to send email. Please try again later.', 500);
  }
};
