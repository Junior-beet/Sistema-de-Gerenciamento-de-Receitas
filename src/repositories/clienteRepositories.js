import {connection} from  '../configs/Database.js';

const clienteRepository = {
    
    criar: async (cliente, telefone, endereco) => {
    const conn = await connection.getConnection();

        try {
            conn.beginTransaction();
        const sqlCli = 'INSERT INTO clientes (nome, cpf) VALUES (?,?);';
        const valuesCli = [cliente.nome, cliente.cpf];
        const [rowsCli] = await conn.execute(sqlCli, valuesCli);

        const sqlTel = 'INSERT INTO telefones (id_cliente, numero) VALUES (?,?);';
        const valuesTel = [rowsCli.insertId, telefone.numero];
        const [rowsTel] = await conn.execute(sqlTel, valuesTel);

        const sqlEnd = 'INSERT INTO enderecos (id_cliente, cep, lougradoruo, numero, complemento, bairro, cidade, uf) VALUES (?,?,?,?,?,?,?,?);';
        const valuesEnd = [rowsCli.insertId, endereco.cep, endereco.lougradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf];
        const [rowsEnd] = await conn.execute(sqlEnd, valuesEnd);
        
        conn.commit();
        return {rowsCli, rowsTel, rowsEnd};
      } catch (error) {
        conn.rollback();
        throw new Error(error);
      }
      finally{
        conn.release();

      }
    },

     atualizar: async (cliente, telefone, endereco) => {
    const conn = await connection.getConnection();

        try {
            conn.beginTransaction();
        const sqlCli = 'UPDATE clientes SET nome=?, cpf=? WHERE id=?;';
        const valuesCli = [cliente.nome, cliente.cpf, cliente.id];
        const [rowsCli] = await conn.execute(sqlCli, valuesCli); 

        const sqlTel = 'UPDATE INTO telefones SET id_cliente=?, numero=? WHERE id=?;';
        const valuesTel = [rowsCli.insertId, telefone.numero];
        const [rowsTel] = await conn.execute(sqlTel, valuesTel);

        const sqlEnd = 'UPDATE INTO enderecos SET id_cliente=?, cep=?, lougradoruo=?, numero=?, complemento=?, bairro=?, cidade=?, uf=? WHERE id=?;';
        const valuesEnd = [rowsCli.insertId, endereco.cep, endereco.lougradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf];
        const [rowsEnd] = await conn.execute(sqlEnd, valuesEnd);
        
        conn.commit();
        return {rowsCli, rowsTel, rowsEnd};
      } catch (error) {
        conn.rollback();
        throw new Error(error);
      }
      finally{
        conn.release();
      }
    },

    deletar: async (cliente, telefone, endereco) => {
    const conn = await connection.getConnection();

        try {
        conn.beginTransaction();
        const sqlCli = 'DELETE FROM clientes WHERE id = ?;';
        const valuesCli = [cliente.id];
        const [rowsCli] = await connection.execute(sqlCli, valuesCli);

        const sqlTel = 'DELETE FROM telefones WHERE id=?;';
        const valuesTel = [rowsCli.insertId, telefone.id];
        const [rowsTel] = await conn.execute(sqlTel, valuesTel);

        const sqlEnd = 'DELETE FROM enderecos WHERE id=?;';
        const valuesEnd = [rowsCli.insertId, endereco.id];
        const [rowsEnd] = await conn.execute(sqlEnd, valuesEnd);
        
        conn.commit();
        return {rowsCli, rowsTel, rowsEnd};
      } catch (error) {
        conn.rollback();
        throw new Error(error);
      }
      finally{
        conn.release();

      }
    },

    selecionar: async () => {
    const conn = await connection.getConnection();

        try {
            conn.beginTransaction();
                const sql = `SELECT *
                            FROM clientes AS c 
                            INNER JOIN telefones AS t
                                ON c.id = t.id_cliente
                            INNER JOIN enderecos AS e
                                ON c.id = e.id_cliente
`;
                const [rows] = await conn.execute(sql)
      
        conn.commit();
        return {rows};
      } catch (error) {
        conn.rollback();
        throw new Error(error);
      }
      finally{
        conn.release();

      }
    }
}

export default clienteRepository