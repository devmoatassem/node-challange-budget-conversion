process.env.NODE_ENV = 'test'

const http = require('http')
const test = require('tape')
const servertest = require('servertest')
const app = require('../lib/app')
const { executeQuery } = require('../lib/db')

const server = http.createServer(app)

// Setup database tables before running tests
test('Database setup', async function (t) {
  const createProjectTable = `
    CREATE TABLE IF NOT EXISTS project (
      projectId INTEGER PRIMARY KEY,
      projectName TEXT NOT NULL,
      year INTEGER NOT NULL,
      currency TEXT NOT NULL,
      initialBudgetLocal REAL NOT NULL,
      budgetUsd REAL NOT NULL,
      initialScheduleEstimateMonths INTEGER NOT NULL,
      adjustedScheduleEstimateMonths INTEGER NOT NULL,
      contingencyRate REAL NOT NULL,
      escalationRate REAL NOT NULL,
      finalBudgetUsd REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `

  try {
    await executeQuery(createProjectTable, [], (err) => {
      if (err) {
        throw err
      }
    })
    t.pass('Database tables created successfully')
  } catch (err) {
    t.fail('Database setup failed: ' + err.message)
  }
  t.end()
})

test('GET /health should return 200', function (t) {
  servertest(server, '/health', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.end()
  })
})

test('GET /api/ok should return 200', function (t) {
  servertest(server, '/api/ok', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.ok(res.body.ok, 'Should return a body')
    t.end()
  })
})

test('GET /nonexistent should return 404', function (t) {
  servertest(server, '/nonexistent', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 404, 'Should return 404')
    t.end()
  })
})
const projectData = {
  projectId: 1,
  projectName: 'Humitas Hewlett Packard',
  year: 2024,
  currency: 'EUR',
  initialBudgetLocal: 316974.5,
  budgetUsd: 233724.23,
  initialScheduleEstimateMonths: 13,
  adjustedScheduleEstimateMonths: 12,
  contingencyRate: 2.19,
  escalationRate: 3.46,
  finalBudgetUsd: 247106.75
}
test('POST /api/project/budget should create project', function (t) {
  const options = {
    method: 'POST',
    encoding: 'json',
    headers: { 'Content-Type': 'application/json' }
  }

  servertest(server, '/api/project/budget', options, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 201, 'Should return 201')
    t.ok(res.body.success, 'Should return success')
    t.end()
  }).end(JSON.stringify(projectData))
})

test('GET /api/project/budget/:id should return project', function (t) {
  servertest(
    server,
    '/api/project/budget/1',
    { encoding: 'json' },
    function (err, res) {
      console.log(res)
      t.error(err, 'No error')
      t.equal(res.statusCode, 200, 'Should return 200')
      t.end()
    }
  )
})

test('POST /api/project/budget with empty body should return 400', function (t) {
  servertest(
    server,
    '/api/project/budget',
    {
      encoding: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 400, 'Should return 400')
      t.equal(res.body.success, false, 'Should return success: false')
      t.ok(res.body.message, 'Should return error message')
      t.end()
    }
  ).end(JSON.stringify({}))
})
const invalidData = {
  projectId: 463262,
  projectName: 111,
  year: 2024,
  currency: 'EUR',
  initialBudgetLocal: 316974.5,
  budgetUsd: 'string',
  initialScheduleEstimateMonths: 13,
  adjustedScheduleEstimateMonths: 12,
  contingencyRate: 2.19,
  escalationRate: 3.46,
  finalBudgetUsd: 247106.75
}
test('POST /api/project/budget with invalid data should return 400', function (t) {
  servertest(
    server,
    '/api/project/budget',
    {
      encoding: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 400, 'Should return 400')
      t.equal(res.body.success, false, 'Should return success: false')
      t.ok(res.body.message, 'Should return error message')
      t.end()
    }
  ).end(JSON.stringify(invalidData))
})

test('GET /project/budget/undefined should return 400', function (t) {
  servertest(
    server,
    '/api/project/budget/undefined',
    { encoding: 'json' },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 400, 'Should return 404')
      t.equal(res.body.success, false, 'Should return success: false')
      t.end()
    }
  )
})
