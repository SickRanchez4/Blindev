const emailService = require('../services/emailService');

exports.handleContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log('toy ante del wawai')
    await emailService.sendEmail(name, email, subject, message);
    console.log('Mail sent successfully')
    res.status(200).json({ success: true, message: 'Mail sent successfully' });
  } catch (error) {
    console.error('Error captured in contact-controller:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
};
