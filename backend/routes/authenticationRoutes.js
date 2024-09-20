import express from 'express';
import { login, register, me, callbackGoogle } from '../controllers/authentication.controller.js';
import authorization from '../middleware/authorization.js';
import passport from 'passport';
import uploadCloudinary from '../middleware/uploadCloudinary.js';

const authenticationRouter = express.Router();

authenticationRouter.post('/register', uploadCloudinary.single('avatar'), register);
authenticationRouter.post('/login', login);
authenticationRouter.get('/me', authorization, me);

authenticationRouter.get('/login-google', passport.authenticate('google', { scope: ['profile', 'email'] }));//qui chiamo middleware che ci ridereziona pagina google
authenticationRouter.get('/callback-google', passport.authenticate('google', {session: false}), callbackGoogle); //session false serve per disattivare i cookies

export default authenticationRouter