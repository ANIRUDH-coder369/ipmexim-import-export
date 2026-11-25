const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: [true, 'Category slug/id is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    icon: {
      type: String,
      trim: true,
      default: ''
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

// Index for sortOrder and active status
categorySchema.index({ isActive: 1, sortOrder: 1, name: 1 });

module.exports = mongoose.model('Category', categorySchema);
