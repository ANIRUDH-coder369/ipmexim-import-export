const express = require('express');
const router = express.Router();
const {
  getCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public route: Fetch active categories for catalog & dropdowns
router.get('/', getCategories);

// Admin protected routes: Full CRUD control over export categories
router.get('/admin/all', protectAdmin, getAllCategoriesAdmin);
router.post('/', protectAdmin, createCategory);
router.put('/:id', protectAdmin, updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

module.exports = router;
