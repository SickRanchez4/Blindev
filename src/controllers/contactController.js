const { validateContactPayload } = require('../validators/contactValidator');
const { sendContactEmails } = require('../services/emailService');

const handleContactForm = async (req, res) => {
  const contact = validateContactPayload(req.body);

  await sendContactEmails(contact);

  res.status(200).json({
    status: 'success',
    message: 'Email sent successfully. We will get back to you soon!',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { handleContactForm };
