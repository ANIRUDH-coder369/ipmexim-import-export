const path = require('path');
const fs = require('fs');
const Quotation = require('../models/Quotation');

// Helper to ensure admin is authenticated
const verifyAdminAccess = (req, res) => {
  if (!req.admin) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Admin login required.'
    });
    return false;
  }
  return true;
};

// @desc    Check admin login / authentication status
// @route   GET /admin/check-auth or /api/admin/check-auth
// @access  Private (Admin login required)
const checkAdminAuth = async (req, res) => {
  if (!verifyAdminAccess(req, res)) return;

  res.status(200).json({
    success: true,
    authenticated: true,
    message: 'Admin is logged in and authorized',
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      lastLogin: req.admin.lastLogin
    }
  });
};

// @desc    Show all quotation entries for admin with metrics & filters
// @route   GET /admin/quotations or /api/admin/quotations
// @access  Private (Admin login required)
const getAllQuotations = async (req, res) => {
  if (!verifyAdminAccess(req, res)) return;

  try {
    const { status, search, country, product, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const query = {};

    // Filter by quotation status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by destination country
    if (country) {
      query.destinationCountry = { $regex: country, $options: 'i' };
    }

    // Filter by product of interest
    if (product) {
      query.productOfInterest = { $regex: product, $options: 'i' };
    }

    // Search query across name, email, company, country, product, and notes
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { corporateEmail: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { destinationCountry: { $regex: search, $options: 'i' } },
        { destinationPort: { $regex: search, $options: 'i' } },
        { productOfInterest: { $regex: search, $options: 'i' } },
        { technicalSpecifications: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    // Run parallel queries: quotation entries list, total count, and status breakdown stats
    const [quotations, totalFiltered, stats] = await Promise.all([
      Quotation.find(query).sort(sort).skip(skip).limit(limitNum),
      Quotation.countDocuments(query),
      Quotation.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Format metrics dictionary
    const metrics = {
      total: 0,
      new: 0,
      in_review: 0,
      contacted: 0,
      quoted: 0,
      closed: 0,
      archived: 0
    };

    stats.forEach((item) => {
      if (item._id && metrics.hasOwnProperty(item._id)) {
        metrics[item._id] = item.count;
      }
      metrics.total += item.count;
    });

    res.status(200).json({
      success: true,
      message: 'Quotations retrieved successfully',
      adminUser: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name
      },
      metrics,
      pagination: {
        total: totalFiltered,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalFiltered / limitNum),
        hasMore: pageNum * limitNum < totalFiltered
      },
      count: quotations.length,
      quotations
    });
  } catch (error) {
    console.error('Error in getAllQuotations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quotation entries',
      error: error.message
    });
  }
};

// @desc    Show single quotation entry by ID
// @route   GET /admin/quotations/:id
// @access  Private (Admin login required)
const getQuotationById = async (req, res) => {
  if (!verifyAdminAccess(req, res)) return;

  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation entry not found'
      });
    }

    res.status(200).json({
      success: true,
      quotation
    });
  } catch (error) {
    console.error('Error in getQuotationById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quotation entry',
      error: error.message
    });
  }
};

// @desc    Update quotation entry status and notes
// @route   PATCH /admin/quotations/:id/status
// @access  Private (Admin login required)
const updateQuotationStatus = async (req, res) => {
  if (!verifyAdminAccess(req, res)) return;

  try {
    const { status, adminNotes } = req.body;
    const allowedStatuses = ['new', 'in_review', 'contacted', 'quoted', 'closed', 'archived'];

    const updateFields = {};
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status value. Allowed: ${allowedStatuses.join(', ')}`
        });
      }
      updateFields.status = status;
    }

    if (adminNotes !== undefined) {
      updateFields.adminNotes = adminNotes;
    }

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quotation status updated successfully',
      quotation
    });
  } catch (error) {
    console.error('Error in updateQuotationStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating quotation',
      error: error.message
    });
  }
};

// @desc    Delete quotation entry and file
// @route   DELETE /admin/quotations/:id
// @access  Private (Admin login required)
const deleteQuotation = async (req, res) => {
  if (!verifyAdminAccess(req, res)) return;

  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation entry not found'
      });
    }

    // Remove file if attached
    if (quotation.attachment && quotation.attachment.path && fs.existsSync(quotation.attachment.path)) {
      try {
        fs.unlinkSync(quotation.attachment.path);
      } catch (fErr) {
        console.warn('Failed to delete quotation file:', fErr.message);
      }
    }

    await Quotation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quotation entry deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteQuotation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting quotation',
      error: error.message
    });
  }
};

const { sendCustomerEmail } = require('./adminEmailController');

module.exports = {
  checkAdminAuth,
  getAllQuotations,
  getQuotationById,
  updateQuotationStatus,
  deleteQuotation,
  sendCustomerEmail
};
