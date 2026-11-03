const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const contactRoutes = require('./routes/contact');
const { contactRateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const INDEX_PATH = path.join(PUBLIC_DIR, 'index.html');

// Escapes "<" so a value like "</script>" cannot break out of the inline script tag.
const toInlineScriptValue = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const buildIndexHtml = () => {
  const template = fs.readFileSync(INDEX_PATH, 'utf8');
  const configScript = `<script>window.CHATBOT_ENDPOINT=${toInlineScriptValue(config.chatbotEndpoint)};</script>`;
  return template.replace('</head>', `${configScript}\n</head>`);
};

const indexHtml = buildIndexHtml();

const renderIndex = (req, res) => {
  res.type('html').send(indexHtml);
};

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
if (!config.isProduction) {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(['/', '/index.html'], renderIndex);
app.use(express.static(PUBLIC_DIR));

app.use('/contact', contactRateLimiter, contactRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
