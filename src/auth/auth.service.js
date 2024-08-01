import db from '../db/connection.js';

class AuthService {
  async signUp(name, password) {
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

      await client.query('COMMIT');
      return queryRes.rows[0].id; 
    } catch (err) {
      await client.query('ROLLBACK');
      return 0;
    } finally {
      client.release();
    }
  }

  async signIn(name, password) {
    const client = await db.getClient();

    const queryText = `
      SELECT id FROM users
      WHERE name = $1 AND password = $2
    `; 
    try {
      const queryRes = await client.query(queryText, [name, password]);
      const id = queryRes.rows[0].id;

      if (!queryRes.rows.length) {
        throw new Error('User not found');
      }
      
      return id;
    } catch (err) {
      return null;
    } finally {
      client.release();
    }
  }

  async storeToken(userId, token) {
    const client = await db.getClient();

    const queryText = `
      INSERT INTO refresh_tokens (
        user_id, token 
      )
      VALUES ($1, $2)
    `;

    try {
      await client.query(queryText, [
        userId, token 
      ]);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      client.release();
    }
  }

  async findToken(token) {
    const client = await db.getClient();

    const queryText = `
      SELECT * FROM refresh_tokens
      WHERE token = $1
    `;

    const queryRes = await client.query(queryText, [token]);
    client.release();

    if (!queryRes.rows.length) {
      return null;
    } else {
      return queryRes.rows[0];
    }
  }

  async removeToken(token) {
    const client = await db.getClient();

    const queryText = `
      DELETE FROM refresh_tokens
      WHERE token = $1
      RETURNING id
    `;

    try {
      const queryRes = await client.query(queryText, [token]);

      if (!queryRes.rows.length) {
        throw new Error('Token not found');
      }
      return true;
    } catch (err) {
      return false;
    } finally {
      client.release();
    }
  }
}

export default new AuthService();