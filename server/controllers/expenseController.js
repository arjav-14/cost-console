const Expense = require('../models/Expense');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const {
    date,
    projectName,
    employeeName,
    modeOfPayment,
    expenseHead,
    description1,
    description2,
    amount,
    billType,
  } = req.body;

  // Get user from the request (added by the auth middleware)
  const userId = req.user.id;

  // Handle file upload if present
  let billPhotoPath = '';
  if (req.file) {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate unique filename
    const fileExt = path.extname(req.file.originalname);
    const filename = `bill_${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, filename);
    
    // Save file
    await fs.promises.writeFile(filePath, req.file.buffer);
    billPhotoPath = `/uploads/${filename}`;
  }

  // Create expense
  const expense = await Expense.create({
    date,
    projectName,
    employeeName,
    modeOfPayment,
    expenseHead,
    description1,
    description2,
    amount: parseFloat(amount),
    billType,
    billPhoto: billPhotoPath,
    submittedBy: userId,
  });

  // Populate user details
  await expense.populate('submittedBy', 'name email');

  res.status(201).json({
    success: true,
    data: expense,
  });
});

// @desc    Get all expenses (for admin)
// @route   GET /api/expenses
// @access  Private/Admin
const getExpenses = asyncHandler(async (req, res) => {
  const { status, startDate, endDate } = req.query;
  
  // Build query
  const query = {};
  
  // Filter by status if provided
  if (status) {
    query.status = status;
  }
  
  // Filter by date range if provided
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  
  // For non-admin users, only show their own expenses
  if (req.user.role !== 'admin') {
    query.submittedBy = req.user.id;
  }
  
  const expenses = await Expense.find(query)
    .populate('submittedBy', 'name email')
    .sort({ date: -1, createdAt: -1 });
    
  res.status(200).json({
    success: true,
    count: expenses.length,
    data: expenses,
  });
});

// @desc    Update expense status (for admin)
// @route   PUT /api/expenses/:id/status
// @access  Private/Admin
const updateExpenseStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }
  
  const expense = await Expense.findById(req.params.id);
  
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  
  // Update status
  expense.status = status;
  await expense.save();
  
  res.status(200).json({
    success: true,
    data: expense,
  });
});

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id)
    .populate('submittedBy', 'name email');
    
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  
  // Check if user is authorized to view this expense
  if (req.user.role !== 'admin' && expense.submittedBy._id.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to view this expense');
  }
  
  res.status(200).json({
    success: true,
    data: expense,
  });
});

module.exports = {
  createExpense,
  getExpenses,
  updateExpenseStatus,
  getExpenseById,
};
