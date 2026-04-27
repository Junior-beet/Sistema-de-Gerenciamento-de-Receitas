import { Router } from "express";
import categoriaRoutes from "./categoriaRoutes.js";
import produtoRoutes from "./produtoRoutes.js"
import clienteRoutes from "./clienteRoutes.js";

const routes = Router();

routes.use('/categorias', categoriaRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/clientes', clienteRoutes);

export default routes;