import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usuarioRepository from '../repositories/usuarioRepository.js';

const authController = {
    login: async (req, res) => {
        try {
            const { email, senha_usuario } = req.body;

            if (!email || !senha_usuario) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: email e senha_usuario' });
            }

            const sql = `SELECT * FROM usuarios WHERE email = ?`;
            const usuario = await usuarioRepository.selecionarPorEmailComSenha(email);

            if (!usuario) {
                return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha inválidos' });
            }

            const senhaCorreta = await bcrypt.compare(senha_usuario, usuario.senha_usuario);

            if (!senhaCorreta) {
                return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha inválidos' });
            }

            const token = jwt.sign(
                {
                    id_usuario: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    cargo: usuario.cargo
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    cargo: usuario.cargo
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao realizar login', errorMessage: error.message });
        }
    }
};

export default authController;