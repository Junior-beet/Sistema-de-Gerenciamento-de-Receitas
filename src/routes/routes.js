import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes.js';
import saldoRoutes from './saldoRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';

const routes = Router();

routes.use('/usuarios', usuarioRoutes);
routes.use('/saldo', saldoRoutes);
routes.use('/categorias', categoriaRoutes);

export default routes;