import { Router } from 'express';
import saldoController from '../controllers/saldoController.js';

const saldoRoutes = Router();

saldoRoutes.get('/:usuarioId', saldoController.selecionar);

export default saldoRoutes;