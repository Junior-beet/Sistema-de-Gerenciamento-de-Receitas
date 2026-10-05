import test from 'node:test';
import assert from 'node:assert/strict';

import { adicionarMeses, distribuirValor } from './financeiro.js';
import { isDataValida } from './validacaoData.js';

test('valida datas reais no formato ISO', () => {
    assert.equal(isDataValida('2026-09-24'), true);
    assert.equal(isDataValida('2024-02-29'), true);
    assert.equal(isDataValida('2026-02-29'), false);
    assert.equal(isDataValida('24/09/2026'), false);
});

test('adiciona meses sem deslocamento de timezone', () => {
    assert.equal(adicionarMeses('2026-07-01', 1), '2026-08-01');
    assert.equal(adicionarMeses('2026-12-15', 1), '2027-01-15');
    assert.equal(adicionarMeses('2026-01-31', 1), '2026-02-28');
});

test('distribui centavos sem perder o total', () => {
    assert.deepEqual(distribuirValor(100, 3), [33.34, 33.33, 33.33]);
    assert.equal(distribuirValor(100, 3).reduce((soma, valor) => soma + valor, 0), 100);
});
