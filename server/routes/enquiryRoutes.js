const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  downloadAttachment,
  updateEnquiryStatus,
  deleteEnquiry
} = require('../controllers/enquiryController');
const { handleUpload } = require('../middleware/uploadMiddleware');
const { enquiryLimiter } = require('../middleware/rateLimiter');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public route: Submit enquiry form (rate limited + file upload support)
router.post('/', enquiryLimiter, handleUpload, createEnquiry);

// Admin protected routes
router.get('/', protectAdmin, getAllEnquiries);
router.get('/:id', protectAdmin, getEnquiryById);
router.get('/:id/attachment', protectAdmin, downloadAttachment);
router.patch('/:id/status', protectAdmin, updateEnquiryStatus);
router.delete('/:id', protectAdmin, deleteEnquiry);

module.exports = router;
