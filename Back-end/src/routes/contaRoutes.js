import { Router } from 'express';

import contaController from '../controllers/contaController.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const contaRoutes = Router();

contaRoutes.get('/', authMiddleware, contaController.selecionar);

export default contaRoutes;
