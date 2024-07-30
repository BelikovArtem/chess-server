const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function query(text, params) {
  return await pool.query(text, params);
}

async function getClient() {
  return await pool.connect();
}

module.exports = {
  query,
  getClient
}