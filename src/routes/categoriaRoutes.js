import {Router} from "express";
import categoriaController from "../controllers/CategoriaController.js";
const categoriaRoutes = Router();

categoriaRoutes.post('/', categoriaController.criar);
categoriaRoutes.put('/', categoriaController.atualizar);
categoriaRoutes.delete('/:id', categoriaController.deletar);
categoriaRoutes.get('/', categoriaController.selecionar)

export default categoriaRoutes;