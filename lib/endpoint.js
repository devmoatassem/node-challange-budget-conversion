const express = require('express')

const endpoints = express.Router()

const {
  getProjectBudgetById,
  addNewProjectBudget,
  updateProjectBudget
} = require('./controllers/budgetController')

endpoints.get('/ok', (req, res) => {
  res.status(200).json({ ok: true })
})

endpoints.get('/project/budget/:id', getProjectBudgetById)
endpoints.post('/project/budget', addNewProjectBudget)
endpoints.put('/project/budget/:id', updateProjectBudget)

module.exports = endpoints
