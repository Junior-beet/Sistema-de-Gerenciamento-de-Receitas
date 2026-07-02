import { Router } from 'express';
import categoriaController from '../controllers/categoriaController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import cargoMiddleware from '../middlewares/cargo.middleware.js';

const categoriaRoutes = Router();

categoriaRoutes.get('/usuario/:id_usuario', authMiddleware, categoriaController.selecionar);
categoriaRoutes.get('/:id', authMiddleware, categoriaController.selecionarPorId);

categoriaRoutes.post('/', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), categoriaController.criar);
categoriaRoutes.put('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), categoriaController.atualizar);
categoriaRoutes.delete('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), categoriaController.deletar);

export default categoriaRoutes;