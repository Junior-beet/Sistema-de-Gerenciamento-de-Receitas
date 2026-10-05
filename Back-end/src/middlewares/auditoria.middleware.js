import fs from 'fs';
import path from 'path'; 

// Pedir para a Akila revisar se a os logs estão funcionando e verificar se exite bugs.

// Middleware de auditoria — registra todas as ações dos usuários em um arquivo .log
// Retorna uma função middleware (req, res, next) que o Express vai executar antes do controller
const auditoriaMiddleware = (acao) => {
    return (req, res, next) => {

        const usuario = req.usuario ? `${req.usuario.nome} (${req.usuario.cargo})` : 'Não autenticado';

        const data = new Date().toISOString(); // data e hora no formato internacional: 2026-07-10T19:00:00.000Z
        const metodo = req.method;
        const rota = req.originalUrl; // rota completa com query params ex: /relatorios/mensal?ano=2026&mes=7
        const ip = req.ip;

        const linha = `[${data}] | USUARIO: ${usuario} | ACAO: ${acao} | METODO: ${metodo} | ROTA: ${rota} | IP: ${ip}\n`;

        // path.resolve('logs') → transforma 'logs' no caminho absoluto da pasta
        const pastaLogs = path.resolve('logs');

        // Verifica se a pasta 'logs' existe — se não existir, cria ela
        if (!fs.existsSync(pastaLogs)) {
            fs.mkdirSync(pastaLogs);
        }

        // appendFileSync → adiciona a linha no final do arquivo sem apagar o conteúdo anterior
        fs.appendFileSync(path.join(pastaLogs, 'auditoria.log'), linha, 'utf8');

        // Sem isso a requisição trava e nunca chega no controller
        next();
    };
};

export default auditoriaMiddleware;