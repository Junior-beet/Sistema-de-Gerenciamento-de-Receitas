import { Router } from 'express';
import subcategoriaController from '../controllers/subcategoriaController.js';
import cargoMiddleware from '../middlewares/cargo.middleware.js';

const subcategoriaRoutes = Router();

subcategoriaRoutes.get('/categoria/:id_categoria', subcategoriaController.selecionarPorCategoria);
subcategoriaRoutes.get('/:id', subcategoriaController.selecionarPorId);

subcategoriaRoutes.post('/', cargoMiddleware('DIRETOR_FINANCEIRO'), subcategoriaController.criar);
subcategoriaRoutes.put('/:id', cargoMiddleware('DIRETOR_FINANCEIRO'), subcategoriaController.atualizar);
subcategoriaRoutes.delete('/:id', cargoMiddleware('DIRETOR_FINANCEIRO'), subcategoriaController.deletar);

export default subcategoriaRoutes;