const cargoMiddleware = (...cargosPermitidos) => {
    return (req, res, next) => {
        const { cargo } = req.usuario;

        if (!cargosPermitidos.includes(cargo)) {
            return res.status(403).json({ sucesso: false, mensagem: 'Acesso negado: você não tem permissão para esta ação' });
        }

        next();
    };
};

export default cargoMiddleware;