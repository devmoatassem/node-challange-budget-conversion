const express = require('express')

const endpoints = express.Router()

const { getProjectBudgetById } = require('./controllers/budgetController')

endpoints.get('/ok', (req, res) => {
  res.status(200).json({ ok: true })
})

endpoints.get('/project/budget/:id', getProjectBudgetById)

module.exports = endpoints
