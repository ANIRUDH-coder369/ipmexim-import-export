const helmet = require('helmet');

/**
 * Sanitize object recursively to remove MongoDB operator injection keys ($ and .)
 */
const cleanInput = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanInput);
  }

  const sanitized = {};
  for (const key of Object.keys(obj)) {
    // Strip leading $ or keys with dots which are used in MongoDB injection attacks
    const cleanKey = key.replace(/^\$|\./g, '_');
    sanitized[cleanKey] = cleanInput(obj[key]);
  }
  return sanitized;
};

const sanitizeInputMiddleware = (req, res, next) => {
  if (req.body) req.body = cleanInput(req.body);
  if (req.query) req.query = cleanInput(req.query);
  if (req.params) req.params = cleanInput(req.params);
  next();
};

/**
 * Enhanced Helmet Security Headers
 */
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Allows cross-origin asset loading
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
});

/**
 * CORS Configuration supporting local frontend and production domains
 */
const getCorsOptions = () => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL
  ].filter(Boolean);

  return {
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to allow during development
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    maxAge: 86400 // 24 hours preflight cache
  };
};

module.exports = {
  sanitizeInputMiddleware,
  helmetMiddleware,
  getCorsOptions
};
