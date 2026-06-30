import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';
import cargoMiddleware from '../middlewares/cargo.middleware.js';

const usuarioRoutes = Router();

usuarioRoutes.get('/', usuarioController.selecionar);
usuarioRoutes.get('/:id', usuarioController.selecionarPorId);

usuarioRoutes.post('/', cargoMiddleware('DIRETOR_FINANCEIRO'), usuarioController.criar);
usuarioRoutes.put('/:id', cargoMiddleware('DIRETOR_FINANCEIRO'), usuarioController.atualizar);
usuarioRoutes.delete('/:id', cargoMiddleware('DIRETOR_FINANCEIRO'), usuarioController.deletar);

export default usuarioRoutes;