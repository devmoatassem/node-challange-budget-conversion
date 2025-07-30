function validateProjectData (data) {
  const expectedStructure = {
    projectId: 'number',
    projectName: 'string',
    year: 'number',
    currency: 'string',
    initialBudgetLocal: 'number',
    budgetUsd: 'number',
    initialScheduleEstimateMonths: 'number',
    adjustedScheduleEstimateMonths: 'number',
    contingencyRate: 'number',
    escalationRate: 'number',
    finalBudgetUsd: 'number'
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

module.exports = {
  validateProjectData
}
