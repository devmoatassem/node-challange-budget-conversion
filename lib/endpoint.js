const express = require('express')

const endpoints = express.Router()

const {
  getProjectBudgetById,
  addNewProjectBudget
} = require('./controllers/budgetController')

endpoints.get('/ok', (req, res) => {
  res.status(200).json({ ok: true })
})

endpoints.get('/project/budget/:id', getProjectBudgetById)
endpoints.post('/project/budget', addNewProjectBudget)

module.exports = endpoints
