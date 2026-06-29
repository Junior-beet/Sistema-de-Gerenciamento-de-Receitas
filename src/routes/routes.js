import { Router } from "express";
const routes = Router();

import categoriaRoutes from "./categoriaRoutes.js";
import subcategoriaRoutes from "./subcategoriaRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js"

routes.use('/categorias', categoriaRoutes);
routes.use('/subcategorias', subcategoriaRoutes);
router.use('/usuarios', usuarioRoutes);

export default routes;