import { Usuario } from '../models/Usuarios.js';
import usuarioRepository from '../repositories/usuarioRepositories.js';

const usuarioController = {

    criar: async (req, res) => {
        try {
            const { nome, email, senha, cargo } = req.body;

            const emailEmUso = await usuarioRepository.existeEmail(email);
            if (emailEmUso) {
                return res.status(400).json({ message: 'E-mail já cadastrado' });
            }

            const usuario = Usuario.criar({ nome, email, senha, cargo });
            const result = await usuarioRepository.criar(usuario);

            res.status(201).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await usuarioRepository.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default usuarioController;