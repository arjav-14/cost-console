const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize, isAdmin } = require('../middleware/admin');

// Protect all admin routes with JWT and admin check
router.use(protect);
router.use(authorize('admin'));

// Test admin route
router.get('/dashboard', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Welcome to Admin Dashboard',
      user: req.user
    }
  });
});

// Add more admin routes here...

module.exports = router;
