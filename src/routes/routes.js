import { Router } from "express";
const routes = Router();

import authRoutes from './authRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import categoriaRoutes from "./categoriaRoutes.js";
import subcategoriaRoutes from "./subcategoriaRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js"

routes.use('/categorias', categoriaRoutes);
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
routes.use('/subcategorias', subcategoriaRoutes);
router.use('/usuarios', usuarioRoutes);

export default routes;