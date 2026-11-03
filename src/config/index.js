const DEFAULT_PORT = 3000;
const DEFAULT_CONTACT_RATE_LIMIT_MAX = 20;
const CONTACT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const env = process.env.NODE_ENV;

module.exports = Object.freeze({
  env,
  isProduction: env === 'production',
  isDevelopment: env === 'development',
  port: toPositiveInt(process.env.PORT, DEFAULT_PORT),
  chatbotEndpoint: process.env.CHATBOT_ENDPOINT || '',
  contactRateLimit: Object.freeze({
    windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
    max: toPositiveInt(process.env.CONTACT_RATE_LIMIT_MAX, DEFAULT_CONTACT_RATE_LIMIT_MAX),
  }),
  mail: Object.freeze({
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
    notifyOwner: process.env.MAIL_NOTIFY_OWNER === 'true',
  }),
});
