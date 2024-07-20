const db = require('../db/connection');

class UserFetcher {
  async getMany() {
    // TODO: implement dynamic where statement
    
    const client = await db.getClient();

    const queryText = `
      SELECT * FROM users
      JOIN users_info ON user_id = id
    `; 
    const queryRes = await client.query(queryText);
    client.release();

    if (!queryRes.rows.length) {
      return 'Database doesn`t contain a single user'
    }
    return queryRes.rows;
  }

  async getOne(id) {
    const client = await db.getClient();

    const queryText = `
      SELECT * FROM users
      JOIN users_info ON user_id = id
      WHERE id = $1
    `; 
    const queryRes = await client.query(queryText, [id]);
    client.release();

    if (!queryRes.rows.length) {
      return 'User not found';
    }
    return queryRes.rows[0];
  }

  async delete(id) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      let queryText = `
        DELETE FROM users_info 
        WHERE user_id = $1 RETURNING user_id AS id
      `;
      const queryRes = await client.query(queryText, [id]);

      queryText = `
        UPDATE users SET is_deleted = true WHERE id = $1
      `;
      await client.query(queryText, [id]);

      await client.query('COMMIT');
      if (!queryRes.rows.length) {
        return 'User not found';
      }
      return queryRes.rows[0].id;
    } catch (e) {
      await client.query('ROLLBACK');
      return e;
    } finally {
      client.release();
    }
  }

  async create(name, password) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // create new user
      let queryText = `
        INSERT INTO users (name, password)
        VALUES ($1, $2) RETURNING id
      `;
      const queryRes = await client.query(queryText, [name, password]);

      // insert extended user info 
      queryText = `
        INSERT INTO users_info (user_id)
        VALUES ($1) 
      `;
      await client.query(queryText, [queryRes.rows[0].id]);

      // select created user and info
      queryText = `
        SELECT * FROM users
        JOIN users_info ON user_id = id
        WHERE id = $1
      `;
      const user = await client.query(queryText, [queryRes.rows[0].id]);

      await client.query('COMMIT');
      return user.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      return e;
    } finally {
      client.release();
    }
  }

  async update(field, id, value) {
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
      return queryRes.rows[0][idCol];
    } catch (e) {
      await client.query('ROLLBACK');
      return e;  
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

module.exports = new UserFetcher();