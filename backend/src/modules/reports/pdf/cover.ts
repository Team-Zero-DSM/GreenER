import type { Report } from '../types/reports.types.js';
import { drawHeaderModule, drawStars, drawWordmark } from './layout.js';
import { metricTotal, totalSamples } from './summary.js';
import {
    cleanText,
    colors,
    contentWidth,
    dateTime,
    fonts,
    formatInteger,
    formatMetric,
    longDate,
    page,
    rangeLabels,
} from './theme.js';

const { margin } = page;

// Capa no tema escuro do site: céu estrelado, globo e números principais do período.
export function drawCover(pdf: PDFKit.PDFDocument, report: Report, generatedAt: Date) {
    const sky = pdf.radialGradient(page.width / 2, -80, 0, page.width / 2, -80, page.height);
    sky.stop(0, colors.indigo).stop(0.7, colors.night);
    pdf.rect(0, 0, page.width, page.height).fill(sky);
    drawStars(pdf, { x: 0, y: 0, width: page.width, height: page.height }, 420);
    drawGlobe(pdf, page.width - 95, 395, 175);

    drawHeaderModule(pdf, page.width / 2, 0, 250, 76);
    drawWordmark(pdf, page.width / 2, 15, 38);

    const textWidth = 300;
    let y = 222;
    pdf.font(fonts.semibold)
        .fontSize(8.5)
        .fillColor(colors.cyan)
        .text('RELATÓRIO DE MONITORAMENTO AMBIENTAL', margin, y, {
            characterSpacing: 2,
            lineBreak: false,
        });
    y += 22;
    pdf.font(fonts.bold).fontSize(34).fillColor(colors.snow);
    const title = cleanText(report.title);
    pdf.text(title, margin, y, { width: textWidth, lineGap: -4 });
    y = pdf.y + 18;

    const range = `${rangeLabels[report.range]}  ·  ${dateTime.format(report.start)} a ${dateTime.format(report.end)}`;
    pdf.font(fonts.medium).fontSize(9);
    const pillWidth = pdf.widthOfString(range) + 26;
    pdf.roundedRect(margin, y, pillWidth, 24, 12)
        .fillOpacity(0.12)
        .fill(colors.emerald)
        .fillOpacity(1);
    pdf.roundedRect(margin, y, pillWidth, 24, 12)
        .lineWidth(0.8)
        .strokeOpacity(0.5)
        .stroke(colors.emerald)
        .strokeOpacity(1);
    pdf.circle(margin + 12, y + 12, 2.6).fill(colors.emerald);
    pdf.fillColor(colors.emeraldLight).text(range, margin + 20, y + 7.5, { lineBreak: false });
    y += 38;
    pdf.font(fonts.regular)
        .fontSize(10)
        .fillColor(colors.haze)
        .text(`Gerado em ${longDate.format(generatedAt)} · horário de Brasília`, margin, y, {
            lineBreak: false,
        });

    drawCoverKpis(pdf, report, 612);

    const lineY = page.height - 54;
    const line = pdf.linearGradient(margin, 0, page.width - margin, 0);
    line.stop(0, colors.emerald, 0.8).stop(1, colors.cyan, 0.1);
    pdf.rect(margin, lineY, contentWidth, 0.8).fill(line);
    pdf.font(fonts.regular)
        .fontSize(8)
        .fillColor(colors.haze)
        .text(
            'Energia e emissões são estimativas calculadas a partir das métricas coletadas.',
            margin,
            lineY + 12,
            { lineBreak: false },
        );
    pdf.font(fonts.semibold)
        .fillColor(colors.emeraldLight)
        .text('green-er.vercel.app', margin, lineY + 12, {
            width: contentWidth,
            align: 'right',
            lineBreak: false,
        });
}

