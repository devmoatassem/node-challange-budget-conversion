const { REQUIRED_PROJECTS, API_CONVERSION_DATA_REQUEST } = require('./constants')

function validateDataWithStructure (data, expectedStructure) {
  // Defensive: ensure both data and expectedStructure are objects
  if (
    expectedStructure == null ||
    typeof expectedStructure !== 'object' ||
    Array.isArray(expectedStructure)
  ) {
    return {
      isValid: false,
      message: 'Invalid expected structure'
    }
  }
  if (data == null || typeof data !== 'object' || Array.isArray(data)) {
    return {
      isValid: false,
      message: 'Invalid data: must be an object'
    }
  }

  // Check if all required keys are present
  const missingKeys = Object.keys(expectedStructure).filter(
    (key) => !(key in data)
  )
  if (missingKeys.length > 0) {
    return {
      isValid: false,
      message: `Missing required keys: ${missingKeys.join(', ')}`
    }
  }

  // Check if all values have the correct type
  const typeErrors = []
  for (const [key, expectedType] of Object.entries(expectedStructure)) {
    const actualType = typeof data[key]
    if (actualType !== expectedType) {
      typeErrors.push(`${key} should be ${expectedType} but got ${actualType}`)
    }
  }

  if (typeErrors.length > 0) {
    return { isValid: false, message: `Type errors: ${typeErrors.join('; ')}` }
  }

  return { isValid: true, message: 'Data is valid' }
}

function vaidateCurrencyConversionData (data) {
  const { isValid, message } = validateDataWithStructure(data, API_CONVERSION_DATA_REQUEST)
  if (!isValid) {
    return { isValid: false, message }
  }
  if (!REQUIRED_PROJECTS.includes(data.projectName)) {
    return { isValid: false, message: 'Project name is not in the required projects' }
  }
  return { isValid: true, message: 'Data is valid' }
}

module.exports = {
  validateDataWithStructure,
  vaidateCurrencyConversionData
}
