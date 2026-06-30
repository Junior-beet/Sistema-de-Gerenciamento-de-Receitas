import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import cargoMiddleware from "../middlewares/cargo.middleware.js";

import authRoutes from './authRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import subcategoriaRoutes from './subcategoriaRoutes.js';
import senhaRoutes from './senhaRoutes.js';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/senha', senhaRoutes);
routes.use('/usuarios', authMiddleware, usuarioRoutes);
routes.use('/categorias', authMiddleware, categoriaRoutes);
routes.use('/subcategorias', authMiddleware, subcategoriaRoutes);

export default routes;