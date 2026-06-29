import { connection } from '../configs/Database.js';

const usuarioRepository = {
    criar: async (usuario) => {
        const sql = `INSERT INTO usuarios (nome, email, senha_usuario, cargo) VALUES (?, ?, ?, ?)`;
        const values = [usuario.nome, usuario.email, usuario.senha_usuario, usuario.cargo];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = `SELECT id_usuario, nome, email, cargo, data_criacao FROM usuarios`;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorId: async (id_usuario) => {
        const sql = `SELECT id_usuario, nome, email, cargo, data_criacao FROM usuarios WHERE id_usuario = ?`;
        const [rows] = await connection.execute(sql, [id_usuario]);
        return rows[0] || null;
    },

    selecionarPorEmail: async (email) => {
        const sql = `SELECT id_usuario, nome, email, cargo, data_criacao FROM usuarios WHERE email = ?`;
        const [rows] = await connection.execute(sql, [email]);
        return rows[0] || null;
    },

    selecionarPorEmailComSenha: async (email) => {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    const [rows] = await connection.execute(sql, [email]);
    return rows[0] || null;
},

    buscarPorCargo: async (cargo) => {
        const sql = `SELECT id_usuario FROM usuarios WHERE cargo = ?`;
        const [rows] = await connection.execute(sql, [cargo]);
        return rows[0] || null;
    },

    atualizar: async (usuario) => {
        const sql = `UPDATE usuarios SET nome = ?, email = ?, cargo = ? WHERE id_usuario = ?`;
        const values = [usuario.nome, usuario.email, usuario.cargo, usuario.id_usuario];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id_usuario) => {
        const sql = `DELETE FROM usuarios WHERE id_usuario = ?`;
        const [rows] = await connection.execute(sql, [id_usuario]);
        return rows;
    }
};

export default usuarioRepository;