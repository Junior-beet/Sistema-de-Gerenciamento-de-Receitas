import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import cargoMiddleware from '../middlewares/cargo.middleware.js';

const usuarioRoutes = Router();

usuarioRoutes.post('/', usuarioController.criar);

usuarioRoutes.get('/', authMiddleware, usuarioController.selecionar);
usuarioRoutes.get('/:id', authMiddleware, usuarioController.selecionarPorId);

usuarioRoutes.put('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), usuarioController.atualizar);
usuarioRoutes.delete('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), usuarioController.deletar);

export default usuarioRoutes;