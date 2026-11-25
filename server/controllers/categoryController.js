const Category = require('../models/Category');
const Product = require('../models/Product');

// Default initial export categories
const INITIAL_CATEGORIES = [
  {
    categoryId: 'spices-food',
    name: 'Spices & Food Products',
    description: 'High-aroma whole spices, culinary seeds, and naturally processed agro-commodities.',
    sortOrder: 1,
    isActive: true
  },
  {
    categoryId: 'grains-pulses',
    name: 'Grains & Agricultural Staples',
    description: 'Long-grain Basmati rice, non-basmati varieties, oilseeds, and organic grain crops.',
    sortOrder: 2,
    isActive: true
  },
  {
    categoryId: 'textiles-garments',
    name: 'Textiles & Fine Fabrics',
    description: 'Premium mulberry silk fabrics, organic combed cotton yarns, and custom home furnishings.',
    sortOrder: 3,
    isActive: true
  },
  {
    categoryId: 'metal-copper',
    name: 'Metal & Artisanal Copperware',
    description: 'Hand-hammered pure copper vessels, decorative brassware, and engineered architectural hardware.',
    sortOrder: 4,
    isActive: true
  },
  {
    categoryId: 'ceramic-stone',
    name: 'Ceramic & Natural Stone',
    description: 'Quarried Indian granite slabs, sandstone tiles, and precision vitrified ceramics.',
    sortOrder: 5,
    isActive: true
  },
  {
    categoryId: 'packaging-materials',
    name: 'Eco-Friendly Packaging Materials',
    description: 'Heavy-duty natural jute sacks, corrugated export boxes, and food-grade packaging liners.',
    sortOrder: 6,
    isActive: true
  }
];

// Helper to seed initial categories if collection is empty
const ensureCategoriesSeeded = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(INITIAL_CATEGORIES);
      console.log('[AutoSeed] Seeded default export product categories.');
    }
  } catch (err) {
    console.warn('[AutoSeed Warning] Could not seed categories:', err.message);
  }
};

// Helper to generate a clean URL-friendly slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @desc    Get all active categories (Public)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    await ensureCategoriesSeeded();

    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('[Category Controller - getCategories]', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve export categories',
      error: error.message
    });
  }
};

// @desc    Get all categories with product counts (Admin)
// @route   GET /api/categories/admin/all
// @access  Private (Admin)
const getAllCategoriesAdmin = async (req, res) => {
  try {
    await ensureCategoriesSeeded();

    const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();

    // Attach product counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        try {
          const productCount = await Product.countDocuments({
            $or: [
              { categoryId: cat.categoryId },
              { categoryName: cat.name }
            ]
          });
          return { ...cat, productCount };
        } catch (e) {
          return { ...cat, productCount: 0 };
        }
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('[Category Controller - getAllCategoriesAdmin]', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin categories',
      error: error.message
    });
  }
};

// @desc    Create new export category
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, categoryId, description, icon, sortOrder, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const cleanName = name.trim();
    let slug = categoryId ? categoryId.trim().toLowerCase() : generateSlug(cleanName);

    // Ensure slug is unique
    let existing = await Category.findOne({ categoryId: slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newCategory = await Category.create({
      categoryId: slug,
      name: cleanName,
      description: description ? description.trim() : '',
      icon: icon ? icon.trim() : '',
      sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: `Category "${newCategory.name}" created successfully`,
      category: newCategory
    });
  } catch (error) {
    console.error('[Category Controller - createCategory]', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create export category',
      error: error.message
    });
  }
};

// @desc    Update an existing export category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, sortOrder, isActive } = req.body;

    const category = await Category.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { categoryId: id }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const oldName = category.name;
    const oldId = category.categoryId;

    if (name && name.trim()) {
      category.name = name.trim();
    }
    if (description !== undefined) {
      category.description = description.trim();
    }
    if (icon !== undefined) {
      category.icon = icon.trim();
    }
    if (sortOrder !== undefined) {
      category.sortOrder = Number(sortOrder);
    }
    if (isActive !== undefined) {
      category.isActive = Boolean(isActive);
    }

    await category.save();

    // If name was changed, sync related products
    if (name && name.trim() !== oldName) {
      try {
        await Product.updateMany(
          { $or: [{ categoryId: oldId }, { categoryName: oldName }] },
          { $set: { categoryName: category.name } }
        );
      } catch (syncErr) {
        console.warn('[Sync Warning] Could not sync products to new category name:', syncErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" updated successfully`,
      category
    });
  } catch (error) {
    console.error('[Category Controller - updateCategory]', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// @desc    Delete an export category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const force = req.query.force === 'true';

    const category = await Category.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { categoryId: id }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if products exist in this category
    const assignedProductsCount = await Product.countDocuments({
      $or: [{ categoryId: category.categoryId }, { categoryName: category.name }]
    });

    if (assignedProductsCount > 0 && !force) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${assignedProductsCount} active product(s) are currently assigned to "${category.name}". Reassign or delete them first.`,
        assignedProductsCount
      });
    }

    await Category.deleteOne({ _id: category._id });

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" removed successfully`,
      deletedCategoryId: category.categoryId
    });
  } catch (error) {
    console.error('[Category Controller - deleteCategory]', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory
};
