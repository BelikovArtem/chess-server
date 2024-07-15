const db = require('../db/db');
const UserDTO = require('../dto/user.dto');

class UserController {
  async getAll(req, res) {
    const client = await db.getClient();
    
    const queryText = `
      SELECT ${UserDTO.fields.toString()} FROM users 
      JOIN users_info
      ON id = user_id
    `;
    const queryRes = await client.query(queryText); 

    res.json(queryRes.rows);
    client.release();
  }

  async getOne(req, res) {
    const id = req.params.id;
    
    const client = await db.getClient();
    
    const queryText = `
      SELECT ${UserDTO.fields.toString()}
      FROM users 
      JOIN users_info
      ON id = user_id
      WHERE id = $1
    `;
    try {
      const queryRes = await client.query(queryText, [id]);
      res.json(queryRes.rows[0]);
      
    } catch (e) {
      res.json(e);
    }
    
    client.release();
  }

  async delete(req, res) {
    const id = req.params.id;

    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      let queryText = `
        DELETE FROM users_info WHERE user_id = $1
        RETURNING user_id
      `;
      const queryRes = await client.query(queryText, [id]);

      if (!queryRes.rows.length) {
        throw new Error('User not found');
      }

      queryText = `
        UPDATE users SET is_deleted = TRUE
        WHERE id = $1 
      `;
      await client.query(queryText, [id]);

      await client.query('COMMIT');
      res.json(queryRes.rows[0].user_id);
    } catch (e) {
      await client.query('ROLLBACK');
      res.json(e.message);
    } finally {
      client.release();
    }
  }

  async updateField(req, res) {  
    const { field, id, value } = req.body;

    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      const table = getTableFromField(field);

      if (table === 'Incorrect field to update') {
        throw new Error(table);
      } 

      const idCol = table === 'users' ? 'id' : 'user_id'; 
      let queryText = `
        UPDATE ${table} SET ${field} = $1
        WHERE ${idCol} = $2 RETURNING ${idCol}
      `;

      const queryRes = await client.query(queryText, [value, id]);

      await client.query('COMMIT');
      res.json(queryRes.rows[0][idCol]);
    } catch (e) {
      await client.query('ROLLBACK');
      res.json(e.message);
    } finally {
      client.release();
    }
  }

  async create(req, res) {
    const { name, password } = req.body;  

    if (name.includes(' ') || password.includes(' ')) {
      res.json({detail: 'Name and password cannot contain whitespaces'});
      return;
    }

    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      let queryText = `
        INSERT INTO users (name, password)
        VALUES ($1, $2) RETURNING id
      `;

      const queryRes = await client.query(queryText, [
        name, password
      ]);

      queryText = `
        INSERT INTO users_info (user_id) VALUES ($1)
      `;
      await client.query(queryText, [queryRes.rows[0].id]);

      await client.query('COMMIT');
      // send userId back to the client
      res.json(queryRes.rows[0].id);
    } catch (e) {
      await client.query('ROLLBACK');
      res.json(e.message);
    } finally {
      client.release();
    } 
  }
}

function getTableFromField(field) {
  switch (field) {
    case 'name':
    case 'password':
      return 'users';

    case 'blitz_rating': 
    case 'rapid_rating':
    case 'bullet_rating':
    case 'games_count':
      return 'users_info';

    default:
      return 'Incorrect field to update';        
  }
}

module.exports = new UserController();