import { Router } from 'express';
import authController from '../controllers/authController.js';

const authRoutes = Router();

// Aberta — qualquer um pode fazer login
authRoutes.post('/login', authController.login);

export default authRoutes;