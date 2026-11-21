const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Shipment/Consignment title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    fromLocation: {
      type: String,
      required: [true, 'Origin location (From Where) is required'],
      trim: true,
      maxlength: [120, 'Origin location cannot exceed 120 characters']
    },
    toLocation: {
      type: String,
      required: [true, 'Destination location (Reach Destination) is required'],
      trim: true,
      maxlength: [120, 'Destination location cannot exceed 120 characters']
    },
    date: {
      type: Date,
      required: [true, 'Shipment / Dispatch date is required']
    },
    mediaLink: {
      type: String,
      required: [true, 'Video or media link is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['In Transit', 'Scheduled', 'Dispatched', 'Delivered'],
      default: 'In Transit'
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

// Compound index for chronological querying (upside / newest date first)
shipmentSchema.index({ date: -1, isActive: 1 });

module.exports = mongoose.model('Shipment', shipmentSchema);
