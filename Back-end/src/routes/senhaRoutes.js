import { Router } from 'express';
import senhaController from '../controllers/senhaController.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const senhaRoutes = Router();

senhaRoutes.post('/recuperar', senhaController.solicitarRecuperacao);
senhaRoutes.post('/redefinir', senhaController.redefinirSenha);

senhaRoutes.put('/trocar', authMiddleware, senhaController.trocarSenha);

export default senhaRoutes;