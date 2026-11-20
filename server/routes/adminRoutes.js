const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  seedAdminController,
  checkAdminAuth,
  getAllQuotations,
  getQuotationById,
  updateQuotationStatus,
  deleteQuotation,
  sendCustomerEmail
} = require('../controllers/adminController');
const { loginLimiter } = require('../middleware/rateLimiter');
const { protectAdmin } = require('../middleware/authMiddleware');

// Route: /admin/login (Rate limited)
router.post('/login', loginLimiter, loginAdmin);

// Route: /admin/check-auth (Checks if admin is authenticated)
router.get('/check-auth', protectAdmin, checkAdminAuth);

// Route: /admin/me (Protected by JWT)
router.get('/me', protectAdmin, getAdminProfile);

// Route: /admin/seed (Database initialization endpoint)
router.post('/seed', seedAdminController);

// Quotation Entries Management for Logged-In Admin
router.get('/quotations', protectAdmin, getAllQuotations);
router.get('/quotations/:id', protectAdmin, getQuotationById);
router.patch('/quotations/:id/status', protectAdmin, updateQuotationStatus);
router.delete('/quotations/:id', protectAdmin, deleteQuotation);

// Admin Emailing Customer Routes
router.post('/send-email', protectAdmin, sendCustomerEmail);
router.post('/quotations/:id/send-email', protectAdmin, sendCustomerEmail);

module.exports = router;
