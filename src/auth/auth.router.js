import { Router } from 'express';
import AuthController from './auth.controller.js';
const router = new Router();

// sign up user 
router.post('/signup', AuthController.signUp);
// sign in user
router.post('/signin', AuthController.signIn);
// sign out user
router.get('/signout', AuthController.signOut);
// CORS preflight request
router.options('/*', AuthController.cors);
// refresh token
router.get('/refresh', AuthController.refreshToken);

export default router;