const gameFetcher = require('./game.fetcher');

class GameService {
  async getGameInfo(id) {
    return await gameFetcher.getGameInfo(id);
  }

  async getAllByUserId(userId) {
    return await gameFetcher.getAllByUserId(userId);
  }

  async delete(id) {
    return await gameFetcher.delete(id);
  }
 
  async create(whiteId, blackId, control, bonusTime) {
    return await gameFetcher.create(whiteId, blackId, control, bonusTime);
  }
}

module.exports = new GameService();