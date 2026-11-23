import type { Report } from '../types/reports.types.js';
import { addContentPage, drawCard, drawSectionTitle } from './layout.js';
import { metricTotal } from './summary.js';
import {
    axisTime,
    cleanText,
    colors,
    contentBottom,
    contentWidth,
    fonts,
    formatMetric,
    formatNumber,
    metricStyles,
    page,
    summedMetrics,
    type Metric,
} from './theme.js';

const { margin } = page;

// Gráficos de área por métrica, em grade de duas colunas.
export function drawTimelines(pdf: PDFKit.PDFDocument, report: Report, top: number) {
    let y = drawSectionTitle(
        pdf,
        top,
        'Evolução no período',
        'Soma de todos os serviços em cada intervalo (médias para CPU, memória e potência).',
    );
    const gap = 14;
    const columns = report.metrics.length === 1 ? 1 : 2;
    const width = (contentWidth - gap * (columns - 1)) / columns;
    const height = columns === 1 ? 230 : 196;
    report.metrics.forEach((metric, index) => {
        const column = index % columns;
        if (column === 0 && index > 0) y += height + gap;
        if (y + height > contentBottom) {
            y = addContentPage(pdf, 'Evolução no período', report.title);
        }
        // Quando sobra um gráfico sozinho na última linha, ele ocupa a largura toda.
        const alone = columns === 2 && column === 0 && index === report.metrics.length - 1;
        drawTimeline(
            pdf,
            report,
            metric,
            margin + column * (width + gap),
            y,
            alone ? contentWidth : width,
            height,
        );
    });
    return y + height + 22;
}

function niceStep(max: number, intervals: number) {
    const target = max / intervals || 1;
    const magnitude = 10 ** Math.floor(Math.log10(target));
    return ([1, 2, 2.5, 5, 10].find((value) => value >= target / magnitude) ?? 10) * magnitude;
}

function drawTimeline(
    pdf: PDFKit.PDFDocument,
    report: Report,
    metric: Metric,
    x: number,
    y: number,
    width: number,
    height: number,
) {
    const style = metricStyles[metric];
    drawCard(pdf, x, y, width, height);
    pdf.circle(x + 19, y + 21, 4).fill(style.color);
    pdf.font(fonts.bold)
        .fontSize(11)
        .fillColor(colors.ink)
        .text(style.name, x + 29, y + 14, { lineBreak: false });
    pdf.font(fonts.regular)
        .fontSize(8)
        .fillColor(colors.muted)
        .text(style.unit, x + 14, y + 16, { width: width - 28, align: 'right', lineBreak: false });

    const values = report.points
        .map((point) => point[metric])
        .filter((value): value is number => value !== null);
    if (!values.length) {
        pdf.roundedRect(x + 14, y + 44, width - 28, height - 58, 8).fill(colors.mineral);
        pdf.font(fonts.medium)
            .fontSize(9)
            .fillColor(colors.muted)
            .text('Sem amostras no período.', x + 14, y + height / 2, {
                width: width - 28,
                align: 'center',
                lineBreak: false,
            });
        return;
    }

    // Faixa de estatísticas: total (ou média), pico e mínimo.
    const total = metricTotal(report.services, metric);
    const stats = [
        {
            label: summedMetrics.includes(metric) ? 'Total' : 'Média',
            value: total === null ? '—' : Object.values(formatMetric(metric, total)).join(' '),
        },
        { label: 'Pico', value: formatNumber(Math.max(...values)) },
        { label: 'Mínimo', value: formatNumber(Math.min(...values)) },
    ];
    const statWidth = (width - 28) / stats.length;
    stats.forEach((stat, index) => {
        const statX = x + 14 + index * statWidth;
        pdf.font(fonts.regular)
            .fontSize(7)
            .fillColor(colors.muted)
            .text(stat.label.toUpperCase(), statX, y + 36, {
                characterSpacing: 0.8,
                lineBreak: false,
            });
        pdf.font(fonts.semibold)
            .fontSize(9.5)
            .fillColor(colors.ink)
            .text(stat.value, statX, y + 46, {
                width: statWidth - 6,
                height: 12,
                ellipsis: true,
                lineBreak: false,
            });
    });

    const left = x + 50;
    const right = x + width - 14;
    const top = y + 72;
    const bottom = y + height - 26;
    const intervals = 4;
    const step = niceStep(Math.max(...values), intervals);
    const scale = step * intervals;
    pdf.font(fonts.regular).fontSize(7);
    for (let tick = 0; tick <= intervals; tick++) {
        const row = bottom - ((bottom - top) * tick) / intervals;
        pdf.moveTo(left, row).lineTo(right, row).lineWidth(0.5).strokeColor(colors.border);
        if (tick) pdf.dash(2, { space: 2 });
        pdf.stroke().undash();
        pdf.fillColor(colors.muted).text(formatNumber(step * tick), x + 6, row - 3.5, {
            width: left - x - 12,
            align: 'right',
            lineBreak: false,
        });
    }

    const start = report.start.getTime();
    const duration = report.end.getTime() - start || 1;
    const ticks = width > 300 ? 4 : 2;
    for (let tick = 0; tick <= ticks; tick++) {
        const time = start + (duration * tick) / ticks;
        const position = left + ((right - left) * tick) / ticks;
        const align = tick === 0 ? 'left' : tick === ticks ? 'right' : 'center';
        const labelX =
            align === 'left' ? position : align === 'right' ? position - 70 : position - 35;
        pdf.fillColor(colors.muted).text(axisTime.format(time), labelX, bottom + 8, {
            width: 70,
            align,
            lineBreak: false,
        });
    }

    // Segmentos contínuos; intervalos sem dados interrompem a linha.
    const segments: { x: number; y: number }[][] = [[]];
    for (const point of report.points) {
        const value = point[metric];
        if (value === null) {
            if (segments[segments.length - 1].length) segments.push([]);
            continue;
        }
        segments[segments.length - 1].push({
            x: left + ((right - left) * (point.time.getTime() - start)) / duration,
            y: bottom - ((bottom - top) * value) / scale,
        });
    }
    const area = pdf.linearGradient(0, top, 0, bottom);
    area.stop(0, style.color, 0.32).stop(1, style.color, 0.02);
    for (const segment of segments.filter((part) => part.length)) {
        const first = segment[0];
        const last = segment[segment.length - 1];
        if (segment.length > 1) {
            pdf.moveTo(first.x, bottom);
            for (const point of segment) pdf.lineTo(point.x, point.y);
            pdf.lineTo(last.x, bottom).closePath().fill(area);
            pdf.moveTo(first.x, first.y);
            for (const point of segment.slice(1)) pdf.lineTo(point.x, point.y);
            pdf.lineWidth(1.8).lineJoin('round').lineCap('round').stroke(style.color);
        } else {
            pdf.circle(first.x, first.y, 2.2).fill(style.color);
        }
    }
    // Destaque no último valor coletado.
    const lastSegment = segments.filter((part) => part.length).at(-1);
    const last = lastSegment?.at(-1);
    if (last) {
        pdf.circle(last.x, last.y, 5).fillOpacity(0.2).fill(style.color).fillOpacity(1);
        pdf.circle(last.x, last.y, 2.6).fill(style.color);
        pdf.circle(last.x, last.y, 1.1).fill(colors.paper);
    }
}

