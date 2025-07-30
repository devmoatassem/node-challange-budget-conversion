const {
  executeDbQuery,
  buildSelectQuery
} = require('../services/databaseServices')

async function getProjectBudgetById (req, res) {
  try {
    const projectId = req.params.id

    const response = await executeDbQuery(
      buildSelectQuery('project', '*', { projectId }),
      'Retrieved project budget'
    )
    if (!response.success || !response.result.length) {
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

module.exports = {
  getProjectBudgetById
}
