const ErrorResponse = require("../utils/error");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    // statusCode: error.statusCode
  });
};

module.exports = errorHandler;
