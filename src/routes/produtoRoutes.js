import { Router } from "express";
import produtosController from "../controllers/produtosController.js";
import uploadImage from "../middlewares/uploadImage.middleware.js";
const produtosRoutes = Router();

produtosRoutes.post('/', uploadImage, produtosController.criar);
produtosRoutes.put('/', uploadImage, produtosController.atualizar);
produtosRoutes.delete('/:id', produtosController.deletar);
produtosRoutes.get('/', produtosController.selecionar);

export default produtosRoutes;