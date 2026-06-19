const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const contactRoutes = require('./routes/contact');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const publicDir = path.join(__dirname, '..', 'public');
const indexPath = path.join(publicDir, 'index.html');
const indexTemplate = fs.readFileSync(indexPath, 'utf8');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.CONTACT_RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many contact requests. Please try again later.',
  },
});

const renderIndex = (req, res) => {
  const endpoint = JSON.stringify(process.env.CHATBOT_ENDPOINT || '');
  const injected = indexTemplate.replace(
    '</head>',
    `<script>window.CHATBOT_ENDPOINT=${endpoint};</script>\n</head>`
  );
  res.type('html').send(injected);
};

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', renderIndex);
app.get('/index.html', renderIndex);
app.use(express.static(publicDir));

// Routes
app.use('/contact', contactLimiter, contactRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Not Found middleware
app.use(notFound);

// Centralized error handler middleware
app.use(errorHandler);

module.exports = app;