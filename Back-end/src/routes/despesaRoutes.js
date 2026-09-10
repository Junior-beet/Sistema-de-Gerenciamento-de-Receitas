import { Router } from 'express';
import despesaController from '../controllers/despesaController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import cargoMiddleware from '../middlewares/cargo.middleware.js';

const despesaRoutes = Router();

despesaRoutes.get('/', authMiddleware, despesaController.selecionar);
despesaRoutes.get('/conta/:id_conta', authMiddleware, despesaController.selecionarPorConta);
despesaRoutes.get('/:id', authMiddleware, despesaController.selecionarPorId);
despesaRoutes.post('/', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), despesaController.criar);
despesaRoutes.put('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), despesaController.atualizar);
despesaRoutes.delete('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), despesaController.deletar);

export default despesaRoutes;