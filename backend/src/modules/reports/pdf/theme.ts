import { fileURLToPath } from 'node:url';
import type { MetricService } from '../../analytics/types/metrics-snapshot.types.js';

// Identidade visual do site (frontend/src/styles/theme.css) aplicada ao PDF.
export const colors = {
    // Tema escuro do site: capa e faixas de cabeçalho.
    night: '#050816',
    navy: '#0b1026',
    indigo: '#131a3a',
    headerTop: '#10283b',
    headerBottom: '#071522',
    emerald: '#34d399',
    emeraldLight: '#6ee7b7',
    mint: '#6ee7d1',
    cyan: '#22d3ee',
    snow: '#e8ecf8',
    haze: '#a3acc9',
    // Paleta mineral clara do site: páginas internas, boas para tela e impressão.
    paper: '#ffffff',
    mineral: '#f3faf7',
    tint: '#eaf3ee',
    border: '#d5e3dc',
    ink: '#172923',
    muted: '#60756b',
    primary: '#059669',
    deep: '#173d30',
};

export const statusStyles = {
    available: { label: 'Disponível', color: '#22c55e', surface: '#dcfce7', text: '#15803d' },
    metrics_missing: {
        label: 'Métricas ausentes',
        color: '#f59e0b',
        surface: '#fef3c7',
        text: '#b45309',
    },
    unavailable: { label: 'Indisponível', color: '#ef4444', surface: '#fee2e2', text: '#b91c1c' },
} satisfies Record<MetricService['status'], unknown>;

// Cada métrica usa uma cor da paleta de gráficos do site (chart-1 a chart-5).
export const metricStyles = {
    energy: { name: 'Energia estimada', short: 'Energia', unit: 'kWh', color: '#059669' },
    carbon: { name: 'Emissões estimadas', short: 'Emissões', unit: 'g CO2e', color: '#ea580c' },
    cpu: { name: 'CPU média', short: 'CPU', unit: '%', color: '#2563eb' },
    memory: { name: 'Memória média', short: 'Memória', unit: 'GB', color: '#db2777' },
    power: { name: 'Potência média', short: 'Potência', unit: 'W', color: '#ca8a04' },
} as const;

export type Metric = keyof typeof metricStyles;

// Métricas somadas no período; as demais são médias.
export const summedMetrics: readonly Metric[] = ['energy', 'carbon'];

const fontDir = new URL('../../../../assets/fonts/', import.meta.url);
export const fonts = {
    light: 'Geist-Light',
    regular: 'Geist-Regular',
    medium: 'Geist-Medium',
    semibold: 'Geist-SemiBold',
    bold: 'Geist-Bold',
    black: 'Geist-Black',
} as const;

export function registerFonts(pdf: PDFKit.PDFDocument) {
    for (const name of Object.values(fonts)) {
        pdf.registerFont(name, fileURLToPath(new URL(`${name}.ttf`, fontDir)));
    }
}

// Medidas da página A4 em pontos.
export const page = { width: 595.28, height: 841.89, margin: 40 };
export const contentWidth = page.width - 2 * page.margin;
export const headerHeight = 74;
export const contentTop = headerHeight + 26;
export const contentBottom = page.height - 54;

const fixed = (digits: number) =>
    new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: digits,
    });
const integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const significant = new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 3 });

// Formata sem notação científica, mantendo três dígitos significativos em valores pequenos.
export function formatNumber(value: number) {
    const size = Math.abs(value);
    if (size === 0) return '0';
    if (size >= 1000) return integer.format(value);
    if (size >= 100) return fixed(1).format(value);
    if (size >= 1) return fixed(2).format(value);
    if (size < 0.000001) return '< 0,000001';
    return significant.format(value);
}

export const formatInteger = (value: number) => integer.format(value);

// Escolhe a unidade mais legível para os destaques (Wh/kWh/MWh e g/kg/t).
export function formatMetric(metric: Metric, value: number) {
    if (metric === 'energy') {
        if (value >= 1000) return { value: formatNumber(value / 1000), unit: 'MWh' };
        if (value < 1) return { value: formatNumber(value * 1000), unit: 'Wh' };
    }
    if (metric === 'carbon') {
        if (value >= 1_000_000) return { value: formatNumber(value / 1_000_000), unit: 't CO2e' };
        if (value >= 1000) return { value: formatNumber(value / 1000), unit: 'kg CO2e' };
    }
    return { value: formatNumber(value), unit: metricStyles[metric].unit };
}

export const dateTime = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
});
export const longDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
});
export const axisTime = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
});

export const rangeLabels = {
    '1h': 'Última hora',
    '6h': 'Últimas 6 horas',
    '24h': 'Últimas 24 horas',
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
} as const;

export const cleanText = (value: string) => value.replaceAll('₂', '2').replace(/\s+/g, ' ').trim();
