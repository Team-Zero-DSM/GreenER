import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { readStoredPainelConfig, writeStoredPainelConfig } from '../src/utils/painelStorage.ts';

const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
        localStorage: {
            getItem: (key: string) => storage.get(key) ?? null,
            setItem: (key: string, value: string) => storage.set(key, value),
        },
    },
});

beforeEach(() => storage.clear());
after(() => Reflect.deleteProperty(globalThis, 'window'));

test('uma conta nova não recebe o painel salvo por outra conta', () => {
    writeStoredPainelConfig('usuario-a', { template: 'em-branco', widgets: [] });

    assert.equal(readStoredPainelConfig('usuario-b'), null);
});

test('cada conta recupera sua própria configuração no mesmo navegador', () => {
    const first = { template: 'em-branco' as const, widgets: [] };
    const second = { template: 'visao-geral' as const, widgets: [] };
    writeStoredPainelConfig('usuario-a', first);
    writeStoredPainelConfig('usuario-b', second);

    assert.deepEqual(readStoredPainelConfig('usuario-a'), first);
    assert.deepEqual(readStoredPainelConfig('usuario-b'), second);
});

test('uma configuração antiga sem dono não é atribuída à conta autenticada', () => {
    storage.set('greener:painel:config', JSON.stringify({ template: 'em-branco', widgets: [] }));

    assert.equal(readStoredPainelConfig('usuario-a'), null);
});
