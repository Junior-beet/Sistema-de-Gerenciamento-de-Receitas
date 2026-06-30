import { Router } from 'express';
import categoriaController from '../controllers/categoriaController.js';
import cargoMiddleware from '../middlewares/cargo.middleware.js';

const categoriaRoutes = Router();


categoriaRoutes.get('/usuario/:id_usuario', categoriaController.selecionar);
categoriaRoutes.get('/:id', categoriaController.selecionarPorId);


categoriaRoutes.post('/', cargoMiddleware('DIRETOR_FINANCEIRO'), categoriaController.criar);
categoriaRoutes.put('/:id', cargoMiddleware('DIRETOR_FINANCEIRO'), categoriaController.atualizar);
categoriaRoutes.delete('/:id', cargoMiddleware('DIRETOR_FINANCEIRO'), categoriaController.deletar);

export default categoriaRoutes;