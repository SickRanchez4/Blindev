const AppError = require('../utils/AppError');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_LENGTH = Object.freeze({
  name: 2,
  subject: 3,
  message: 10,
});

const normalize = (value) => String(value || '').trim();

const assertMinLength = (value, minLength, label) => {
  if (value.length < minLength) {
    throw new AppError(`${label} must be at least ${minLength} characters long`, 400);
  }
};

/**
 * Validates and normalizes the contact form payload.
 * @returns {{ name: string, email: string, subject: string, message: string }}
 * @throws {AppError} 400 when the payload is invalid.
 */
const validateContactPayload = (body = {}) => {
  const contact = {
    name: normalize(body.name),
    email: normalize(body.email),
    subject: normalize(body.subject),
    message: normalize(body.message),
  };

  if (Object.values(contact).some((value) => !value)) {
    throw new AppError('All fields (name, email, subject, message) are required', 400);
  }

  assertMinLength(contact.name, MIN_LENGTH.name, 'Name');

  if (!EMAIL_PATTERN.test(contact.email)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  assertMinLength(contact.subject, MIN_LENGTH.subject, 'Subject');
  assertMinLength(contact.message, MIN_LENGTH.message, 'Message');

  return contact;
};

module.exports = { validateContactPayload, MIN_LENGTH };
