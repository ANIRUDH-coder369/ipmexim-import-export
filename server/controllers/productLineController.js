const ProductLine = require('../models/ProductLine');

// Default initial product lines if database is fresh
const INITIAL_PRODUCT_LINES = [
  {
    name: '1121 Steam Basmati Rice (XXL Extra Long Grain)',
    category: 'Premium Basmati & Non-Basmati Rice',
    description: 'Average grain length 8.35mm+, elongation ratio 2.5x, moisture max 12.5%.',
    defaultUnit: '20ft FCL (25 MT) / 40ft FCL',
    isActive: true,
    sortOrder: 1
  },
  {
    name: '1509 Golden Sella Basmati Rice',
    category: 'Premium Basmati & Non-Basmati Rice',
    description: 'Parboiled golden grain with exceptional aroma and separation.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Alleppey Green Cardamom (8mm Bold)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Deep green, whole pods, rich essential oil content (min 7%).',
    defaultUnit: 'Metric Tons / Master Cartons',
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Guntur S4 Red Chilli (Stemless / With Stem)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Hot pungent dried red chillies, 25,000–35,000 SHU, ASTA color 50–70.',
    defaultUnit: '1 x 20ft FCL (14 MT)',
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'Salem Turmeric Fingers (Curcumin 3.5%+)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Polished hard golden fingers with verified natural curcumin concentration.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    sortOrder: 5
  },
  {
    name: 'Malabar Bold Black Pepper (550+ GL)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Sun-dried garbled black pepper berries with high piperine yield.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    sortOrder: 6
  },
  {
    name: 'Hand-Hammered Solid Copper Pitcher & Drinkware',
    category: 'Luxury Metalware & Art',
    description: '99.5%+ pure certified food-grade copper with artisan hammered finish.',
    defaultUnit: 'Master Cartons / Sets',
    isActive: true,
    sortOrder: 7
  },
  {
    name: 'Pure Mulberry Silk Scarves & Pashmina Stoles',
    category: 'Textiles & Handloom',
    description: 'Loom-woven natural silk with hand-rolled hems and custom dye lots.',
    defaultUnit: 'Pieces / Master Cartons',
    isActive: true,
    sortOrder: 8
  },
  {
    name: 'Custom Agricultural Sourcing / Bespoke Mandate',
    category: 'Custom B2B Sourcing',
    description: 'Direct procurement specification across verified Indian grower networks.',
    defaultUnit: 'As per Contract Specification',
    isActive: true,
    sortOrder: 9
  }
];

// Helper: auto-seed if collection empty
const ensureInitialProductLines = async () => {
  try {
    const count = await ProductLine.countDocuments();
    if (count === 0) {
      await ProductLine.insertMany(INITIAL_PRODUCT_LINES);
      console.log('[ProductLine] Initial product lines seeded into database.');
    }
  } catch (err) {
    console.warn('[ProductLine] Error checking initial product lines:', err.message);
  }
};

// @desc    Get all active product lines / requirements (Public for Quotation Modal)
// @route   GET /api/product-lines
// @access  Public
const getProductLines = async (req, res) => {
  try {
    await ensureInitialProductLines();
    const productLines = await ProductLine.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: productLines.length,
      productLines
    });
  } catch (error) {
    console.error('Error fetching product lines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product lines',
      error: error.message
    });
  }
};

// @desc    Get all product lines including inactive (Admin)
// @route   GET /api/product-lines/admin/all
// @access  Private (Admin only)
const getAllProductLinesAdmin = async (req, res) => {
  try {
    await ensureInitialProductLines();
    const productLines = await ProductLine.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: productLines.length,
      productLines
    });
  } catch (error) {
    console.error('Error fetching admin product lines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin product lines',
      error: error.message
    });
  }
};

// @desc    Add new product line / requirement option
// @route   POST /api/product-lines
// @access  Private (Admin only)
const createProductLine = async (req, res) => {
  try {
    const { name, category, description, defaultUnit, isActive, sortOrder } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product line name is required'
      });
    }

    const trimmedName = name.trim();
    const existing = await ProductLine.findOne({ name: new RegExp(`^${trimmedName}$`, 'i') });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A product line with the name "${trimmedName}" already exists.`
      });
    }

    const productLine = await ProductLine.create({
      name: trimmedName,
      category: category ? category.trim() : 'General Commodities',
      description: description ? description.trim() : '',
      defaultUnit: defaultUnit ? defaultUnit.trim() : 'Metric Tons (MT)',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      sortOrder: sortOrder ? Number(sortOrder) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Product line created successfully',
      productLine
    });
  } catch (error) {
    console.error('Error creating product line:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product line',
      error: error.message
    });
  }
};

// @desc    Update existing product line / requirement option
// @route   PUT /api/product-lines/:id
// @access  Private (Admin only)
const updateProductLine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, defaultUnit, isActive, sortOrder } = req.body;

    const productLine = await ProductLine.findById(id);
    if (!productLine) {
      return res.status(404).json({
        success: false,
        message: 'Product line not found'
      });
    }

    if (name) {
      const trimmedName = name.trim();
      // Check if duplicate name exists on a different ID
      const duplicate = await ProductLine.findOne({
        name: new RegExp(`^${trimmedName}$`, 'i'),
        _id: { $ne: id }
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Another product line already exists with the name "${trimmedName}".`
        });
      }
      productLine.name = trimmedName;
    }

    if (category !== undefined) productLine.category = category.trim();
    if (description !== undefined) productLine.description = description.trim();
    if (defaultUnit !== undefined) productLine.defaultUnit = defaultUnit.trim();
    if (isActive !== undefined) productLine.isActive = Boolean(isActive);
    if (sortOrder !== undefined) productLine.sortOrder = Number(sortOrder);

    const updated = await productLine.save();

    res.status(200).json({
      success: true,
      message: 'Product line updated successfully',
      productLine: updated
    });
  } catch (error) {
    console.error('Error updating product line:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product line',
      error: error.message
    });
  }
};

// @desc    Delete a product line / requirement option
// @route   DELETE /api/product-lines/:id
// @access  Private (Admin only)
const deleteProductLine = async (req, res) => {
  try {
    const { id } = req.params;

    const productLine = await ProductLine.findById(id);
    if (!productLine) {
      return res.status(404).json({
        success: false,
        message: 'Product line not found'
      });
    }

    await ProductLine.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Product line "${productLine.name}" deleted successfully`,
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting product line:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product line',
      error: error.message
    });
  }
};

module.exports = {
  getProductLines,
  getAllProductLinesAdmin,
  createProductLine,
  updateProductLine,
  deleteProductLine
};
