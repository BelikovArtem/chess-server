const { Router } = require('express');
const authController = require('./auth.controller');
const router = new Router();

// sign up user 
router.post('/signup', authController.signUp);
// sign in user
router.post('/signin', authController.signIn);
// sign out user
router.get('/signout', authController.signOut);
// CORS preflight request
router.options('/*', authController.cors);
// refresh token
router.get('/refresh', authController.refreshToken);

module.exports = router;