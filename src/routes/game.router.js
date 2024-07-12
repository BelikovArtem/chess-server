const { Router } = require('express');
const gameController = require('../controllers/game.controller');
const router = new Router();

router,get('/games/:id', gameController.getOne);
router.get('/games/user/:id', gameController.getAllByUserId);
router.delete('/games/:id', gameController.delete);
router.put('/games', gameController.update);
router.post('/games', gameController.create);

module.exports = router;