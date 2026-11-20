const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    // Required: YOUR FULL NAME *
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    // Required: CORPORATE EMAIL *
    corporateEmail: {
      type: String,
      required: [true, 'Corporate email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid corporate email address'
      ]
    },
    // Optional: COMPANY / ENTITY
    company: {
      type: String,
      trim: true,
      default: ''
    },
    // Required: DESTINATION COUNTRY *
    destinationCountry: {
      type: String,
      required: [true, 'Destination country is required'],
      trim: true
    },
    // Optional: PHONE / WHATSAPP
    phoneWhatsApp: {
      type: String,
      trim: true,
      default: ''
    },
    // Optional: PRODUCT OF INTEREST
    productOfInterest: {
      type: String,
      trim: true,
      default: 'General / Custom Sourcing Requirement'
    },
    // Required: ESTIMATED VOLUME / QUANTITY *
    estimatedQuantity: {
      type: String,
      required: [true, 'Estimated volume / quantity is required'],
      trim: true
    },
    // Optional: UNIT
    unit: {
      type: String,
      trim: true,
      default: ''
    },
    // Optional: PREFERRED INCOTERM
    preferredIncoterm: {
      type: String,
      trim: true,
      default: ''
    },
    // Required: DESTINATION PORT / COUNTRY *
    destinationPort: {
      type: String,
      required: [true, 'Destination port / country is required'],
      trim: true
    },
    // Required: TECHNICAL SPECIFICATIONS, INCOTERMS & NOTES *
    technicalSpecifications: {
      type: String,
      required: [true, 'Technical specifications, incoterms & notes are required'],
      trim: true
    },
    // Optional: ATTACH SPECIFICATION OR DRAWING
    attachment: {
      filename: { type: String },
      originalName: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      path: { type: String }
    },
    // Required Checkbox: I consent to IPM Exim using these details...
    consent: {
      type: Boolean,
      required: [true, 'Consent is required to submit this commercial enquiry'],
      validate: {
        validator: function (v) {
          return v === true;
        },
        message: 'You must consent to proceed with this commercial enquiry'
      }
    },
    // Internal Workflow & Status Tracking
    status: {
      type: String,
      enum: ['new', 'in_review', 'contacted', 'quoted', 'closed', 'archived'],
      default: 'new'
    },
    adminNotes: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    },
    // Audit log of emails sent to this customer
    emailHistory: [
      {
        sentAt: { type: Date, default: Date.now },
        sentBy: { type: String, default: 'Admin' },
        toEmail: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, default: 'sent' }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Index for search queries
enquirySchema.index({ corporateEmail: 1, fullName: 1, destinationCountry: 1, createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
