import categoriaRepository from '../repositories/categoriaRepository.js';
import contaRepository from '../repositories/contaRepository.js';
import subcategoriaRepository from '../repositories/subcategoriaRepository.js';

export async function validarLancamento({
    id_usuario,
    id_categoria,
    id_subcategoria,
    id_tipo,
}) {
    const [conta, categoria] = await Promise.all([
        contaRepository.selecionarContaEmpresa(),
        categoriaRepository.selecionarPorIdEUsuario(id_categoria, id_usuario),
    ]);

    if (!conta) {
        return {
            valido: false,
            status: 400,
            mensagem: 'Nenhuma conta empresarial cadastrada.',
        };
    }

    if (!categoria) {
        return {
            valido: false,
            status: 403,
            mensagem: 'A categoria selecionada não pertence ao usuário autenticado.',
        };
    }

    if (categoria.tipo !== id_tipo) {
        return {
            valido: false,
            status: 400,
            mensagem: 'O tipo da categoria não corresponde ao tipo do lançamento.',
        };
    }

    if (id_subcategoria) {
        const subcategoria = await subcategoriaRepository.selecionarPorIdEUsuario(
            id_subcategoria,
            id_usuario,
        );

        if (!subcategoria || subcategoria.id_categoria !== id_categoria) {
            return {
                valido: false,
                status: 403,
                mensagem: 'A subcategoria selecionada não pertence à categoria informada.',
            };
        }
    }

    return { valido: true, conta, categoria };
}
