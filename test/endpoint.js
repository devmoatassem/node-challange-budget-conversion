process.env.NODE_ENV = 'test'

const http = require('http')
const test = require('tape')
const servertest = require('servertest')
const app = require('../lib/app')
const { executeQuery } = require('../lib/db')
const { CREATE_TABLE_SQL, PROJECT_DATA_STRUCTURE } = require('../lib/utils/constants')
const { TEST_DATA, INVALID_DATA, UPDATE_DATA } = require('./testData')
const { validateDataWithStructure } = require('../lib/utils/validateData')
const server = http.createServer(app)

// Setup database tables before running tests
test('Database setup', async function (t) {
  try {
    await executeQuery(CREATE_TABLE_SQL, [], (err) => {
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
  }).end(JSON.stringify(TEST_DATA))
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
      body: JSON.stringify(TEST_DATA)
    },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 400, 'Should return 400')
      t.equal(res.body.success, false, 'Should return success: false')
      t.ok(res.body.message, 'Should return error message')
      t.end()
    }
  ).end(JSON.stringify(INVALID_DATA))
})

test('POST /api/api-conversion should return project', function (t) {
  servertest(
    server,
    '/api/api-conversion',
    {
      encoding: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 200, 'Should return 200')
      t.ok(res.body.success, 'Should return success')
      t.ok(res.body.data, 'Should return data')
      t.ok(res.body?.data?.length > 0, 'Should return data')
      res.body.data.forEach((entry, idx) => {
        t.ok(entry.budgetTtd, `Entry ${idx} should return budgetTtd`)
        t.ok(entry.finalBudgetTtd, `Entry ${idx} should return finalBudgetTtd`)
      })
      t.end()
    }
  ).end(JSON.stringify({
    projectName: 'Rigua Nintendo',
    currency: 'TTD'
  }))
})

test('POST /api/api-conversion with invalid data should return 400', function (t) {
  servertest(
    server,
    '/api/api-conversion',
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
  ).end(JSON.stringify({ projectName: 'Humitas Hewlett Packard', currency: 'TTD' }))
})

test('POST /api/api-conversion with invalid params should return 400', function (t) {
  servertest(
    server,
    '/api/api-conversion',
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
  ).end(JSON.stringify({
    year: 2025,
    projectName: 'Project X'
  }))
})

test('GET /api/project/budget/:id should return project', function (t) {
  servertest(
    server,
    '/api/project/budget/707078',
    { encoding: 'json' },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 200, 'Should return 200')
      t.ok(res.body.success, 'Should return success')
      t.ok(res.body.data, 'Should return data')
      t.equal(res.body.data.projectId, 707078, 'Should return projectId')
      // validateDataWithStructure(data, PROJECT_DATA_STRUCTURE) use this to confirm the data is valid
      const { isValid } = validateDataWithStructure(res.body.data, PROJECT_DATA_STRUCTURE)
      t.ok(isValid, 'Should return valid data')
      t.end()
    }
  )
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
test('PUT /api/project/budget/:id should update project', function (t) {
  servertest(
    server,
    '/api/project/budget/707078',
    {
      encoding: 'json',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 200, 'Should return 200')
      t.end()
    }
  ).end(JSON.stringify(UPDATE_DATA))
})

test('PUT /api/project/budget/:id with invalid data should return 400', function (t) {
  servertest(
    server,
    '/api/project/budget/707078',
    { encoding: 'json', method: 'PUT' },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 400, 'Should return 400')
      t.equal(res.body.success, false, 'Should return success: false')
      t.ok(res.body.message, 'Should return error message')
      t.end()
    }
  ).end(JSON.stringify({ ...INVALID_DATA, projectId: undefined }))
})

test('POST /api/project/budget/currency should return project', function (t) {
  servertest(
    server,
    '/api/project/budget/currency',
    {
      encoding: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 200, 'Should return 200')
      t.ok(res.body.success, 'Should return success')
      t.ok(res.body.data, 'Should return data')
      t.ok(res.body?.data?.length > 0, 'Should return data')
      res.body.data.forEach((entry, idx) => {
        t.ok(entry.finalBudgetTtd, `Entry ${idx} should return finalBudgetTtd`)
      })
      t.end()
    }
  ).end(JSON.stringify({
    year: 2025,
    projectName: 'Project X',
    currency: 'TTD'
  }))
})

test('POST /api/project/budget/currency with invalid data should return 400', function (t) {
  servertest(
    server,
    '/api/project/budget/currency',
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
  ).end(JSON.stringify({ projectName: 'Rigua Nintendo', currency: 'EUR' }))
})

test('POST /api/project/budget/currency with invalid currency should return 500', function (t) {
  servertest(
    server,
    '/api/project/budget/currency',
    {
      encoding: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 500, 'Should return 500')
      t.equal(res.body.success, false, 'Should return success: false')
      t.ok(res.body.message, 'Should return error message')
      t.end()
    }
  ).end(JSON.stringify({
    year: 2025,
    projectName: 'Project X',
    currency: 'invalid'
  }))
})

test('DELETE /api/project/budget/:id with invalid id should return 400', function (t) {
  servertest(
    server,
    '/api/project/budget/invalid',
    { encoding: 'json', method: 'DELETE' },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 400, 'Should return 400')
      t.equal(res.body.success, false, 'Should return success: false')
      t.ok(res.body.message, 'Should return error message')
      t.end()
    }
  )
})

test('DELETE /api/project/budget/:id should delete project', function (t) {
  servertest(
    server,
    '/api/project/budget/707078',
    { encoding: 'json', method: 'DELETE' },
    function (err, res) {
      t.error(err, 'No error')
      t.equal(res.statusCode, 200, 'Should return 200')
      t.end()
    }
  )
})
