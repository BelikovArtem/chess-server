const db = require('../db/connection');

class GameFetcher {
  async getGameInfo(id) {
    const client = await db.getClient();

    const queryText = `
      SELECT * FROM games_info
      JOIN games
      ON id = game_id
      WHERE game_id = $1
    `;
    const queryRes = await client.query(queryText, [id]);

    client.release();
    return queryRes.rows[0];
  }

  async getAllByUserId(userId) {
    const client = await db.getClient();
    
    const queryText = `
      SELECT * FROM games
      JOIN games_info ON id = game_id
      WHERE white_id = $1 OR black_id = $1
    `;

    const queryRes = await client.query(queryText, [userId]); 
    
    client.release();
    return queryRes.rows;
  }

  async delete(id) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      let queryText = `
        DELETE FROM games_info WHERE game_id = $1
        RETURNING game_id
      `;
      const queryRes = await client.query(queryText, [id]);

      if (!queryRes.rows.length) {
        throw new Error('Game not found');
      }

      queryText = 'DELETE FROM games WHERE id = $1';
      await client.query(queryText, [id]);

      await client.query('COMMIT');
      return queryRes.rows[0].game_id;
    } catch (e) {
      await client.query('ROLLBACK');
      return e;
    } finally {
      client.release();
    }
  }
 
  async create(whiteId, blackId, control, bonusTime) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      let queryText = `
        INSERT INTO games (white_id, black_id, control)
        VALUES ($1, $2, $3)
        RETURNING id
      `;

      const queryRes = await client.query(queryText, [
        whiteId, blackId, control
      ]);

      queryText = `
        INSERT INTO games_info (
          game_id, bonus_time, moves
        )
        VALUES ($1, $2, $3::jsonb)  
      `;

      await client.query(queryText, [
        queryRes.rows[0].id, bonusTime, 
        JSON.stringify([{}])
      ]);
      
      await client.query('COMMIT');
      // send gameId back to the client
      return queryRes.rows[0].id; 
    } catch (e) {
      await client.query('ROLLBACK');
      return e;
    } finally {
      client.release();
    }
  }
}

module.exports = new GameFetcher();