function drawCoverKpis(pdf: PDFKit.PDFDocument, report: Report, top: number) {
    const energy = metricTotal(report.services, 'energy');
    const carbon = metricTotal(report.services, 'carbon');
    const energyLabel = energy === null ? null : formatMetric('energy', energy);
    const carbonLabel = carbon === null ? null : formatMetric('carbon', carbon);
    const cards = [
        { label: 'ENERGIA TOTAL', value: energyLabel?.value ?? '—', unit: energyLabel?.unit },
        { label: 'EMISSÕES TOTAIS', value: carbonLabel?.value ?? '—', unit: carbonLabel?.unit },
        {
            label: 'SERVIÇOS',
            value: formatInteger(report.services.length),
            unit: 'monitorados',
        },
        { label: 'AMOSTRAS', value: formatInteger(totalSamples(report)), unit: 'coletadas' },
    ];
    const gap = 10;
    const width = (contentWidth - gap * (cards.length - 1)) / cards.length;
    const height = 92;
    cards.forEach((card, index) => {
        const x = margin + index * (width + gap);
        pdf.roundedRect(x, top, width, height, 12).fillOpacity(0.07).fill(colors.snow);
        pdf.fillOpacity(1);
        pdf.roundedRect(x, top, width, height, 12)
            .lineWidth(0.8)
            .strokeOpacity(0.16)
            .stroke(colors.snow)
            .strokeOpacity(1);
        const accent = pdf.linearGradient(x + 14, 0, x + 44, 0);
        accent.stop(0, colors.emerald).stop(1, colors.cyan);
        pdf.roundedRect(x + 14, top + 14, 30, 2.5, 1.25).fill(accent);
        pdf.font(fonts.semibold)
            .fontSize(7)
            .fillColor(colors.haze)
            .text(card.label, x + 14, top + 25, { characterSpacing: 1.2, lineBreak: false });
        pdf.font(fonts.bold).fontSize(card.value.length > 7 ? 19 : 24);
        pdf.fillColor(colors.snow).text(card.value, x + 14, top + 42, {
            width: width - 28,
            height: 30,
            ellipsis: true,
            lineBreak: false,
        });
        if (card.unit) {
            pdf.font(fonts.medium)
                .fontSize(8.5)
                .fillColor(colors.emerald)
                .text(card.unit, x + 14, top + 72, { lineBreak: false });
        }
    });
}

// Globo vetorial com halo ciano, malha de paralelos/meridianos e pontos de coleta.
function drawGlobe(pdf: PDFKit.PDFDocument, cx: number, cy: number, radius: number) {
    const halo = pdf.radialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.55);
    halo.stop(0, colors.cyan, 0.22).stop(1, colors.cyan, 0);
    pdf.circle(cx, cy, radius * 1.55).fill(halo);

    const sphere = pdf.radialGradient(
        cx - radius * 0.35,
        cy - radius * 0.4,
        radius * 0.05,
        cx,
        cy,
        radius,
    );
    sphere.stop(0, '#155e63').stop(0.55, '#0c2b3e').stop(1, colors.navy);
    pdf.circle(cx, cy, radius).fill(sphere);

    pdf.save();
    pdf.circle(cx, cy, radius).clip();
    pdf.lineWidth(0.6).strokeColor(colors.emerald).strokeOpacity(0.22);
    for (const latitude of [-60, -40, -20, 0, 20, 40, 60]) {
        const angle = (latitude * Math.PI) / 180;
        const y = cy + radius * Math.sin(angle) * 0.96;
        const rx = radius * Math.cos(angle);
        pdf.ellipse(cx, y, rx, rx * 0.16).stroke();
    }
    for (const longitude of [15, 40, 65, 90]) {
        const rx = radius * Math.sin((longitude * Math.PI) / 180);
        pdf.ellipse(cx, cy, rx, radius).stroke();
    }
    pdf.moveTo(cx, cy - radius)
        .lineTo(cx, cy + radius)
        .stroke();

    const points = [
        [-0.42, -0.38],
        [-0.12, -0.55],
        [0.18, -0.2],
        [-0.55, 0.05],
        [-0.22, 0.28],
        [0.1, 0.5],
        [-0.65, -0.18],
    ].map(([dx, dy]) => ({ x: cx + dx * radius, y: cy + dy * radius }));
    pdf.lineWidth(0.9).strokeColor(colors.cyan).strokeOpacity(0.55).dash(2, { space: 2.5 });
    for (let index = 0; index < points.length - 1; index++) {
        const from = points[index];
        const to = points[index + 1];
        pdf.moveTo(from.x, from.y)
            .quadraticCurveTo((from.x + to.x) / 2, Math.min(from.y, to.y) - 26, to.x, to.y)
            .stroke();
    }
    pdf.undash();
    for (const point of points) {
        const glow = pdf.radialGradient(point.x, point.y, 0, point.x, point.y, 10);
        glow.stop(0, colors.emerald, 0.6).stop(1, colors.emerald, 0);
        pdf.circle(point.x, point.y, 10).fill(glow);
        pdf.circle(point.x, point.y, 2.4).fill(colors.emeraldLight);
    }
    pdf.restore();
    pdf.strokeOpacity(1);

    const rim = pdf.linearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    rim.stop(0, colors.mint, 0.9).stop(1, colors.cyan, 0.1);
    pdf.circle(cx, cy, radius).lineWidth(1.4).stroke(rim);
}
