const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const multer = require('multer');
const {
  createExpense,
  getExpenses,
  updateExpenseStatus,
  getExpenseById,
} = require('../controllers/expenseController');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'), false);
    }
  },
});

// All routes are protected and require authentication
router.use(protect);

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post(
  '/',
  upload.single('billPhoto'),
  createExpense
);

// @route   GET /api/expenses
// @desc    Get all expenses (admin gets all, users get their own)
// @access  Private
router.get('/', getExpenses);

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', getExpenseById);

// @route   PUT /api/expenses/:id/status
// @desc    Update expense status (approve/reject)
// @access  Private/Admin
router.put(
  '/:id/status',
  authorize('admin'),
  updateExpenseStatus
);

module.exports = router;
