const mysql = require('mysql')
const sqlite3 = require('sqlite3').verbose()
const config = require('../config')

const engines = {
  undefined: 'sqlite3',
  test: 'sqlite3',
  development: 'mysql',
  production: 'mysql'
}

const engine = {
  sqlite3: new sqlite3.Database(':memory:'),
  mysql: mysql.createConnection(config.mysql)
}[engines[process.env.NODE_ENV]]

const db = module.exports = engine

if (engines[process.env.NODE_ENV] === 'mysql') {
  db.connect(function (err) {
    if (err) throw err
  })
}

db.healthCheck = function (cb) {
  const now = Date.now().toString()
  const createQuery = 'CREATE TABLE IF NOT EXISTS healthCheck (value TEXT)'
  const insertQuery = 'INSERT INTO healthCheck VALUES (?)'

  return executeQuery(createQuery, [], function (err) {
    if (err) return cb(err)
    return executeQuery(insertQuery, [now], function (err) {
      if (err) return cb(err)
      cb(null, now)
    })
  })
}

function executeQuery (query, values, cb) {
  if (engines[process.env.NODE_ENV] === 'mysql') {
    return db.query(query, values, function (err, data) {
      if (err) return cb(err)
      cb(null, data)
    })
  }

  return db.serialize(function () {
    const isSelect =
      typeof query === 'string' &&
      query.trim().toLowerCase().startsWith('select')

    if (isSelect) {
      db.all(query, values, function (err, rows) {
        if (err) return cb(err)
        cb(null, rows)
      })
      return
    }

    db.run(query, values, function (err) {
      if (err) return cb(err)
      cb(null, this)
    })
  })
}

module.exports = {
  executeQuery
}
