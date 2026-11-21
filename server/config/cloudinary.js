const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dagarr6bk',
  api_key: process.env.CLOUDINARY_API_KEY || '375596397315967',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4cw4-yhMsiXk4iYGYIfWXlrcb_E',
  secure: true
});

/**
 * Check if Cloudinary is configured
 */
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Upload a local file to Cloudinary and safely clean up the temporary file
 * @param {string} filePath - Absolute path of the temporary file
 * @param {object} options - Cloudinary upload options (e.g. folder, resource_type)
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const uploadOptions = {
      folder: options.folder || 'ipmexim/uploads',
      resource_type: options.resource_type || 'auto',
      use_filename: true,
      unique_filename: true,
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Clean up temporary local/tmp file after upload
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        // Silently ignore unlink error in serverless
      }
    }

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('[Cloudinary Upload Error]', error.message);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary by its public_id
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resourceType - 'image', 'raw', or 'video'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.warn('[Cloudinary Delete Warning]', error.message);
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary
};
