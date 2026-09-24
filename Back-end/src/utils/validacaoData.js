export function isDataValida(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) {
        return false;
    }

    const [ano, mes, dia] = value.split('-').map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia));

    return data.getUTCFullYear() === ano
        && data.getUTCMonth() === mes - 1
        && data.getUTCDate() === dia;
}
