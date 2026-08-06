import bcrypt from 'bcrypt';
import crypto from 'crypto';
import transporter from '../configs/mailer.js';
import usuarioRepository from '../repositories/usuarioRepository.js';
import tokenRecuperacaoRepository from '../repositories/tokenRecuperacaoRepository.js';

const SALT_ROUNDS = 10;

const senhaController = {

    trocarSenha: async (req, res) => {
        try {
            const id_usuario = req.usuario.id_usuario;
            const { senha_atual, nova_senha, confirmar_senha } = req.body;

            if (!senha_atual || !nova_senha || !confirmar_senha) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos: senha_atual, nova_senha e confirmar_senha' });
            }

            if (nova_senha !== confirmar_senha) {
                return res.status(400).json({ sucesso: false, mensagem: 'A nova senha e a confirmação não conferem' });
            }

            if (nova_senha.length < 8) {
                return res.status(400).json({ sucesso: false, mensagem: 'A nova senha deve ter ao menos 8 caracteres' });
            }

            const usuario = await usuarioRepository.selecionarPorEmailComSenha(req.usuario.email);
            if (!usuario) {
                return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
            }

            const senhaCorreta = await bcrypt.compare(senha_atual, usuario.senha_usuario);
            if (!senhaCorreta) {
                return res.status(401).json({ sucesso: false, mensagem: 'Senha atual incorreta' });
            }

            const mesmaSenha = await bcrypt.compare(nova_senha, usuario.senha_usuario);
            if (mesmaSenha) {
                return res.status(400).json({ sucesso: false, mensagem: 'A nova senha deve ser diferente da senha atual' });
            }

            const novaSenhaHash = await bcrypt.hash(nova_senha, SALT_ROUNDS);
            await usuarioRepository.atualizarSenha(id_usuario, novaSenhaHash);

            res.status(200).json({ sucesso: true, mensagem: 'Senha alterada com sucesso' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao trocar senha', errorMessage: error.message });
        }
    },

    solicitarRecuperacao: async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe o e-mail' });
            }

            const usuario = await usuarioRepository.selecionarPorEmail(email);

            if (!usuario) {
                return res.status(200).json({ sucesso: true, mensagem: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve' });
            }

            await tokenRecuperacaoRepository.deletarExpirados(usuario.id_usuario);
            const token = crypto.randomBytes(32).toString('hex');
            const expiracao = new Date(Date.now() + 15 * 60 * 1000);
            const expiracaoFormatada = expiracao.toISOString().slice(0, 19).replace('T', ' ');

            await tokenRecuperacaoRepository.criar(usuario.id_usuario, token, expiracaoFormatada);

            const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

            await transporter.sendMail({
                from: `"Sistema Financeiro" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Recuperação de senha',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                        <h2 style="color: #1E3A5F;">Recuperação de Senha</h2>
                        <p>Olá, <strong>${usuario.nome}</strong>!</p>
                        <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para continuar:</p>
                        <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #1E3A5F; color: #fff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                            Redefinir minha senha
                        </a>
                        <p style="color: #888; font-size: 13px;">Este link expira em <strong>15 minutos</strong>.</p>
                        <p style="color: #888; font-size: 13px;">Se você não solicitou a recuperação, ignore este e-mail.</p>
                    </div>
                `
            });

            res.status(200).json({ sucesso: true, mensagem: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao solicitar recuperação de senha', errorMessage: error.message });
        }
    },

    redefinirSenha: async (req, res) => {
        try {
            const { token, nova_senha, confirmar_senha } = req.body;

            if (!token || !nova_senha || !confirmar_senha) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos: token, nova_senha e confirmar_senha' });
            }

            if (nova_senha !== confirmar_senha) {
                return res.status(400).json({ sucesso: false, mensagem: 'A nova senha e a confirmação não conferem' });
            }

            if (nova_senha.length < 8) {
                return res.status(400).json({ sucesso: false, mensagem: 'A nova senha deve ter ao menos 8 caracteres' });
            }

            const tokenEncontrado = await tokenRecuperacaoRepository.buscarPorToken(token);

            if (!tokenEncontrado) {
                return res.status(400).json({ sucesso: false, mensagem: 'Token inválido ou já utilizado' });
            }

            const agora = new Date();
            const expiracao = new Date(tokenEncontrado.expiracao);
            if (agora > expiracao) {
                return res.status(400).json({ sucesso: false, mensagem: 'Token expirado. Solicite uma nova recuperação de senha' });
            }

            const novaSenhaHash = await bcrypt.hash(nova_senha, SALT_ROUNDS);
            await usuarioRepository.atualizarSenha(tokenEncontrado.id_usuario, novaSenhaHash);
            await tokenRecuperacaoRepository.marcarComoUsado(token);

            res.status(200).json({ sucesso: true, mensagem: 'Senha redefinida com sucesso' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao redefinir senha', errorMessage: error.message });
        }
    }
};

export default senhaController;