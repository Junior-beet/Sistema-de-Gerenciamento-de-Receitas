import categoriaRepository from '../repositories/categoriaRepository.js';
import contaRepository from '../repositories/contaRepository.js';
import subcategoriaRepository from '../repositories/subcategoriaRepository.js';

export async function validarLancamento({
    id_categoria,
    id_subcategoria,
    id_tipo,
    id_usuario,
}) {
    const [conta, categoria] = await Promise.all([
        contaRepository.selecionarContaEmpresa(id_usuario),
        categoriaRepository.selecionarPorId(id_categoria),
    ]);

    if (!conta) {
        return {
            valido: false,
            status: 400,
            mensagem: 'Nenhuma conta empresarial cadastrada para este usuário.',
        };
    }

    if (!categoria) {
        return {
            valido: false,
            status: 404,
            mensagem: 'A categoria selecionada não existe.',
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
        const subcategoria = await subcategoriaRepository.selecionarPorId(id_subcategoria);

        if (!subcategoria) {
            return {
                valido: false,
                status: 404,
                mensagem: 'A subcategoria selecionada não existe.',
            };
        }

        if (String(subcategoria.id_categoria) !== String(id_categoria)) {
            return {
                valido: false,
                status: 400,
                mensagem: 'A subcategoria selecionada não pertence à categoria informada.',
            };
        }
    }

    return { valido: true, conta, categoria };
}