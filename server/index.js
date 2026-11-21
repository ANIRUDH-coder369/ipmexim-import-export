require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const seoRoutes = require('./routes/seoRoutes');
const productLineRoutes = require('./routes/productLineRoutes');
const productRoutes = require('./routes/productRoutes');
const {
  helmetMiddleware,
  sanitizeInputMiddleware,
  getCorsOptions
} = require('./middleware/security');
const Admin = require('./models/Admin');

const app = express();

// Disable technology fingerprinting
app.disable('x-powered-by');

// Security HTTP Headers (Helmet: CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
app.use(helmetMiddleware);

// CORS Middleware with Origin Whitelist
app.use(cors(getCorsOptions()));

// Body Parser Middleware with strict payload limits (prevents payload attacks)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// NoSQL Injection Sanitization (strips $ and . operators)
app.use(sanitizeInputMiddleware);

// Serve uploaded static assets (product photos, spec sheets)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount SEO Routes (robots.txt & sitemap.xml for search engines)
app.use('/', seoRoutes);

// Auto-seed admin if none exists
const autoSeedAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = (process.env.ADMIN_EMAIL || 'admin@importexport.com').toLowerCase().trim();
      const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
      const name = process.env.ADMIN_NAME || 'Super Admin';

      await Admin.create({
        name,
        email,
        password,
        role: 'superadmin'
      });
      console.log(`[AutoSeed] Default admin account seeded: ${email}`);
    }
  } catch (error) {
    console.error('[AutoSeed] Error during auto-seeding:', error.message);
  }
};

// Mount Admin Routes
app.use('/admin', adminRoutes);
// Optional alias for API standard convention
app.use('/api/admin', adminRoutes);

// Mount Sourcing Enquiry & Quotation Routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/enquiries', enquiryRoutes);
app.use('/admin/enquiries', enquiryRoutes);
app.use('/api/quotations', enquiryRoutes);
app.use('/quotations', enquiryRoutes);

// Mount Product Lines / Sourcing Requirements Routes (Dynamic Quotation Options)
app.use('/api/product-lines', productLineRoutes);
app.use('/product-lines', productLineRoutes);

// Mount Featured Export Products Routes (Dynamic Catalog CRUD)
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('Import-Export Backend API is running.');
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Start server if run directly
if (require.main === module) {
  connectDB()
    .then(async () => {
      await autoSeedAdmin();
      app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to initialize server:', err);
    });
}

module.exports = app;
