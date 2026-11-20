require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/import-export';
  const email = (process.env.ADMIN_EMAIL || 'admin@importexport.com').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const name = process.env.ADMIN_NAME || 'Super Admin';

  try {
    console.log(`[Seed] Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('[Seed] MongoDB connected.');

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log(`[Seed] Admin user with email "${email}" already exists. No action required.`);
    } else {
      console.log(`[Seed] Creating default admin user (${email})...`);
      const admin = await Admin.create({
        name,
        email,
        password,
        role: 'superadmin'
      });
      console.log(`[Seed] Default admin created successfully with ID: ${admin._id}`);
      console.log(`[Seed] Email: ${email}`);
      console.log(`[Seed] Password: ${password}`);
    }
  } catch (error) {
    console.error('[Seed] Error seeding admin:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] MongoDB connection closed.');
    process.exit(0);
  }
};

seedAdmin();
