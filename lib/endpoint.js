const express = require('express')

const endpoints = express.Router()

const {
  getProjectBudgetById,
  addNewProjectBudget,
  updateProjectBudget,
  deleteProjectBudget,
  getBudgetDetails,
  getApiConversion
} = require('./controllers/budgetController')

endpoints.get('/ok', (req, res) => {
  res.status(200).json({ ok: true })
})

endpoints.get('/project/budget/:id', getProjectBudgetById)
endpoints.post('/project/budget', addNewProjectBudget)
endpoints.put('/project/budget/:id', updateProjectBudget)
endpoints.delete('/project/budget/:id', deleteProjectBudget)
endpoints.post('/project/budget/currency', getBudgetDetails)
endpoints.post('/api-conversion', getApiConversion)

module.exports = endpoints
