const { Router } = require('express');
const userController = require('../controllers/user.controller');
const router = new Router();

// get all users
router.get('/users', userController.getAll);
// get user data 
router.get('/users/:id', userController.getOne);
// delete user
router.delete('/users/:id', userController.delete);
// update one user field
router.put('/users', userController.updateField);
// create user 
router.post('/users', userController.create);

module.exports = router;