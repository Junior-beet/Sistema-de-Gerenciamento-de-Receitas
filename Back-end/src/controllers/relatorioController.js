import relatorioRepository from '../repositories/relatorioRepository.js';
import PDFDocument from 'pdfkit'; // biblioteca para gerar arquivos PDF
import { Parser } from 'json2csv'; // biblioteca para converter JSON em CSV
import fs from 'fs';
import path from 'path';

const relatorioController = {

    saldoPorConta: async (req, res) => {
        try {
            const id_conta = req.params.id_conta;

            if (!id_conta) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID da conta é obrigatório' });
            }

            const result = await relatorioRepository.saldoPorConta(id_conta, req.usuario.id_usuario);

            if (!result) {
                return res.status(404).json({ sucesso: false, mensagem: 'Conta não encontrada' });
            }

            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao calcular saldo', errorMessage: error.message });
        }
    },

    saldoTodasContas: async (req, res) => {
        try {
            const result = await relatorioRepository.saldoTodasContas(req.usuario.id_usuario);
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao calcular saldo', errorMessage: error.message });
        }
    },

    lucroPorPeriodo: async (req, res) => {
        try {
            // req.query → parâmetros passados na URL depois do ?
            const { data_inicio, data_fim } = req.query;

            if (!data_inicio || !data_fim) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe data_inicio e data_fim' });
            }

            const result = await relatorioRepository.lucroPorPeriodo(data_inicio, data_fim, req.usuario.id_usuario);

            res.status(200).json({
                sucesso: true,
                dados: {
                    ...result, // copia todas as propriedades de result
                    resultado: result.lucro >= 0 ? 'LUCRO' : 'PREJUIZO'
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao calcular lucro', errorMessage: error.message });
        }
    },

    relatorioMensal: async (req, res) => {
        try {
            const { ano, mes } = req.query;

            if (!ano || !mes) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe ano e mes' });
            }

            // Number() → converte string para número
            const result = await relatorioRepository.relatorioMensal(Number(ano), Number(mes), req.usuario.id_usuario);

            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao gerar relatório', errorMessage: error.message });
        }
    },

    exportarPDF: async (req, res) => {
        try {
            const { ano, mes } = req.query;

            if (!ano || !mes) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe ano e mes' });
            }

            const dados = await relatorioRepository.relatorioMensal(Number(ano), Number(mes), req.usuario.id_usuario);

            // PDFDocument → cria um documento PDF em memória
            const doc = new PDFDocument({ margin: 50 });

            const nomeArquivo = `relatorio_${ano}_${String(mes).padStart(2, '0')}.pdf`;
            const pastaRelatorios = path.resolve('relatorios');

            if (!fs.existsSync(pastaRelatorios)) fs.mkdirSync(pastaRelatorios);

            const caminhoArquivo = path.join(pastaRelatorios, nomeArquivo);

            // cria um "canal" de escrita para o arquivo
            const stream = fs.createWriteStream(caminhoArquivo);

            // doc.pipe(stream) → conecta o PDF ao arquivo — tudo que for adicionado ao doc vai para o arquivo
            doc.pipe(stream);

            // Construção do PDF, cada método encadeia o conteúdo
            doc.fontSize(20).font('Helvetica-Bold').text('Relatório Financeiro Mensal', { align: 'center' });
            doc.fontSize(12).font('Helvetica').text(`Período: ${String(mes).padStart(2, '0')}/${ano}`, { align: 'center' });
            doc.moveDown(2); // pula 2 linhas

            doc.fontSize(14).font('Helvetica-Bold').text('Resumo do Mês');
            doc.moveDown(0.5);
            doc.fontSize(12).font('Helvetica');
            doc.text(`Total de Receitas: R$ ${Number(dados.resumo.total_receitas).toFixed(2)}`);
            doc.text(`Total de Despesas: R$ ${Number(dados.resumo.total_despesas).toFixed(2)}`);
            doc.text(`${dados.resultado}: R$ ${Math.abs(Number(dados.resumo.lucro)).toFixed(2)}`);
            doc.text(`Saldo Geral (histórico): R$ ${Number(dados.saldo_geral).toFixed(2)}`);
            doc.moveDown(2);

            doc.fontSize(14).font('Helvetica-Bold').text('Movimentações do Período');
            doc.moveDown(0.5);

            if (dados.movimentacoes.length === 0) {
                doc.fontSize(12).font('Helvetica').text('Nenhuma movimentação no período.');
            } else {
                dados.movimentacoes.forEach((mov, i) => {
                    doc.fontSize(11).font('Helvetica-Bold').text(`${i + 1}. ${mov.tipo} — R$ ${Number(mov.valor).toFixed(2)}`);
                    doc.fontSize(10).font('Helvetica');
                    doc.text(`   Data: ${new Date(mov.data_lancamento).toLocaleDateString('pt-BR')}`);
                    doc.text(`   Descrição: ${mov.descricao || '—'}`);
                    doc.text(`   Categoria: ${mov.categoria || '—'}`);
                    doc.text(`   Forma de Pagamento: ${mov.forma_pagamento || '—'}`);
                    doc.moveDown(0.5);
                });
            }

            // doc.end() → finaliza o documento e fecha o stream
            doc.end();

            // stream.on('finish') → evento disparado quando o arquivo termina de ser escrito no disco
            // Só depois disso podemos enviar o arquivo para o usuário
            stream.on('finish', () => {
                // res.download() → força o navegador a baixar o arquivo em vez de abrir
                res.download(caminhoArquivo, nomeArquivo, (err) => {
                    if (err) console.log('Erro ao enviar PDF:', err);
                    // fs.unlinkSync → deleta o arquivo do servidor depois de enviar
                    // Evita acumular arquivos temporários
                    fs.unlinkSync(caminhoArquivo);
                });
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao exportar PDF', errorMessage: error.message });
        }
    },

    exportarCSV: async (req, res) => {
        try {
            const { ano, mes } = req.query;

            if (!ano || !mes) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe ano e mes' });
            }

            const dados = await relatorioRepository.relatorioMensal(Number(ano), Number(mes), req.usuario.id_usuario);

            // Define quais campos do JSON vão virar colunas no CSV
            const campos = ['tipo', 'valor', 'data_lancamento', 'descricao', 'categoria', 'subcategoria', 'forma_pagamento'];

            // Parser converte o array de objetos JSON em formato CSV
            const parser = new Parser({ fields: campos });
            const csv = parser.parse(dados.movimentacoes);

            // Define o tipo do conteúdo como CSV para o navegador entender
            res.header('Content-Type', 'text/csv');

            // res.attachment() → diz ao navegador para baixar o arquivo com esse nome
            res.attachment(`relatorio_${ano}_${String(mes).padStart(2, '0')}.csv`);

            // Envia o CSV diretamente na resposta sem salvar arquivo no servidor
            res.send(csv);

        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao exportar CSV', errorMessage: error.message });
        }
    }
};

export default relatorioController;