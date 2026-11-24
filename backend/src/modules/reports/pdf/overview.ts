import type { Report } from '../types/reports.types.js';
import { drawCard, drawSectionTitle } from './layout.js';
import {
    highlightMetric,
    metricTotal,
    regionTotals,
    statusCounts,
    totalSamples,
} from './summary.js';
import {
    cleanText,
    colors,
    contentWidth,
    fonts,
    formatInteger,
    formatMetric,
    formatNumber,
    metricStyles,
    page,
    statusStyles,
    summedMetrics,
} from './theme.js';

const { margin } = page;

// Página de visão geral: indicadores, status, regiões e maiores consumidores.
export function drawOverview(pdf: PDFKit.PDFDocument, report: Report, top: number) {
    let y = drawSectionTitle(
        pdf,
        top,
        'Visão geral',
        'Indicadores consolidados de todos os serviços selecionados no período.',
    );
    y = drawMetricCards(pdf, report, y) + 18;

    const half = (contentWidth - 14) / 2;
    const blockHeight = 204;
    drawStatusCard(pdf, report, margin, y, half, blockHeight);
    drawRegionCard(pdf, report, margin + half + 14, y, half, blockHeight);
    y += blockHeight + 18;
    return drawRanking(pdf, report, y);
}

function drawMetricCards(pdf: PDFKit.PDFDocument, report: Report, top: number) {
    const gap = 10;
    const perRow = Math.min(report.metrics.length, 3);
    const width = (contentWidth - gap * (perRow - 1)) / perRow;
    const height = 84;
    report.metrics.forEach((metric, index) => {
        const row = Math.floor(index / perRow);
        const x = margin + (index % perRow) * (width + gap);
        const y = top + row * (height + gap);
        const style = metricStyles[metric];
        const total = metricTotal(report.services, metric);
        const label = total === null ? null : formatMetric(metric, total);
        drawCard(pdf, x, y, width, height);
        pdf.save();
        pdf.roundedRect(x, y, width, height, 10).clip();
        pdf.rect(x, y, 4, height).fill(style.color);
        pdf.restore();
        pdf.font(fonts.semibold)
            .fontSize(7.5)
            .fillColor(colors.muted)
            .text(style.name.toUpperCase(), x + 16, y + 14, {
                characterSpacing: 1,
                lineBreak: false,
            });
        pdf.font(fonts.bold)
            .fontSize(23)
            .fillColor(colors.ink)
            .text(label?.value ?? '—', x + 16, y + 30, { lineBreak: false });
        const valueWidth = pdf.widthOfString(label?.value ?? '—');
        if (label) {
            pdf.font(fonts.medium)
                .fontSize(10)
                .fillColor(style.color)
                .text(label.unit, x + 20 + valueWidth, y + 42, { lineBreak: false });
        }
        pdf.font(fonts.regular)
            .fontSize(8)
            .fillColor(colors.muted)
            .text(
                summedMetrics.includes(metric) ? 'Soma no período' : 'Média ponderada por amostra',
                x + 16,
                y + 64,
                { lineBreak: false },
            );
    });
    // Completa a última linha com cartões de cobertura (serviços e amostras).
    const extras = [
        {
            label: 'AMOSTRAS COLETADAS',
            value: formatInteger(totalSamples(report)),
            note: 'Leituras usadas no cálculo',
        },
        {
            label: 'SERVIÇOS',
            value: formatInteger(report.services.length),
            note: 'Selecionados no relatório',
        },
    ];
    const free = (perRow - (report.metrics.length % perRow)) % perRow;
    extras.slice(0, free).forEach((extra, offset) => {
        const index = report.metrics.length + offset;
        const x = margin + (index % perRow) * (width + gap);
        const y = top + Math.floor(index / perRow) * (height + gap);
        pdf.roundedRect(x, y, width, height, 10).fill(colors.mineral);
        pdf.font(fonts.semibold)
            .fontSize(7.5)
            .fillColor(colors.muted)
            .text(extra.label, x + 16, y + 14, { characterSpacing: 1, lineBreak: false });
        pdf.font(fonts.bold)
            .fontSize(23)
            .fillColor(colors.deep)
            .text(extra.value, x + 16, y + 30, { lineBreak: false });
        pdf.font(fonts.regular)
            .fontSize(8)
            .fillColor(colors.muted)
            .text(extra.note, x + 16, y + 64, { lineBreak: false });
    });
    const rows = Math.ceil(report.metrics.length / perRow);
    return top + rows * height + (rows - 1) * gap;
}

