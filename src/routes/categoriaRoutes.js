import { Router } from 'express';
import categoriaController from '../controllers/categoriaController.js';

const categoriaRoutes = Router();

categoriaRoutes.post('/', categoriaController.criar);
categoriaRoutes.get('/usuario/:id_usuario', categoriaController.selecionar);
categoriaRoutes.get('/:id', categoriaController.selecionarPorId);
categoriaRoutes.put('/:id', categoriaController.atualizar);
categoriaRoutes.delete('/:id', categoriaController.deletar);

export default categoriaRoutes;