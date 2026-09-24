export function adicionarMeses(dataIso, quantidadeMeses) {
    const [ano, mes, dia] = dataIso.split('-').map(Number);
    const mesBase = mes - 1 + quantidadeMeses;
    const anoResultado = ano + Math.floor(mesBase / 12);
    const mesResultado = ((mesBase % 12) + 12) % 12;
    const ultimoDia = new Date(Date.UTC(anoResultado, mesResultado + 1, 0)).getUTCDate();
    const diaResultado = Math.min(dia, ultimoDia);

    return `${anoResultado}-${String(mesResultado + 1).padStart(2, '0')}-${String(diaResultado).padStart(2, '0')}`;
}

export function distribuirValor(total, quantidadeParcelas) {
    const totalCentavos = Math.round(Number(total) * 100);
    const centavosBase = Math.floor(totalCentavos / quantidadeParcelas);
    const centavosRestantes = totalCentavos % quantidadeParcelas;

    return Array.from({ length: quantidadeParcelas }, (_, indice) => {
        const centavos = centavosBase + (indice < centavosRestantes ? 1 : 0);
        return centavos / 100;
    });
}
