import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';

const usuarioRoutes = Router();

usuarioRoutes.post('/', usuarioController.criar);
usuarioRoutes.get('/', usuarioController.selecionar);
usuarioRoutes.get('/:id', usuarioController.selecionarPorId);
usuarioRoutes.put('/:id', usuarioController.atualizar);
usuarioRoutes.delete('/:id', usuarioController.deletar);

export default usuarioRoutes;