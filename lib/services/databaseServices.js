const { executeQuery } = require("../db");

// helper functions for crud queries

const buildSelectQuery = (table, columns = "*", filters = {}, options = {}) => {
  let sql = `SELECT ${columns} FROM ${table}`;
  const params = [];
  if (Object.keys(filters).length > 0) {
    const conditions = Object.keys(filters).map((key) => {
      params.push(filters[key]);
      return `${key} = ?`;
    });
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }
  if (options.orderKey) {
    sql += ` ORDER BY ${options.orderKey} ${options.order}`;
  }
  if (options.limit) {
    sql += ` LIMIT ${parseInt(options.limit)}`;
  }
};

module.exports = {
  buildSelectQuery,
};
