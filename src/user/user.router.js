const { Router } = require('express');
const userController = require('./user.controller');
const router = new Router();

// get all users
router.get('/users', userController.getMany);
// get user data 
router.get('/users/:id', userController.getOne);
// delete user
router.delete('/users/:id', userController.delete);
// update one user field
router.put('/users', userController.update);
// create user 
router.post('/users', userController.create);
// CORS preflight request
router.options('/users', userController.options);

module.exports = router;