import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes.js";
import saldoRoutes from "./saldoRoutes.js";

const routes = Router();

routes.use('/usuarios', usuarioRoutes);
routes.use('/saldo', saldoRoutes);

export default routes;