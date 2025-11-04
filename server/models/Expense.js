const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
  },
  employeeName: {
    type: String,
    required: [true, 'Employee name is required'],
  },
  modeOfPayment: {
    type: String,
    required: [true, 'Mode of payment is required'],
    enum: ['upi', 'cash', 'neft'],
  },
  expenseHead: {
    type: String,
    required: [true, 'Expense head is required'],
  },
  description1: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description must be less than 500 characters'],
  },
  description2: {
    type: String,
    maxlength: [500, 'Description must be less than 500 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number'],
  },
  billType: {
    type: String,
    required: [true, 'Bill type is required'],
    enum: ['including', 'excluding'],
  },
  billPhoto: {
    type: String, // This will store the file path or URL
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for frequently queried fields
expenseSchema.index({ submittedBy: 1, status: 1 });
expenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
