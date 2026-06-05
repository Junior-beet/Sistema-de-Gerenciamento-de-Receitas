import { Router } from "express";
const routes = Router();

import categoriaRoutes from "./categoriaRoutes.js";
import subcategoriaRoutes from "./subcategoriaRoutes.js";

routes.use('/categorias', categoriaRoutes);
routes.use('/subcategorias', subcategoriaRoutes);

export default routes;