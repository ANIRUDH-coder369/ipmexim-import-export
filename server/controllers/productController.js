const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const { uploadToCloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Initial seed catalog for first-time database initialization
const INITIAL_SEED_PRODUCTS = [
  {
    name: 'Alleppey Green Cardamom (Bold 8mm+)',
    slug: 'alleppey-green-cardamom-bold',
    categoryId: 'spices-food',
    categoryName: 'Spices & Food Products',
    shortDescription: 'Extra-bold 8mm+ sun-dried Indian green cardamom pods with high volatile oil content and intense fragrance.',
    fullDescription: 'Sourced directly from the misty western ghats of Kerala and Tamil Nadu, machine-graded for uniform 8mm+ pod diameter. Renowned worldwide for deep emerald hue, robust aroma, and rich essential oil concentration (minimum 7.5% v/w).',
    specifications: {
      'Grade': 'Extra Bold Grade A (8mm - 8.5mm)',
      'Volatile Oil Content': '≥ 7.5% v/w',
      'Moisture Content': 'Max 10.5%',
      'Origin': 'Kerala & Tamil Nadu, India'
    },
    minimumOrderQuantity: '250 kg (Air Freight) / 1,000 kg (Sea LCL)',
    origin: 'Kerala & Tamil Nadu, India',
    hsCode: '0908.31.00',
    imageUrls: ['/images/product_spices_export_1793609366204.jpg'],
    status: 'Available',
    featured: true,
    sortOrder: 1
  },
  {
    name: 'Traditional 1121 Extra Long Steam Basmati Rice',
    slug: '1121-steam-basmati-rice',
    categoryId: 'grains-pulses',
    categoryName: 'Grains & Agricultural Staples',
    shortDescription: 'Naturally aged, extra-long grain steam Basmati rice with an average grain length of 8.35mm before cooking.',
    fullDescription: 'Cultivated in the fertile foothills of the Himalayas, specialized steaming locks in aromatic nutrients and strengthens grain durability during cooking. Cooks to more than double length without clumping.',
    specifications: {
      'Average Grain Length': '8.35 mm (raw) / 18.5 mm+ (cooked)',
      'Broken Grains': 'Under 1.0%',
      'Purity / Variety': '95% Pure 1121 Basmati',
      'Moisture Content': 'Max 12.5%'
    },
    minimumOrderQuantity: '1 x 20ft FCL (Approx. 24–25 MT)',
    origin: 'Punjab & Haryana, India',
    hsCode: '1006.30.20',
    imageUrls: ['/images/product_spices_export_1793609366204.jpg'],
    status: 'Available',
    featured: true,
    sortOrder: 2
  },
  {
    name: 'Pure Mulberry Silk & Organic Combed Cotton Textiles',
    slug: 'pure-mulberry-silk-organic-cotton-fabrics',
    categoryId: 'textiles-garments',
    categoryName: 'Textiles & Fine Fabrics',
    shortDescription: 'High-density woven mulberry silk and certified organic combed cotton rolls for luxury apparel and hospitality furnishings.',
    fullDescription: 'Woven on state-of-the-art precision looms by skilled Indian artisans. Includes pure 19-to-22 momme Mulberry Silk and 300–600 thread count organic combed long-staple cotton.',
    specifications: {
      'Composition': '100% Grade 6A Mulberry Silk / GOTS Organic Cotton',
      'Width': '44 inches / 54 inches / 110 inches',
      'Dyeing Standard': 'Azo-free, skin-neutral reactive dyes'
    },
    minimumOrderQuantity: '300 meters per construction',
    origin: 'Varanasi & Tamil Nadu, India',
    hsCode: '5007.20.00 / 5208.11.00',
    imageUrls: ['/images/product_textiles_luxury_1793609366515.jpg'],
    status: 'Available',
    featured: true,
    sortOrder: 3
  },
  {
    name: 'Hand-Hammered Pure Copper Vessels & Artisanal Decor',
    slug: 'hand-hammered-pure-copper-vessels',
    categoryId: 'metal-copper',
    categoryName: 'Metal & Artisanal Copperware',
    shortDescription: 'Handcrafted solid 99.5% pure copper carafes, hammered bowls, and luxury tabletop drinkware with food-grade tin lining options.',
    fullDescription: 'Individually hammered from high-purity electrolytic copper sheet. Designed for hospitality venues, luxury decor boutiques, and wellness brands.',
    specifications: {
      'Purity': '99.5%+ Pure Electrolytic Copper (Cu)',
      'Finishing': 'Hand-dimpled hammered texture with protective anti-tarnish coat',
      'Thickness': '1.0 mm to 1.5 mm solid gauge'
    },
    minimumOrderQuantity: '100 pieces per design variant',
    origin: 'Moradabad & Rajasthan, India',
    hsCode: '7418.10.21',
    imageUrls: ['/images/product_handicrafts_brass_1793609366491.jpg'],
    status: 'Available',
    featured: true,
    sortOrder: 4
  }
];

// Helper to auto-seed if collection is empty
const ensureProductsSeeded = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(INITIAL_SEED_PRODUCTS);
      console.log('[AutoSeed] Seeded initial export products catalogue.');
    }
  } catch (err) {
    console.warn('[AutoSeed Warning]', err.message);
  }
};

