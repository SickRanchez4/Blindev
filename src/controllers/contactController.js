const emailService = require('../services/emailService');
const AppError = require('../utils/AppError');

exports.handleContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;
  const normalizedName = String(name || '').trim();
  const normalizedEmail = String(email || '').trim();
  const normalizedSubject = String(subject || '').trim();
  const normalizedMessage = String(message || '').trim();

  if (!normalizedName || !normalizedEmail || !normalizedSubject || !normalizedMessage) {
    throw new AppError('All fields (name, email, subject, message) are required', 400);
  }

  if (normalizedName.length < 2) {
    throw new AppError('Name must be at least 2 characters long', 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  if (normalizedSubject.length < 3) {
    throw new AppError('Subject must be at least 3 characters long', 400);
  }

  if (normalizedMessage.length < 10) {
    throw new AppError('Message must be at least 10 characters long', 400);
  }

  await emailService.sendEmail(
    normalizedName,
    normalizedEmail,
    normalizedSubject,
    normalizedMessage
  );

  res.status(200).json({
    status: 'success',
    message: 'Email sent successfully. We will get back to you soon!',
    timestamp: new Date().toISOString(),
  });
};
