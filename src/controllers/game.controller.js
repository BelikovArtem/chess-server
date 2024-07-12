const query = require('../db/db');

class GameController {
  async getOne(req, res) {
    const id = req.params.id;


  }

  async getAllByUserId(req, res) {
    const userId = req.params.id;
  }

  async delete(req, res) {
    const id = req.params.od;
  }

  async update(req, res) {
    const id = req.body.id;
  }

  async create(req, res) {
    const { whitePlayerId, blackPlayerId } = req.body;

    const timestamp = new Date(Date.now());
    const date = timestamp.toLocaleDateString('en-US'); 
    const time = timestamp.toLocaleTimeString('en-US'); 

    try {
      const game = await query(
        'INSERT INTO games ( ' + 
        ' whitePlayerId, blackPlayerId, ' +
        ' gameResult, playedAt ' +
        ') ' +
        'VALUES ($1, $2, $3, $4) ' +
        'RETURNING *', [
          whitePlayerId, blackPlayerId,
          'draw', `${date} ${time}`
        ]
      );
      
      const gameId = game.rows[0].id;

      const gameInfo = await query(
        'INSERT INTO gamesInfo '
      );
    } catch (e) {
      res.json(e.detail);
    }
  }
}

module.exports = new GameController();