export const VALOR_MAXIMO = 99999999.99;

export function converterValor(valor) {
    const texto = String(valor || '').trim();

    if (!texto) {
        return Number.NaN;
    }

    const normalizado = texto.includes(',')
        ? texto.replace(/\./g, '').replace(',', '.')
        : texto;
    const numero = Number(normalizado);

    return Number.isFinite(numero) ? numero : Number.NaN;
}

export function isDataValida(valor) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor || '')) {
        return false;
    }

    const [ano, mes, dia] = valor.split('-').map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia));

    return data.getUTCFullYear() === ano
        && data.getUTCMonth() === mes - 1
        && data.getUTCDate() === dia;
}
