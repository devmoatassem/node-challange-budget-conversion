const fs = require('fs')
const db = require('../lib/db')
const { CREATE_TABLE_SQL } = require('../lib/utils/constants')
const stream = fs.createReadStream('./data/projects.csv')

let data = ''

function processLine (line, index) {
  if (index === 0) return

  const values = line.split(',')
  const parsedValues = values.map(value => {
    if (value === 'NULL') return null
    if (!isNaN(value)) return parseFloat(value)
    return `"${value}"`
  })

  const insertSql = `INSERT INTO project values (${parsedValues.join(',')})`

  db.query(insertSql, err => {
    if (err) {
      console.error('Error inserting Project ID:', values[0], err)
      process.exit(1)
    }
    console.log('Inserted Project ID:', values[0])
  })
}

db.query(CREATE_TABLE_SQL, err => {
  if (err) return console.error('Error creating table:', err)
  stream.on('data', chunk => {
    data += chunk.toString()

    const lines = data.split('\n')
    data = lines.pop()

    lines.forEach(processLine)
  })

  stream.on('end', () => {
    db.end(err => {
      if (err) return console.error('Error closing database connection:', err)
      console.log('Database connection closed')
    })
  })
})
