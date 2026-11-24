import { describe, it, expect } from 'vitest';
import { createReportPdf } from '../../../../src/modules/reports/reports.pdf.js';
import { metricTotal } from '../../../../src/modules/reports/pdf/summary.js';
import { formatMetric, formatNumber } from '../../../../src/modules/reports/pdf/theme.js';
import type { MetricService } from '../../../../src/modules/analytics/types/metrics-snapshot.types.js';
import type { Report } from '../../../../src/modules/reports/types/reports.types.js';

const end = new Date('2026-11-23T15:00:00Z');
const start = new Date('2026-11-23T14:00:00Z');

function service(id: string, values: Partial<MetricService>): MetricService {
    return {
        id,
        name: `Serviço ${id}`,
        status: 'available',
        active: true,
        collectedAt: end,
        regionCode: 'sa-east-1',
        region: 'São Paulo',
        intensity: 61,
        samples: 10,
        energy: 1,
        carbon: 61,
        cpu: 20,
        memory: 2,
        power: 50,
        ...values,
    };
}

function report(visualization: Report['visualization'], services: MetricService[]): Report {
    return {
        range: '1h',
        start,
        end,
        services,
        points: [
            { time: start, samples: 2, energy: 0.5, carbon: 30, cpu: 10, memory: 1, power: 40 },
            {
                time: end,
                samples: 2,
                energy: null,
                carbon: null,
                cpu: null,
                memory: null,
                power: null,
            },
        ],
        title: 'Relatório de teste',
        metrics: ['energy', 'carbon', 'cpu', 'memory', 'power'],
        visualization,
    };
}

const pageCount = (pdf: Buffer) => pdf.toString('latin1').match(/\/Type \/Page\b/g)?.length ?? 0;

describe('Geração do PDF de relatório', () => {
    it.each(['line', 'bars', 'table'] as const)(
        'deve gerar um PDF válido com capa e conteúdo (%s)',
        async (visualization) => {
            const services = [
                service('a', {}),
                service('b', { status: 'unavailable', energy: null }),
            ];
            const pdf = await createReportPdf(report(visualization, services), end);

            expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
            expect(pdf.subarray(-20).toString()).toContain('%%EOF');
            expect(pageCount(pdf)).toBeGreaterThanOrEqual(visualization === 'table' ? 2 : 3);
        },
    );

    it('deve paginar a tabela quando houver muitos serviços', async () => {
        const services = Array.from({ length: 60 }, (_, index) => service(String(index), {}));
        const pdf = await createReportPdf(report('table', services), end);

        expect(pageCount(pdf)).toBeGreaterThanOrEqual(4);
    });

    it('deve gerar o PDF mesmo sem serviços ou amostras', async () => {
        const pdf = await createReportPdf({ ...report('line', []), points: [] }, end);

        expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });
});

describe('Indicadores do PDF', () => {
    it('deve somar energia e fazer média ponderada de CPU', () => {
        const services = [
            service('a', { energy: 1, cpu: 10, samples: 30 }),
            service('b', { energy: 2, cpu: 50, samples: 10 }),
            service('c', { energy: null, cpu: null, samples: 0 }),
        ];

        expect(metricTotal(services, 'energy')).toBe(3);
        expect(metricTotal(services, 'cpu')).toBe(20);
        expect(metricTotal([service('d', { energy: null })], 'energy')).toBeNull();
    });

    it('deve escolher a unidade mais legível nos destaques', () => {
        expect(formatMetric('energy', 0.25)).toEqual({ value: '250', unit: 'Wh' });
        expect(formatMetric('carbon', 2940)).toEqual({ value: '2,94', unit: 'kg CO2e' });
        expect(formatNumber(0.000312)).toBe('0,000312');
    });
});
