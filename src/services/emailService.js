const nodemailer = require('nodemailer');
const config = require('../config');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const OWNER_NOTIFICATION_SUBJECT = 'BLINDEV - Nuevo mensaje de contacto';

let transporter = null;

const assertMailConfigured = () => {
  if (!config.mail.user || !config.mail.pass) {
    throw new AppError(
      'Email configuration is missing. Please set MAIL_USER and MAIL_PASS environment variables.',
      500
    );
  }
};

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
      logger: !config.isProduction,
    });
  }
  return transporter;
};

const buildConfirmationEmail = ({ name, email, subject, message }) => ({
  from: config.mail.user,
  to: email,
  subject,
  text: `Hola ${name},\n\n Tu mensaje fue el siguiente: \n\n${message}\n\n\nPronto un representante de Blindev se contactará contigo!\n\nGracias por contactarnos.`,
});

const buildOwnerNotificationEmail = ({ name, email, subject, message }) => ({
  from: config.mail.user,
  to: config.mail.user,
  subject: OWNER_NOTIFICATION_SUBJECT,
  text: `\nNombre del cliente:  ${name}\n\nCorreo del cliente:  ${email}\n\nMotivo del contacto:  ${subject}\n\n Su mensaje fue el siguiente:\n${message}\n\n`,
});

const toAppError = (error) => {
  if (error.code === 'EAUTH') {
    return new AppError('Email authentication failed. Please verify your email credentials.', 500);
  }
  if (error.code === 'ECONNREFUSED') {
    return new AppError('Failed to connect to email server. Please try again later.', 503);
  }
  if (error.response) {
    return new AppError('Email service returned an error. Please try again later.', 503);
  }
  return new AppError('Failed to send email. Please try again later.', 500);
};

/**
 * Sends a confirmation email to the person who filled the contact form and,
 * when MAIL_NOTIFY_OWNER=true, a copy of the message to the site owner.
 * @param {{ name: string, email: string, subject: string, message: string }} contact
 */
const sendContactEmails = async (contact) => {
  assertMailConfigured();

  const emails = [buildConfirmationEmail(contact)];
  if (config.mail.notifyOwner) {
    emails.push(buildOwnerNotificationEmail(contact));
  }

  try {
    const mailer = getTransporter();
    await Promise.all(emails.map((email) => mailer.sendMail(email)));
  } catch (error) {
    logger.error(`EMAIL SERVICE ERROR (code: ${error.code}): ${error.message}`);
    throw toAppError(error);
  }
};

module.exports = { sendContactEmails };
