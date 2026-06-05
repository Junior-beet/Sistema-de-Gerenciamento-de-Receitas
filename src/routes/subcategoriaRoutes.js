import { Router } from 'express';
import subcategoriaController from '../controllers/subcategoriaController.js';

const subcategoriaRoutes = Router();

subcategoriaRoutes.post('/', subcategoriaController.criar);
subcategoriaRoutes.get('/categoria/:id_categoria', subcategoriaController.selecionarPorCategoria);
subcategoriaRoutes.get('/:id', subcategoriaController.selecionarPorId);
subcategoriaRoutes.put('/:id', subcategoriaController.atualizar);
subcategoriaRoutes.delete('/:id', subcategoriaController.deletar);

export default subcategoriaRoutes;