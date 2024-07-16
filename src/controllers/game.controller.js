const db = require('../db/db');
const GameDTO = require('../dto/game.dto');

class GameController {
  async getGameInfo(req, res) {
    const id = req.params.id;
    
    const client = await db.getClient();

    const queryText = `
      SELECT ${GameDTO.fields.toString()} FROM games_info
      JOIN games
      ON id = game_id
      WHERE game_id = $1
    `;
    const queryRes = await client.query(queryText, [id]);

    res.json(queryRes.rows[0]);
    client.release();
  }

  async getAllByUserId(req, res) {
    const userId = req.params.id;
    
    const client = await db.getClient();
    
    const queryText = `
      SELECT ${GameDTO.fields.toString()} FROM games
      JOIN games_info ON id = game_id
      WHERE white_id = $1 OR black_id = $1
    `;

    const queryRes = await client.query(queryText, [userId]); 
    res.json(queryRes.rows);
    
    client.release();
  }

  async delete(req, res) {
    const id = req.params.id;
    
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
      res.json(queryRes.rows[0].game_id);
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

      const idCol = table === 'games' ? 'id' : 'game_id';
      
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
    const { whiteId, blackId, control, bonusTime } = req.body;
    
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
      res.json(queryRes.rows[0].id); 
    } catch (e) {
      await client.query('ROLLBACK');
      res.json(e);
    } finally {
      client.release();
    }
  }
}

module.exports = new GameController();