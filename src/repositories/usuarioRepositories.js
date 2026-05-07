import { connection } from '../configs/Database.js';

const usuarioRepository = {

    criar: async (usuario) => {
        const sql = 'INSERT INTO usuarios (nome, email, senha_usuario, cargo) VALUES (?, ?, ?, ?);';
        const values = [usuario.nome, usuario.email, usuario.senha, usuario.cargo];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    existeEmail: async (email) => {
        const sql = 'SELECT id_usuario FROM usuarios WHERE email = ?;';
        const [rows] = await connection.execute(sql, [email]);
        return rows.length > 0;
    },

    selecionar: async () => {
        const sql = 'SELECT id_usuario, nome, email, cargo FROM usuarios;';
        const [rows] = await connection.execute(sql);
        return rows;
    }
};

export default usuarioRepository;