// Comparação entre serviços em barras horizontais, uma card por métrica.
export function drawBarCharts(pdf: PDFKit.PDFDocument, report: Report, top: number) {
    let y = drawSectionTitle(
        pdf,
        top,
        'Comparação entre serviços',
        'Valores de cada serviço no período, do maior para o menor.',
    );
    const rowHeight = 22;
    const header = 44;
    const nameWidth = 165;
    const valueWidth = 80;
    for (const metric of report.metrics) {
        const style = metricStyles[metric];
        const rows = report.services
            .flatMap((service) => {
                const value = service[metric];
                return value === null ? [] : [{ name: service.name, value }];
            })
            .sort((a, b) => b.value - a.value);
        const max = Math.max(0, ...rows.map((row) => row.value)) || 1;
        let offset = 0;
        do {
            const minRows = Math.max(1, Math.min(4, rows.length - offset));
            if (y + header + minRows * rowHeight + 12 > contentBottom) {
                y = addContentPage(pdf, 'Comparação entre serviços', report.title);
            }
            const capacity = Math.floor((contentBottom - y - header - 12) / rowHeight);
            const visible = rows.slice(offset, offset + capacity);
            const height = header + Math.max(1, visible.length) * rowHeight + 12;
            drawCard(pdf, margin, y, contentWidth, height);
            pdf.circle(margin + 19, y + 21, 4).fill(style.color);
            pdf.font(fonts.bold)
                .fontSize(11)
                .fillColor(colors.ink)
                .text(offset ? `${style.name} (continuação)` : style.name, margin + 29, y + 14, {
                    lineBreak: false,
                });
            pdf.font(fonts.regular)
                .fontSize(8)
                .fillColor(colors.muted)
                .text(style.unit, margin + 14, y + 16, {
                    width: contentWidth - 28,
                    align: 'right',
                    lineBreak: false,
                });
            if (!visible.length) {
                pdf.text('Sem amostras no período.', margin + 16, y + header, { lineBreak: false });
            }
            const barLeft = margin + 16 + nameWidth;
            const barWidth = contentWidth - nameWidth - valueWidth - 40;
            visible.forEach((row, index) => {
                const rowY = y + header + index * rowHeight;
                pdf.font(fonts.medium)
                    .fontSize(8.5)
                    .fillColor(colors.ink)
                    .text(cleanText(row.name), margin + 16, rowY, {
                        width: nameWidth - 10,
                        height: 12,
                        ellipsis: true,
                        lineBreak: false,
                    });
                pdf.roundedRect(barLeft, rowY + 1, barWidth, 9, 4.5).fill(colors.tint);
                if (row.value > 0) {
                    pdf.roundedRect(
                        barLeft,
                        rowY + 1,
                        Math.max(9, (barWidth * row.value) / max),
                        9,
                        4.5,
                    ).fill(style.color);
                }
                pdf.font(fonts.semibold)
                    .fontSize(8.5)
                    .fillColor(colors.ink)
                    .text(formatNumber(row.value), margin + contentWidth - 16 - valueWidth, rowY, {
                        width: valueWidth,
                        align: 'right',
                        lineBreak: false,
                    });
            });
            offset += visible.length;
            y += height + 12;
        } while (offset < rows.length);
    }
    return y + 10;
}
