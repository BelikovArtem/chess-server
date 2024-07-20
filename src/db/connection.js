const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'chess',
  user: 'postgres',
  password: 'admin'
});

module.exports.query = async (text, params) => {
  return await pool.query(text, params);
}

module.exports.getClient = async () => {
  return await pool.connect();
}