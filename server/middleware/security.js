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
  contentSecurityPolicy: false, // Disabled for pure REST API to prevent CORS & header conflicts
  crossOriginEmbedderPolicy: false,
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
 * Universal CORS Configuration supporting localhost, Vercel, and production domains
 */
const getCorsOptions = () => {
  return {
    origin: function (origin, callback) {
      // Dynamic origin reflection: echoes incoming Origin so credentials: true works seamlessly
      callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'X-Access-Token'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 hours preflight cache
  };
};

module.exports = {
  sanitizeInputMiddleware,
  helmetMiddleware,
  getCorsOptions
};
