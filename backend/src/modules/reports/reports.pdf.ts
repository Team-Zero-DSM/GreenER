import PDFDocument from 'pdfkit';
import { drawBarCharts, drawTimelines } from './pdf/charts.js';
import { drawCover } from './pdf/cover.js';
import { addContentPage, drawFooters } from './pdf/layout.js';
import { drawOverview } from './pdf/overview.js';
import { drawMethodology, drawServiceTable } from './pdf/table.js';
import { contentBottom, registerFonts } from './pdf/theme.js';
import type { Report } from './types/reports.types.js';

// Monta o PDF: capa escura, visão geral, gráficos, tabela e metodologia.
export function createReportPdf(report: Report, generatedAt = new Date()): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const pdf = new PDFDocument({
            size: 'A4',
            margin: 0,
            bufferPages: true,
            autoFirstPage: true,
            info: { Title: report.title, Author: 'GreenER', Subject: 'Relatório de monitoramento' },
        });
        const chunks: Buffer[] = [];
        pdf.on('data', (chunk: Buffer) => chunks.push(chunk));
        pdf.on('error', reject);
        pdf.on('end', () => resolve(Buffer.concat(chunks)));

        registerFonts(pdf);
        drawCover(pdf, report, generatedAt);

        let y = drawOverview(pdf, report, addContentPage(pdf, 'Visão geral', report.title));
        if (report.visualization !== 'table') {
            y = addContentPage(pdf, 'Gráficos', report.title);
            y =
                report.visualization === 'line'
                    ? drawTimelines(pdf, report, y)
                    : drawBarCharts(pdf, report, y);
        }
        if (y + 160 > contentBottom) y = addContentPage(pdf, 'Resultados', report.title);
        y = drawServiceTable(pdf, report, y);
        drawMethodology(pdf, report, y);
        drawFooters(pdf);
        pdf.end();
    });
}
