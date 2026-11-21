const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  toggleFeatured,
  deleteProduct
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { handleProductUpload } = require('../middleware/productUploadMiddleware');

// Public endpoints
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:idOrSlug', getProductBySlugOrId);

// Admin-protected CRUD endpoints with file upload logic
router.post('/', protectAdmin, handleProductUpload, createProduct);
router.put('/:id', protectAdmin, handleProductUpload, updateProduct);
router.patch('/:id', protectAdmin, handleProductUpload, updateProduct);
router.patch('/:id/toggle-featured', protectAdmin, toggleFeatured);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;
