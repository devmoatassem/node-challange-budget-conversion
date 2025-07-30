const {
  executeDbQuery,
  buildSelectQuery,
  buildInsertQuery
} = require('../services/databaseServices')
const { validateProjectData } = require('../utils/validateData')

async function getProjectBudgetById (req, res) {
  try {
    const projectId = Number(req.params.id)
    if (isNaN(projectId)) {
      return res.status(400).json({
        error: 'Invalid project ID',
        success: false
      })
    }
    const response = await executeDbQuery(
      buildSelectQuery('project', '*', { projectId }),
      'Retrieved project budget'
    )

    if (!response.success || !response?.result?.length || !response?.result) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }
    res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.result
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}

async function addNewProjectBudget (req, res) {
  try {
    const data = req.body
    const { isValid, message } = validateProjectData(data)
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message
      })
    }
    const response = await executeDbQuery(
      buildInsertQuery('project', data),
      'Added project budget'
    )
    if (!response.success) {
      return res.status(400).json({
        success: false,
        message: response.message || 'Project budget not added'
      })
    }
    res.status(201).json({
      success: true,
      message: 'Project budget added',
      data
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}

module.exports = {
  getProjectBudgetById,
  addNewProjectBudget
}
