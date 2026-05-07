import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';

const usuarioRoutes = Router();

usuarioRoutes.post('/', usuarioController.criar);
usuarioRoutes.get('/', usuarioController.selecionar);

export default usuarioRoutes;