function drawStatusCard(
    pdf: PDFKit.PDFDocument,
    report: Report,
    x: number,
    y: number,
    width: number,
    height: number,
) {
    drawCard(pdf, x, y, width, height);
    pdf.font(fonts.bold)
        .fontSize(11.5)
        .fillColor(colors.ink)
        .text('Status dos serviços', x + 16, y + 15, { lineBreak: false });
    pdf.font(fonts.regular)
        .fontSize(8)
        .fillColor(colors.muted)
        .text('Situação registrada na última coleta de cada serviço.', x + 16, y + 32, {
            width: width - 32,
            lineBreak: false,
        });

    const counts = statusCounts(report.services);
    const total = report.services.length || 1;
    const cx = x + 70;
    const cy = y + 118;
    const outer = 46;
    const inner = 31;
    let angle = -Math.PI / 2;
    pdf.circle(cx, cy, outer).fill(colors.tint);
    for (const [status, count] of Object.entries(counts)) {
        if (!count) continue;
        const sweep = (count / total) * Math.PI * 2;
        drawRingSlice(pdf, cx, cy, outer, angle, angle + sweep);
        pdf.fill(statusStyles[status as keyof typeof counts].color);
        angle += sweep;
    }
    pdf.circle(cx, cy, inner).fill(colors.paper);
    pdf.font(fonts.bold)
        .fontSize(18)
        .fillColor(colors.ink)
        .text(formatInteger(report.services.length), cx - 30, cy - 13, {
            width: 60,
            align: 'center',
            lineBreak: false,
        });
    pdf.font(fonts.regular)
        .fontSize(7)
        .fillColor(colors.muted)
        .text('serviços', cx - 30, cy + 7, { width: 60, align: 'center', lineBreak: false });

    let legendY = y + 74;
    const legendX = x + 136;
    for (const [status, count] of Object.entries(counts)) {
        const style = statusStyles[status as keyof typeof counts];
        pdf.roundedRect(legendX, legendY + 2, 8, 8, 2).fill(style.color);
        pdf.font(fonts.medium)
            .fontSize(9)
            .fillColor(colors.ink)
            .text(style.label, legendX + 14, legendY, { lineBreak: false });
        pdf.font(fonts.regular)
            .fontSize(8)
            .fillColor(colors.muted)
            .text(
                `${formatInteger(count)} · ${Math.round((count / total) * 100)}%`,
                legendX + 14,
                legendY + 12,
                { lineBreak: false },
            );
        legendY += 30;
    }
}

