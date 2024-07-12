const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'chess',
  user: 'postgres',
  password: 'admin'
});

client.connect();

module.exports = async function query(text, params, callback) {
  return client.query(text, params, callback);
}