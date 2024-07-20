const { Router } = require('express');
const gameController = require('./game.controller');
const router = new Router();

// get game info by id 
router.get('/games/:id', gameController.getGameInfo);
// get all user`s games
router.get('/games/user/:id', gameController.getAllByUserId);
// delete game
router.delete('/games/:id', gameController.delete);
// update game info
//router.put('/games', gameController.updateField);
// create new game
router.post('/games', gameController.create);

module.exports = router;