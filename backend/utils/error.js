export const errorHandler = (statusCode, message) => {
  const error = new Error(message)  // Pass message to Error constructor
  error.statusCode = statusCode
  error.message = message
  console.error(`[Error ${statusCode}]:`, message)  // Add logging
  return error
}

// Middleware to handle errors
export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  
  console.error("Error details:", {
    statusCode,
    message,
    stack: err.stack
  })

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
}
