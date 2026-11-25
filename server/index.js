require('dotenv').config();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const os = require('os');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const seoRoutes = require('./routes/seoRoutes');
const productLineRoutes = require('./routes/productLineRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const {
  helmetMiddleware,
  sanitizeInputMiddleware,
  getCorsOptions
} = require('./middleware/security');
const Admin = require('./models/Admin');

const app = express();

// 1. CORS Middleware & Global Preflight Handler (Mounted first to handle all origins & OPTIONS requests)
const corsOptions = getCorsOptions();
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// 2. Disable technology fingerprinting
app.disable('x-powered-by');

// 3. Security HTTP Headers (Helmet)
app.use(helmetMiddleware);

// 4. Body Parser Middleware with strict payload limits (prevents payload attacks)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. NoSQL Injection Sanitization (strips $ and . operators)
app.use(sanitizeInputMiddleware);

// 6. Serve uploaded static assets (product photos, spec sheets)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(os.tmpdir(), 'uploads')));

// 7. Mount SEO Routes (robots.txt & sitemap.xml for search engines)
app.use('/', seoRoutes);

// 8. Health check endpoints (Lightweight, zero-DB-wait for instant Vercel checks)
app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'OK',
    service: 'IPM Exim Global API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    database: isDbConnected ? 'connected' : 'connecting_or_disconnected'
  });
});

app.get('/', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'OK',
    message: 'Import-Export Backend API is running on Vercel.',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: isDbConnected ? 'connected' : 'connecting_or_disconnected'
  });
});

// Flag to ensure auto-seed runs only once per instance
let isSeeded = false;

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

// 9. Serverless Database Connection Middleware
// Ensures MongoDB is connected before handling dynamic API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!isSeeded && mongoose.connection.readyState === 1) {
      isSeeded = true;
      autoSeedAdmin().catch((err) => {
        console.error('[AutoSeed Error]', err.message);
      });
    }
  } catch (err) {
    console.warn('[Database Middleware Notice] Could not connect to MongoDB:', err.message);
  }
  next();
});

// 10. Mount Admin Routes
app.use('/admin', adminRoutes);
app.use('/api/admin', adminRoutes);

// 11. Mount Sourcing Enquiry & Quotation Routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/enquiries', enquiryRoutes);
app.use('/admin/enquiries', enquiryRoutes);
app.use('/api/quotations', enquiryRoutes);
app.use('/quotations', enquiryRoutes);

// 12. Mount Product Lines / Sourcing Requirements Routes (Dynamic Quotation Options)
app.use('/api/product-lines', productLineRoutes);
app.use('/product-lines', productLineRoutes);

// 13. Mount Featured Export Products Routes (Dynamic Catalog CRUD)
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

// 14. Mount Export Categories Routes (Dynamic Categories CRUD)
app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes);

// 15. Mount Shipment & Consignment Routes (Dynamic From/To, Date, Video Links)
app.use('/api/shipments', shipmentRoutes);
app.use('/shipments', shipmentRoutes);

// 14. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// 15. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Start server if run directly (Local development)
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
