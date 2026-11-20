const express = require('express');
const router = express.Router();
const {
  getProductLines,
  getAllProductLinesAdmin,
  createProductLine,
  updateProductLine,
  deleteProductLine
} = require('../controllers/productLineController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public route: Fetch active product lines for Quotation Form dropdown
router.get('/', getProductLines);

// Admin protected routes: Full CRUD control over product line options
router.get('/admin/all', protectAdmin, getAllProductLinesAdmin);
router.post('/', protectAdmin, createProductLine);
router.put('/:id', protectAdmin, updateProductLine);
router.delete('/:id', protectAdmin, deleteProductLine);

module.exports = router;
