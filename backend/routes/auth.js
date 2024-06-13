import express from 'express'
import {Register, Login } from '../controllers/AuthController.js'

const router = express.Router();


//to register
router.post('/register',Register);


//to login
router.post('/login',Login);

export default router;
