import { Router } from 'express';
import subcategoriaController from '../controllers/subcategoriaController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import cargoMiddleware from '../middlewares/cargo.middleware.js';

const subcategoriaRoutes = Router();

subcategoriaRoutes.get('/categoria/:id_categoria', authMiddleware, subcategoriaController.selecionarPorCategoria);
subcategoriaRoutes.get('/:id', authMiddleware, subcategoriaController.selecionarPorId);

subcategoriaRoutes.post('/', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO', 'CEO'), subcategoriaController.criar);
subcategoriaRoutes.put('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO', 'CEO'), subcategoriaController.atualizar);
subcategoriaRoutes.delete('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO', 'CEO'), subcategoriaController.deletar);

export default subcategoriaRoutes;