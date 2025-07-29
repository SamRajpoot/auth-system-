const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  let statusCode = err.statusCode || 500
  let message = err.message || "Something went wrong!"

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400
    message = "Resource not found"
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400
    message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401
    message = "Not authorized, token failed"
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401
    message = "Not authorized, token expired"
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.name,
  })
}

module.exports = errorHandler
