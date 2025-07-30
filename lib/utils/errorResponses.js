// Helper function for validation responses
const handleValidationError = (res, message) => {
  return res.status(400).json({
    success: false,
    message
  })
}

// Helper function for not found responses
const handleNotFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message
  })
}

// Helper function for database response errors
const handleDbError = (res, response, defaultMessage) => {
  return res.status(400).json({
    success: false,
    message: response?.message || defaultMessage
  })
}

module.exports = {
  handleValidationError,
  handleNotFound,
  handleDbError
}
