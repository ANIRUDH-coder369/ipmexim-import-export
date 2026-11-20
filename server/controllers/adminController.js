const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Helper to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretjwtkey_import_export_2026_change_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

// @desc    Admin login
// @route   POST /admin/login
// @access  Public (Rate limited)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find admin and include password field for verification
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(admin._id, admin.role);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Error in loginAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Get current admin profile
// @route   GET /admin/me
// @access  Private (Protected by JWT)
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getAdminProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
};

// @desc    Seed admin user (idempotent helper)
// @route   POST /admin/seed
// @access  Public (for initial setup)
const seedAdminController = async (req, res) => {
  try {
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@importexport.com';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const defaultName = process.env.ADMIN_NAME || 'Super Admin';

    const existingAdmin = await Admin.findOne({ email: defaultEmail.toLowerCase().trim() });
    if (existingAdmin) {
      return res.status(200).json({
        success: true,
        message: `Admin already exists with email: ${defaultEmail}`,
        email: defaultEmail
      });
    }

    const newAdmin = await Admin.create({
      name: defaultName,
      email: defaultEmail,
      password: defaultPassword,
      role: 'superadmin'
    });

    res.status(201).json({
      success: true,
      message: 'Default admin seeded successfully',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('Error in seedAdminController:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during seeding',
      error: error.message
    });
  }
};

const {
  checkAdminAuth,
  getAllQuotations,
  getQuotationById,
  updateQuotationStatus,
  deleteQuotation,
  sendCustomerEmail
} = require('./quotationController');

module.exports = {
  loginAdmin,
  getAdminProfile,
  seedAdminController,
  checkAdminAuth,
  getAllQuotations,
  getQuotationById,
  updateQuotationStatus,
  deleteQuotation,
  sendCustomerEmail
};
