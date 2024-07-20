const gameService = require('./game.service');

class GameController {
  async getGameInfo(req, res) {
    const id = req.params.id;
    const game = await gameService.getGameInfo(id);
    res.json(game);
  }

  async getAllByUserId(req, res) {
    const userId = req.params.id;
    const games = await gameService.getAllByUserId(userId);
    res.json(games);
  }

  async delete(req, res) {
    const id = req.params.id;
    const game = await gameService.delete(id);
    res.json(game);
  }

  async create(req, res) {
    const { whiteId, blackId, control, bonusTime } = req.body;

    try {
      const game = await gameService.create(
        whiteId, blackId, 
        control, bonusTime
      );
      res.json(game);
    } catch {
      console.log(e);
      res.status(500).send('Internal server error');
    }
  }
}

module.exports = new GameController();