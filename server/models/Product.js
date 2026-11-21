const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [160, 'Product name cannot exceed 160 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    categoryId: {
      type: String,
      required: true,
      default: 'spices-food'
    },
    categoryName: {
      type: String,
      required: true,
      default: 'Spices & Food Products'
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true
    },
    fullDescription: {
      type: String,
      trim: true,
      default: ''
    },
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    packagingOptions: {
      type: [String],
      default: []
    },
    minimumOrderQuantity: {
      type: String,
      default: '1 x 20ft FCL / As per contract'
    },
    origin: {
      type: String,
      default: 'India'
    },
    hsCode: {
      type: String,
      default: '0908.31.00'
    },
    imageUrls: {
      type: [String],
      default: ['/images/product_spices_export_1793609366204.jpg']
    },
    status: {
      type: String,
      enum: ['Available', 'In Season', 'Custom Order', 'Out of Stock'],
      default: 'Available'
    },
    featured: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ featured: 1, isActive: 1, sortOrder: 1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);
