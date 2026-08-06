import { Router } from "express";

import authRoutes from './authRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import subcategoriaRoutes from './subcategoriaRoutes.js';
import senhaRoutes from './senhaRoutes.js';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/senha', senhaRoutes);
routes.use('/usuarios', usuarioRoutes);
routes.use('/categorias', categoriaRoutes);
routes.use('/subcategorias', subcategoriaRoutes);

export default routes;