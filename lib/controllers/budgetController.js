const {
  executeDbQuery,
  buildSelectQuery,
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery
} = require('../services/databaseServices')
const {
  validateDataWithStructure,
  validateCurrencyConversionData,
  validateProjectId
} = require('../utils/validateData')
const { convertProjectCurrency } = require('../services/currencyServices')
const {
  handleValidationError,
  handleNotFound,
  handleDbError
} = require('../utils/errorResponses')

const {
  PROJECT_DATA_STRUCTURE,
  PROJECT_CURRENCY_DATA_REQUEST
} = require('../utils/constants')

// controller functions
function getProjectBudgetById (req, res) {
  return asyncHandler(async (req, res) => {
    const projectId = validateProjectId(req.params.id)
    if (!projectId) return handleValidationError(res, 'Invalid project ID')

    const response = await executeDbQuery(
      buildSelectQuery('project', '*', { projectId }),
      'Retrieved project budget'
    )

    if (response?.result?.length !== 1 || !response?.success) {
      return handleNotFound(res, 'Project not found')
    }

    return res.status(200).json({
      success: response?.success,
      message: response?.message,
      data: response?.result[0]
    })
  })(req, res)
}

function addNewProjectBudget (req, res) {
  return asyncHandler(async (req, res) => {
    const data = req?.body
    const { isValid, message } = validateDataWithStructure(
      data,
      PROJECT_DATA_STRUCTURE
    )
    if (!isValid) return handleValidationError(res, message)

    const response = await executeDbQuery(
      buildInsertQuery('project', data),
      'Added project budget'
    )

    if (!response.success) {
      return handleDbError(res, response, 'Project budget not added')
    }

    return res.status(201).json({
      success: true,
      message: 'Project budget added',
      data
    })
  })(req, res)
}

function updateProjectBudget (req, res) {
  return asyncHandler(async (req, res) => {
    const data = req?.body
    const projectId = validateProjectId(req.params.id)
    if (!projectId) return handleValidationError(res, 'Invalid project ID')

    const { isValid, message } = validateDataWithStructure(
      { projectId, ...data },
      PROJECT_DATA_STRUCTURE
    )
    if (!isValid) return handleValidationError(res, message)

    const response = await executeDbQuery(
      buildUpdateQuery('project', data, { projectId }),
      'Updated project budget'
    )

    if (!response.success) {
      return handleDbError(res, response, 'Project budget not updated')
    }

    return res.status(200).json({
      success: true,
      message: 'Project budget updated',
      data
    })
  })(req, res)
}

function deleteProjectBudget (req, res) {
  return asyncHandler(async (req, res) => {
    const projectId = validateProjectId(req.params.id)
    if (!projectId) return handleValidationError(res, 'Invalid project ID')

    const response = await executeDbQuery(
      buildDeleteQuery('project', { projectId }),
      'Deleted project budget'
    )

    if (response?.result && response.result.affectedRows === 0) {
      return handleNotFound(res, 'Project was already deleted or does not exist')
    }

    if (!response?.success) {
      return handleDbError(res, response, 'Project budget not deleted')
    }

    return res.status(200).json({
      success: true,
      message: 'Project budget deleted'
    })
  })(req, res)
}

function getBudgetDetails (req, res) {
  return asyncHandler(async (req, res) => {
    const data = req?.body
    const { isValid, message } = validateDataWithStructure(
      data,
      PROJECT_CURRENCY_DATA_REQUEST
    )
    if (!isValid) return handleValidationError(res, message)

    const response = await executeDbQuery(
      buildSelectQuery('project', '*', {
        year: data.year,
        projectName: data.projectName
      })
    )

    if (!response?.success || !response?.result?.length) {
      return handleDbError(res, response, 'Project budget not found')
    }

    const convertedData = await Promise.all(
      response?.result?.map(async (project) => {
        return await convertProjectCurrency(
          project,
          data.currency,
          ['finalBudgetUsd']
        )
      })
    )

    if (!convertedData?.length) {
      return handleDbError(res, {}, 'No data found')
    }

    return res.status(200).json({
      success: true,
      message: 'Project budget found',
      data: convertedData
    })
  })(req, res)
}

function getApiConversion (req, res) {
  return asyncHandler(async (req, res) => {
    const data = req?.body
    const { isValid, message } = validateCurrencyConversionData(data)
    if (!isValid) return handleValidationError(res, message)

    const response = await executeDbQuery(
      buildSelectQuery('project', '*', { projectName: data.projectName })
    )

    if (!response?.success || !response?.result?.length) {
      return handleDbError(res, response, 'Project budget not found')
    }

    const convertedData = await Promise.all(
      response?.result?.map(async (project) => {
        return await convertProjectCurrency(
          project,
          data.currency,
          ['finalBudgetUsd', 'budgetUsd']
        )
      })
    )

    if (!convertedData?.length || !convertedData) {
      return handleDbError(res, {}, 'No data found')
    }

    return res.status(200).json({
      success: true,
      message: 'Currency conversion retrieved',
      data: convertedData
    })
  })(req, res)
}

function asyncHandler (fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
      res.status(500).json({
        success: false,
        message: err?.message || 'Internal Server Error'
      })
    })
  }
}

module.exports = {
  getProjectBudgetById,
  addNewProjectBudget,
  updateProjectBudget,
  deleteProjectBudget,
  getBudgetDetails,
  getApiConversion
}