// @desc    Get all active products (filterable by featured, category, search)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    await ensureProductsSeeded();

    const { featured, category, search, limit } = req.query;
    const filter = { isActive: true };

    if (featured !== undefined) {
      filter.featured = featured === 'true' || featured === true || featured === '1';
    }

    if (category && category !== 'all') {
      filter.$or = [
        { categoryId: category },
        { categoryName: new RegExp(category, 'i') }
      ];
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { shortDescription: new RegExp(search, 'i') },
        { origin: new RegExp(search, 'i') },
        { hsCode: new RegExp(search, 'i') }
      ];
    }

    const query = Product.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    if (limit) {
      query.limit(parseInt(limit, 10));
    }

    const products = await query;
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('[Product Controller Get Error]', error);
    res.status(500).json({ success: false, message: 'Server error retrieving products', error: error.message });
  }
};

// @desc    Get featured export products for homepage showcase
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    await ensureProductsSeeded();
    const products = await Product.find({ featured: true, isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('[Featured Products Error]', error);
    res.status(500).json({ success: false, message: 'Server error retrieving featured products' });
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:idOrSlug
// @access  Public
const getProductBySlugOrId = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product = await Product.findOne({ slug: idOrSlug.toLowerCase() });
    if (!product && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving product', error: error.message });
  }
};

// Helper to generate a clean URL slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc    Create new product (with optional image file upload)
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const body = req.body;
    const name = (body.name || '').trim();
    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required.' });
    }

    let slug = (body.slug || '').trim().toLowerCase();
    if (!slug) {
      slug = generateSlug(name);
    }

    // Ensure slug uniqueness
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Handle uploaded file or image URL
    let imageUrls = [];
    if (req.file) {
      if (isCloudinaryConfigured()) {
        try {
          const uploadResult = await uploadToCloudinary(req.file.path, {
            folder: 'ipmexim/products'
          });
          imageUrls.push(uploadResult.secure_url);
        } catch (uploadErr) {
          console.warn('[Cloudinary Product Upload Warning]', uploadErr.message);
          const relativePath = `/uploads/products/${req.file.filename}`;
          imageUrls.push(relativePath);
        }
      } else {
        const relativePath = `/uploads/products/${req.file.filename}`;
        imageUrls.push(relativePath);
      }
    } else if (body.imageUrl) {
      imageUrls.push(body.imageUrl.trim());
    } else if (body.imageUrls) {
      try {
        const parsed = Array.isArray(body.imageUrls) ? body.imageUrls : JSON.parse(body.imageUrls);
        imageUrls = parsed;
      } catch (e) {
        imageUrls.push(String(body.imageUrls));
      }
    }

    if (imageUrls.length === 0) {
      imageUrls.push('/images/product_spices_export_1793609366204.jpg');
    }

    // Parse specifications if sent as JSON string from multipart/form-data
    let specifications = {};
    if (body.specifications) {
      try {
        specifications = typeof body.specifications === 'string'
          ? JSON.parse(body.specifications)
          : body.specifications;
      } catch (e) {
        specifications = { 'Details': String(body.specifications) };
      }
    }

    const product = await Product.create({
      name,
      slug,
      categoryId: body.categoryId || 'spices-food',
      categoryName: body.categoryName || 'Spices & Food Products',
      shortDescription: body.shortDescription || `${name} - Premium Indian export commodity.`,
      fullDescription: body.fullDescription || '',
      specifications,
      origin: body.origin || 'India',
      hsCode: body.hsCode || '0908.31.00',
      minimumOrderQuantity: body.minimumOrderQuantity || '1 x 20ft FCL',
      status: body.status || 'Available',
      featured: body.featured === true || body.featured === 'true' || body.featured === '1',
      imageUrls,
      sortOrder: parseInt(body.sortOrder || '0', 10),
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('[Create Product Error]', error);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

// @desc    Update existing product
// @route   PUT /api/products/:id or PATCH /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const body = req.body;
    if (body.name) product.name = body.name.trim();
    if (body.slug) product.slug = body.slug.trim().toLowerCase();
    if (body.categoryId) product.categoryId = body.categoryId.trim();
    if (body.categoryName) product.categoryName = body.categoryName.trim();
    if (body.shortDescription) product.shortDescription = body.shortDescription.trim();
    if (body.fullDescription !== undefined) product.fullDescription = body.fullDescription.trim();
    if (body.origin) product.origin = body.origin.trim();
    if (body.hsCode) product.hsCode = body.hsCode.trim();
    if (body.minimumOrderQuantity) product.minimumOrderQuantity = body.minimumOrderQuantity.trim();
    if (body.status) product.status = body.status;
    if (body.sortOrder !== undefined) product.sortOrder = parseInt(body.sortOrder, 10);
    if (body.featured !== undefined) {
      product.featured = body.featured === true || body.featured === 'true' || body.featured === '1';
    }
    if (body.isActive !== undefined) {
      product.isActive = body.isActive === true || body.isActive === 'true';
    }

    // Update image if new file uploaded
    if (req.file) {
      let newImagePath;
      if (isCloudinaryConfigured()) {
        try {
          const uploadResult = await uploadToCloudinary(req.file.path, {
            folder: 'ipmexim/products'
          });
          newImagePath = uploadResult.secure_url;
        } catch (uploadErr) {
          console.warn('[Cloudinary Product Update Warning]', uploadErr.message);
          newImagePath = `/uploads/products/${req.file.filename}`;
        }
      } else {
        newImagePath = `/uploads/products/${req.file.filename}`;
      }
      product.imageUrls = [newImagePath, ...(product.imageUrls || []).slice(0, 3)];
    } else if (body.imageUrl) {
      product.imageUrls = [body.imageUrl.trim(), ...(product.imageUrls || []).slice(0, 3)];
    }

    if (body.specifications) {
      try {
        product.specifications = typeof body.specifications === 'string'
          ? JSON.parse(body.specifications)
          : body.specifications;
      } catch (e) {
        product.specifications = { 'Details': String(body.specifications) };
      }
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('[Update Product Error]', error);
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// @desc    Toggle product featured status
// @route   PATCH /api/products/:id/toggle-featured
// @access  Private (Admin)
const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    product.featured = !product.featured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product featured status set to ${product.featured}`,
      featured: product.featured,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle featured status', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Try to cleanup uploaded image file if hosted locally in uploads/products
    if (product.imageUrls && product.imageUrls.length > 0) {
      for (const img of product.imageUrls) {
        if (img.startsWith('/uploads/products/')) {
          const filePath = path.resolve(__dirname, '..', img.slice(1));
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (unlinkErr) {}
          }
        }
      }
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
      deletedId: id
    });
  } catch (error) {
    console.error('[Delete Product Error]', error);
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  toggleFeatured,
  deleteProduct
};
