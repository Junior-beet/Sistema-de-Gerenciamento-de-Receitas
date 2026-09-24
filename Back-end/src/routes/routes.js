import { Router } from "express";

import authRoutes from './authRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import subcategoriaRoutes from './subcategoriaRoutes.js';
import senhaRoutes from './senhaRoutes.js';
import receitaRoutes from './receitaRoutes.js';
import despesaRoutes from './despesaRoutes.js';
import relatorioRoutes from './relatorioRoutes.js';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/senha', senhaRoutes);
routes.use('/usuarios', usuarioRoutes);
routes.use('/categorias', categoriaRoutes);
routes.use('/subcategorias', subcategoriaRoutes);
routes.use('/receitas', receitaRoutes);
routes.use('/despesas', despesaRoutes);
routes.use('/relatorios', relatorioRoutes);

export default routes;