const mongoose = require('mongoose');

const productLineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product line / requirement name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'General Agricultural Commodities'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    defaultUnit: {
      type: String,
      trim: true,
      default: 'Metric Tons (MT)'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast active listing
productLineSchema.index({ isActive: 1, sortOrder: 1, name: 1 });

module.exports = mongoose.model('ProductLine', productLineSchema);
