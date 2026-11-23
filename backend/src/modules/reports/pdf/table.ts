import type { MetricService } from '../../analytics/types/metrics-snapshot.types.js';
import type { Report } from '../types/reports.types.js';
import { addContentPage, drawSectionTitle } from './layout.js';
import {
    cleanText,
    colors,
    contentBottom,
    contentWidth,
    fonts,
    formatInteger,
    formatNumber,
    metricStyles,
    page,
    statusStyles,
} from './theme.js';

const { margin } = page;

// Tabela por serviço com cabeçalho escuro (como a navegação do site) e linhas zebradas.
export function drawServiceTable(pdf: PDFKit.PDFDocument, report: Report, startY: number) {
    const statusWidth = 90;
    const samplesWidth = 48;
    const nameWidth = report.metrics.length >= 4 ? 132 : 176;
    const metricWidth =
        (contentWidth - nameWidth - statusWidth - samplesWidth) / report.metrics.length;
    const headHeight = 34;
    const rowHeight = 34;
    const metricLeft = (index: number) =>
        margin + nameWidth + statusWidth + samplesWidth + index * metricWidth;

    function header(y: number, continued = false) {
        y = drawSectionTitle(
            pdf,
            y,
            continued ? 'Resultados por serviço (continuação)' : 'Resultados por serviço',
            continued ? undefined : 'Valores consolidados de cada serviço no período.',
        );
        const fill = pdf.linearGradient(margin, y, margin + contentWidth, y);
        fill.stop(0, colors.headerTop).stop(1, colors.navy);
        pdf.roundedRect(margin, y, contentWidth, headHeight, 8).fill(fill);
        pdf.font(fonts.semibold).fontSize(8).fillColor(colors.snow);
        pdf.text('Serviço', margin + 12, y + 13, { lineBreak: false });
        pdf.text('Status', margin + nameWidth, y + 13, { lineBreak: false });
        pdf.text('Amostras', margin + nameWidth + statusWidth, y + 13, {
            width: samplesWidth - 6,
            align: 'right',
            lineBreak: false,
        });
        report.metrics.forEach((metric, index) => {
            const style = metricStyles[metric];
            const options = { width: metricWidth - 10, align: 'right' as const, lineBreak: false };
            pdf.font(fonts.semibold)
                .fontSize(8)
                .fillColor(colors.snow)
                .text(style.short, metricLeft(index), y + 8, options);
            pdf.font(fonts.regular)
                .fontSize(7)
                .fillColor(colors.emeraldLight)
                .text(style.unit, metricLeft(index), y + 19, options);
        });
        return y + headHeight + 4;
    }

    const firstBlock = 42 + headHeight + 2 * rowHeight;
    let y = header(
        startY + firstBlock > contentBottom
            ? addContentPage(pdf, 'Resultados', report.title)
            : startY,
    );
    report.services.forEach((service, index) => {
        if (y + rowHeight > contentBottom) {
            y = header(addContentPage(pdf, 'Resultados', report.title), true);
        }
        if (index % 2) pdf.roundedRect(margin, y, contentWidth, rowHeight, 6).fill(colors.mineral);
        drawRow(service, y);
        y += rowHeight;
    });
    pdf.moveTo(margin, y + 2)
        .lineTo(margin + contentWidth, y + 2)
        .lineWidth(0.6)
        .strokeColor(colors.border)
        .stroke();
    return y + 20;

    function drawRow(service: MetricService, y: number) {
        pdf.font(fonts.semibold)
            .fontSize(8.5)
            .fillColor(colors.ink)
            .text(cleanText(service.name), margin + 12, y + 7, {
                width: nameWidth - 18,
                height: 11,
                ellipsis: true,
                lineBreak: false,
            });
        pdf.font(fonts.regular)
            .fontSize(7)
            .fillColor(colors.muted)
            .text(cleanText(`${service.region} · ${service.regionCode}`), margin + 12, y + 19, {
                width: nameWidth - 18,
                height: 9,
                ellipsis: true,
                lineBreak: false,
            });

        const status = statusStyles[service.status];
        pdf.font(fonts.semibold).fontSize(7);
        const pillWidth = pdf.widthOfString(status.label) + 20;
        const pillX = margin + nameWidth;
        pdf.roundedRect(pillX, y + 10, pillWidth, 14, 7).fill(status.surface);
        pdf.circle(pillX + 7, y + 17, 2.2).fill(status.color);
        pdf.fillColor(status.text).text(status.label, pillX + 12, y + 13.5, { lineBreak: false });

        pdf.font(fonts.medium)
            .fontSize(8.5)
            .fillColor(colors.ink)
            .text(formatInteger(service.samples), margin + nameWidth + statusWidth, y + 12, {
                width: samplesWidth - 6,
                align: 'right',
                lineBreak: false,
            });
        report.metrics.forEach((metric, column) => {
            const value = service[metric];
            pdf.font(value === null ? fonts.regular : fonts.medium)
                .fontSize(8.5)
                .fillColor(value === null ? colors.muted : colors.ink)
                .text(value === null ? '—' : formatNumber(value), metricLeft(column), y + 12, {
                    width: metricWidth - 10,
                    align: 'right',
                    lineBreak: false,
                });
        });
    }
}

// Nota de metodologia no fim do relatório.
export function drawMethodology(pdf: PDFKit.PDFDocument, report: Report, startY: number) {
    const height = 74;
    let y = startY;
    if (y + height > contentBottom) y = addContentPage(pdf, 'Metodologia', report.title);
    pdf.roundedRect(margin, y, contentWidth, height, 10).fill(colors.mineral);
    const bar = pdf.linearGradient(margin, y, margin, y + height);
    bar.stop(0, colors.emerald).stop(1, colors.cyan);
    pdf.save();
    pdf.roundedRect(margin, y, contentWidth, height, 10).clip();
    pdf.rect(margin, y, 4, height).fill(bar);
    pdf.restore();
    pdf.font(fonts.bold)
        .fontSize(10)
        .fillColor(colors.deep)
        .text('Como os números são calculados', margin + 18, y + 14, { lineBreak: false });
    pdf.font(fonts.regular)
        .fontSize(8.5)
        .fillColor(colors.muted)
        .text(
            'Energia e emissões são estimativas do GreenER calculadas a partir das métricas coletadas de cada serviço e da intensidade de carbono da sua região. CPU, memória e potência são médias das amostras. O traço (—) indica que não houve amostras daquela métrica no período.',
            margin + 18,
            y + 30,
            { width: contentWidth - 36, lineGap: 2 },
        );
    return y + height;
}
