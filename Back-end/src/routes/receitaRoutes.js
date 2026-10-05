import { Router } from 'express';
import receitaController from '../controllers/receitaController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import cargoMiddleware from '../middlewares/cargo.middleware.js';

const receitaRoutes = Router();

receitaRoutes.get('/', authMiddleware, receitaController.selecionar);
receitaRoutes.get('/conta/:id_conta', authMiddleware, receitaController.selecionarPorConta);
receitaRoutes.get('/:id', authMiddleware, receitaController.selecionarPorId);
receitaRoutes.post('/', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO', 'CEO'), receitaController.criar);
receitaRoutes.put('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO', 'CEO'), receitaController.atualizar);
receitaRoutes.delete('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO', 'CEO'), receitaController.deletar);

export default receitaRoutes;