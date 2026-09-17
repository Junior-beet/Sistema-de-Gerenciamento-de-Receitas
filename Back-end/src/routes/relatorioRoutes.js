import { Router } from 'express';
import relatorioController from '../controllers/relatorioController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import auditoriaMiddleware from '../middlewares/auditoria.middleware.js';

const relatorioRoutes = Router();

relatorioRoutes.get('/saldo', authMiddleware, auditoriaMiddleware('CONSULTA_SALDO_TODAS_CONTAS'), relatorioController.saldoTodasContas);
relatorioRoutes.get('/saldo/:id_conta', authMiddleware, auditoriaMiddleware('CONSULTA_SALDO_CONTA'), relatorioController.saldoPorConta);
relatorioRoutes.get('/lucro', authMiddleware, auditoriaMiddleware('CONSULTA_LUCRO'), relatorioController.lucroPorPeriodo);
relatorioRoutes.get('/mensal', authMiddleware, auditoriaMiddleware('CONSULTA_RELATORIO_MENSAL'), relatorioController.relatorioMensal);
relatorioRoutes.get('/exportar/pdf', authMiddleware, auditoriaMiddleware('EXPORTACAO_PDF'), relatorioController.exportarPDF);
relatorioRoutes.get('/exportar/csv', authMiddleware, auditoriaMiddleware('EXPORTACAO_CSV'), relatorioController.exportarCSV);

export default relatorioRoutes;