const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateContactPayload } = require('../src/validators/contactValidator');
const AppError = require('../src/utils/AppError');

const validPayload = {
  name: '  Ana  ',
  email: ' ana@example.com ',
  subject: 'Consulta',
  message: 'Hola, quiero más información.',
};

const assertRejects = (payload, expectedMessage) => {
  assert.throws(
    () => validateContactPayload(payload),
    (err) => err instanceof AppError && err.statusCode === 400 && err.message === expectedMessage
  );
};

test('returns trimmed values for a valid payload', () => {
  assert.deepEqual(validateContactPayload(validPayload), {
    name: 'Ana',
    email: 'ana@example.com',
    subject: 'Consulta',
    message: 'Hola, quiero más información.',
  });
});

test('requires every field', () => {
  assertRejects({ ...validPayload, subject: '   ' }, 'All fields (name, email, subject, message) are required');
  assertRejects(undefined, 'All fields (name, email, subject, message) are required');
});

test('enforces minimum lengths and email format', () => {
  assertRejects({ ...validPayload, name: 'A' }, 'Name must be at least 2 characters long');
  assertRejects({ ...validPayload, email: 'not-an-email' }, 'Please provide a valid email address');
  assertRejects({ ...validPayload, subject: 'Hi' }, 'Subject must be at least 3 characters long');
  assertRejects({ ...validPayload, message: 'short' }, 'Message must be at least 10 characters long');
});
