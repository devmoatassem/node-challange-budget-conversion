const { executeQuery } = require('../db')

function executeDbQuery (query, successMessage = 'Action completed') {
  return new Promise((resolve, reject) => {
    executeQuery(query.sql, query.params, (error, result) => {
      if (error) {
        reject(new Error(`Database error: ${error?.message}`))
        return
      }

      resolve({ success: true, message: successMessage, result })
    })
  })
}

// Query builder functions
function buildSelectQuery (table, columns = '*', filters = {}, options = {}) {
  let sql = `SELECT ${columns} FROM ${table}`
  const params = []

  if (Object.keys(filters).length > 0) {
    const conditions = Object.keys(filters).map((key) => {
      params.push(filters[key])
      return `${key} = ?`
    })
    sql += ` WHERE ${conditions.join(' AND ')}`
  }

  if (options.orderKey) {
    sql += ` ORDER BY ${options.orderKey} ${options.order}`
  }

  if (options.limit) {
    sql += ` LIMIT ${parseInt(options.limit)}`
  }

  return { sql, params }
}

function buildUpdateQuery (table, data, filters) {
  const updateColumns = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(', ')
  const updateValues = Object.values(data)
  const filterColumns = Object.keys(filters)
    .map((key) => `${key} = ?`)
    .join(' AND ')

  const filterValues = Object.values(filters)

  return {
    sql: `UPDATE ${table} SET ${updateColumns} WHERE ${filterColumns}`,
    params: [...updateValues, ...filterValues]
  }
}

function buildInsertQuery (table, data) {
  const columns = Object.keys(data).join(', ')
  const placeholders = Object.keys(data)
    .map((key) => '?')
    .join(', ')
  const values = Object.values(data)

  return {
    sql: `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
    params: values
  }
}

function buildDeleteQuery (table, filters) {
  const filterColumns = Object.keys(filters)
    .map((key) => `${key} = ?`)
    .join(' AND ')
  const filterValues = Object.values(filters)

  return {
    sql: `DELETE FROM ${table} WHERE ${filterColumns}`,
    params: filterValues
  }
}

module.exports = {
  buildSelectQuery,
  buildUpdateQuery,
  buildInsertQuery,
  buildDeleteQuery,
  executeDbQuery
}
