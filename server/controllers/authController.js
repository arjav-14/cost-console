const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // Create user
    user = await User.create({
      name,
      email,
      password
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  try {
    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to send token in response
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  
  // Create user data without sensitive information
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    role: user.role
  };
  
  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};
