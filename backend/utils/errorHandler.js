const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err.stack);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(error => error.message);
    error = { message: messages.join(', '), statusCode: 400 };
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(error => error.message);
    error = { message: messages.join(', '), statusCode: 400 };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Not authorized', statusCode: 401 };
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired', statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

export default errorHandler;