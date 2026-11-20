const path = require('path');
const fs = require('fs');
const Enquiry = require('../models/Enquiry');
const {
  sendNewQuotationNotification,
  sendCustomerQuotationConfirmation
} = require('../services/emailService');

// @desc    Submit new Sourcing Enquiry (from public form)
// @route   POST /api/enquiries
// @access  Public (Rate limited)
const createEnquiry = async (req, res) => {
  try {
    // Gracefully normalize field variations across all client forms
    const fullName = (req.body.fullName || req.body.name || '').trim();
    const corporateEmail = (req.body.corporateEmail || req.body.businessEmail || req.body.email || '').toLowerCase().trim();
    const company = (req.body.company || req.body.companyName || '').trim();
    const destinationCountry = (req.body.destinationCountry || req.body.country || '').trim();
    const phoneWhatsApp = (req.body.phoneWhatsApp || req.body.phone || '').trim();
    const productOfInterest = (req.body.productOfInterest || req.body.productName || req.body.productLine || 'General Export Sourcing').trim();
    const estimatedQuantity = String(req.body.estimatedQuantity || req.body.quantity || 'Standard Commercial Order').trim();
    const unit = (req.body.unit || '').trim();
    const preferredIncoterm = (req.body.preferredIncoterm || req.body.incoterm || 'FOB / CIF').trim();
    const destinationPort = (req.body.destinationPort || req.body.port || destinationCountry || 'Main Port').trim();
    const technicalSpecifications = (req.body.technicalSpecifications || req.body.message || req.body.specifications || 'Commercial Export Quotation Request').trim();
    const consent = req.body.consent !== undefined ? req.body.consent : true;

    // Consent validation (can be string 'true' or boolean true from multipart form)
    const isConsentGiven = consent === true || consent === 'true' || consent === '1' || consent === 'on';
    if (!isConsentGiven) {
      // Remove uploaded file if validation fails
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        success: false,
        message: 'You must consent to IPM Exim using these details to submit this enquiry.'
      });
    }

    // Basic required field validation
    if (
      !fullName ||
      !corporateEmail ||
      !destinationCountry ||
      !estimatedQuantity ||
      !destinationPort ||
      !technicalSpecifications
    ) {
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields marked with an asterisk (*).'
      });
    }

    // Prepare attachment metadata if file was uploaded
    let attachmentData = undefined;
    if (req.file) {
      attachmentData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      };
    }

    const enquiry = await Enquiry.create({
      fullName,
      corporateEmail,
      company,
      destinationCountry,
      phoneWhatsApp,
      productOfInterest,
      estimatedQuantity,
      unit,
      preferredIncoterm,
      destinationPort,
      technicalSpecifications,
      attachment: attachmentData,
      consent: true,
      ipAddress: req.ip || req.connection?.remoteAddress || ''
    });

    // 1. Send quotation notification email with all info to ipmexim@gmail.com
    sendNewQuotationNotification(enquiry, req.file?.path).catch((mailErr) => {
      console.error('[Admin Notification Email Error] Failed to send email to ipmexim@gmail.com:', mailErr.message);
    });

    // 2. Send auto confirmation email directly to the customer with all filled information
    sendCustomerQuotationConfirmation(enquiry, req.file?.path).catch((mailErr) => {
      console.error('[Customer Confirmation Email Error] Failed to send email to customer:', mailErr.message);
    });

    res.status(201).json({
      success: true,
      message: 'Your sourcing enquiry has been submitted successfully. Our trade desk will respond within 24 business hours.',
      enquiryId: enquiry._id,
      data: {
        id: enquiry._id,
        fullName: enquiry.fullName,
        corporateEmail: enquiry.corporateEmail,
        productOfInterest: enquiry.productOfInterest,
        destinationCountry: enquiry.destinationCountry,
        createdAt: enquiry.createdAt
      }
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    console.error('Error in createEnquiry:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your sourcing enquiry. Please try again.',
      error: error.message
    });
  }
};

// @desc    Get all enquiries with filters, pagination, and search (Admin dashboard)
// @route   GET /api/enquiries
// @access  Private (Admin only)
const getAllEnquiries = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search keyword
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { corporateEmail: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { destinationCountry: { $regex: search, $options: 'i' } },
        { productOfInterest: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).sort(sort).skip(skip).limit(limitNum),
      Enquiry.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      enquiries
    });
  } catch (error) {
    console.error('Error in getAllEnquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving enquiries',
      error: error.message
    });
  }
};

// @desc    Get single enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private (Admin only)
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      enquiry
    });
  } catch (error) {
    console.error('Error in getEnquiryById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enquiry details',
      error: error.message
    });
  }
};

// @desc    Download/view enquiry specification attachment
// @route   GET /api/enquiries/:id/attachment
// @access  Private (Admin only)
const downloadAttachment = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry || !enquiry.attachment || !enquiry.attachment.path) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found for this enquiry'
      });
    }

    const filePath = path.resolve(enquiry.attachment.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server storage'
      });
    }

    res.download(filePath, enquiry.attachment.originalName);
  } catch (error) {
    console.error('Error in downloadAttachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading attachment',
      error: error.message
    });
  }
};

// @desc    Update enquiry status and internal notes
// @route   PATCH /api/enquiries/:id/status
// @access  Private (Admin only)
const updateEnquiryStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const allowedStatuses = ['new', 'in_review', 'contacted', 'quoted', 'closed', 'archived'];

    const updateFields = {};
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
        });
      }
      updateFields.status = status;
    }

    if (adminNotes !== undefined) {
      updateFields.adminNotes = adminNotes;
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry status updated successfully',
      enquiry
    });
  } catch (error) {
    console.error('Error in updateEnquiryStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating enquiry status',
      error: error.message
    });
  }
};

// @desc    Delete an enquiry (and delete attached file)
// @route   DELETE /api/enquiries/:id
// @access  Private (Admin only)
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Clean up file if present
    if (enquiry.attachment && enquiry.attachment.path && fs.existsSync(enquiry.attachment.path)) {
      try {
        fs.unlinkSync(enquiry.attachment.path);
      } catch (fileErr) {
        console.warn('Could not remove file on deletion:', fileErr.message);
      }
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Enquiry and associated files deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteEnquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting enquiry',
      error: error.message
    });
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  downloadAttachment,
  updateEnquiryStatus,
  deleteEnquiry
};