function drawRingSlice(
    pdf: PDFKit.PDFDocument,
    cx: number,
    cy: number,
    radius: number,
    start: number,
    end: number,
) {
    const steps = Math.max(2, Math.ceil(((end - start) / Math.PI) * 40));
    pdf.moveTo(cx, cy);
    for (let step = 0; step <= steps; step++) {
        const angle = start + ((end - start) * step) / steps;
        pdf.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
    pdf.closePath();
}

function drawRegionCard(
    pdf: PDFKit.PDFDocument,
    report: Report,
    x: number,
    y: number,
    width: number,
    height: number,
) {
    const metric = highlightMetric(report);
    const style = metricStyles[metric];
    drawCard(pdf, x, y, width, height);
    pdf.font(fonts.bold)
        .fontSize(11.5)
        .fillColor(colors.ink)
        .text(`${style.short} por região`, x + 16, y + 15, { lineBreak: false });
    pdf.font(fonts.regular)
        .fontSize(8)
        .fillColor(colors.muted)
        .text(style.unit, x + 16, y + 17, { width: width - 32, align: 'right', lineBreak: false });

    const regions = regionTotals(report.services, metric);
    const visible = regions.slice(0, 4);
    const max = Math.max(...visible.map((region) => region.value)) || 1;
    let rowY = y + 46;
    for (const region of visible) {
        pdf.font(fonts.semibold)
            .fontSize(9)
            .fillColor(colors.ink)
            .text(cleanText(region.name), x + 16, rowY, {
                width: width - 110,
                height: 12,
                ellipsis: true,
                lineBreak: false,
            });
        pdf.font(fonts.medium)
            .fontSize(9)
            .fillColor(colors.ink)
            .text(formatNumber(region.value), x + 16, rowY, {
                width: width - 32,
                align: 'right',
                lineBreak: false,
            });
        const barWidth = width - 32;
        pdf.roundedRect(x + 16, rowY + 15, barWidth, 6, 3).fill(colors.tint);
        if (region.value > 0) {
            const bar = pdf.linearGradient(x + 16, 0, x + 16 + barWidth, 0);
            bar.stop(0, colors.primary).stop(1, colors.cyan);
            pdf.roundedRect(
                x + 16,
                rowY + 15,
                Math.max(6, (barWidth * region.value) / max),
                6,
                3,
            ).fill(bar);
        }
        pdf.font(fonts.regular)
            .fontSize(7)
            .fillColor(colors.muted)
            .text(
                `${region.code} · ${formatInteger(region.services)} serviço(s) · ${formatInteger(region.intensity)} g CO2e/kWh`,
                x + 16,
                rowY + 24,
                { lineBreak: false },
            );
        rowY += 38;
    }
    if (regions.length > visible.length) {
        pdf.font(fonts.regular)
            .fontSize(7.5)
            .fillColor(colors.muted)
            .text(`+ ${regions.length - visible.length} região(ões) na tabela`, x + 16, rowY, {
                lineBreak: false,
            });
    }
}

// Ranking dos cinco serviços com maior valor na métrica de destaque.
function drawRanking(pdf: PDFKit.PDFDocument, report: Report, top: number) {
    const metric = highlightMetric(report);
    const style = metricStyles[metric];
    const ranked = report.services
        .filter((service) => (service[metric] ?? 0) > 0)
        .sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0))
        .slice(0, 5);
    if (!ranked.length) return top;

    const total = metricTotal(report.services, metric) ?? 0;
    const max = ranked[0][metric] ?? 1;
    const rowHeight = 30;
    const height = 46 + ranked.length * rowHeight + 8;
    drawCard(pdf, margin, top, contentWidth, height);
    pdf.font(fonts.bold)
        .fontSize(11.5)
        .fillColor(colors.ink)
        .text(
            summedMetrics.includes(metric)
                ? `Maiores contribuições · ${style.short}`
                : `Maiores médias · ${style.short}`,
            margin + 16,
            top + 15,
            { lineBreak: false },
        );
    pdf.font(fonts.regular)
        .fontSize(8)
        .fillColor(colors.muted)
        .text(style.unit, margin + 16, top + 17, {
            width: contentWidth - 32,
            align: 'right',
            lineBreak: false,
        });

    const nameWidth = 170;
    const barLeft = margin + 52 + nameWidth;
    const valueWidth = 110;
    const barWidth = contentWidth - (barLeft - margin) - valueWidth - 16;
    ranked.forEach((service, index) => {
        const y = top + 44 + index * rowHeight;
        const value = service[metric] ?? 0;
        const badge = pdf.linearGradient(margin + 16, y, margin + 38, y + 22);
        badge
            .stop(0, index === 0 ? colors.emerald : colors.tint)
            .stop(1, index === 0 ? colors.cyan : colors.tint);
        pdf.roundedRect(margin + 16, y, 24, 22, 6).fill(badge);
        pdf.font(fonts.bold)
            .fontSize(10)
            .fillColor(index === 0 ? colors.night : colors.deep)
            .text(String(index + 1), margin + 16, y + 6, {
                width: 24,
                align: 'center',
                lineBreak: false,
            });
        pdf.font(fonts.semibold)
            .fontSize(9.5)
            .fillColor(colors.ink)
            .text(cleanText(service.name), margin + 50, y + 1, {
                width: nameWidth - 6,
                height: 12,
                ellipsis: true,
                lineBreak: false,
            });
        pdf.font(fonts.regular)
            .fontSize(7.5)
            .fillColor(colors.muted)
            .text(cleanText(`${service.region} (${service.regionCode})`), margin + 50, y + 13, {
                width: nameWidth - 6,
                height: 10,
                ellipsis: true,
                lineBreak: false,
            });
        pdf.roundedRect(barLeft, y + 7, barWidth, 8, 4).fill(colors.tint);
        pdf.roundedRect(barLeft, y + 7, Math.max(8, (barWidth * value) / max), 8, 4).fill(
            style.color,
        );
        const share =
            summedMetrics.includes(metric) && total > 0
                ? `  ·  ${Math.round((value / total) * 100)}%`
                : '';
        pdf.font(fonts.semibold)
            .fontSize(9)
            .fillColor(colors.ink)
            .text(
                `${formatNumber(value)}${share}`,
                margin + contentWidth - 16 - valueWidth,
                y + 5,
                {
                    width: valueWidth,
                    align: 'right',
                    lineBreak: false,
                },
            );
    });
    return top + height + 18;
}
