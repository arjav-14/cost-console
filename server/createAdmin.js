const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file in the server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Log environment variables for debugging
console.log('MongoDB URI:', process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    // Use environment variable or fallback to default
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sidd';
    
    console.log('Connecting to MongoDB at:', mongoUri);
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123', // In production, use a more secure password
      role: 'admin',
      isAdmin: true
    });

    console.log('Admin user created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log('Password: admin123');
    console.log('\nIMPORTANT: Change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
