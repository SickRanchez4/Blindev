const emailService = require('../services/emailService');

exports.handleContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await emailService.sendEmail(name, email, subject, message);
    res.status(200).json({ success: true, message: 'Mail sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' });
  }
};
