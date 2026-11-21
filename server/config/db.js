const mongoose = require('mongoose');

// Global cache for serverless environments (Vercel, AWS Lambda)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If already connected, return cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/import-export';

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
      socketTimeoutMS: 20000,
    };

    cached.promise = mongoose
      .connect(mongoURI, opts)
      .then((m) => {
        console.log(`[MongoDB] Connected: ${m.connection.host}/${m.connection.name}`);
        return m;
      })
      .catch((error) => {
        cached.promise = null;
        console.error(`[MongoDB] Connection Error: ${error.message}`);
        // Never call process.exit(1) in a serverless function!
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
};

module.exports = connectDB;
