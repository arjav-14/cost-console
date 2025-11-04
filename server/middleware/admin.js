const ErrorResponse = require('../utils/errorResponse');

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.ole !== 'admin' && !req.user.isAdmin) {
    return next(
      new ErrorResponse('Not authorized to access this route', 403)
    );
  }
  next();
};
