import { cleanText, colors, contentTop, contentWidth, fonts, headerHeight, page } from './theme.js';

const { margin } = page;

// Logotipo "GreenER" com o mesmo degradê esmeralda → ciano do cabeçalho do site.
export function drawWordmark(pdf: PDFKit.PDFDocument, centerX: number, y: number, size: number) {
    pdf.font(fonts.black).fontSize(size);
    const green = pdf.widthOfString('Green');
    pdf.font(fonts.light).fontSize(size);
    const er = pdf.widthOfString('ER');
    const x = centerX - (green + er) / 2;
    const gradient = pdf.linearGradient(x, y, x + green + er, y);
    gradient.stop(0, colors.emeraldLight).stop(1, colors.cyan);
    pdf.font(fonts.black).fontSize(size).fillColor(gradient);
    pdf.text('Green', x, y, { lineBreak: false });
    pdf.font(fonts.light).fontSize(size).fillColor(gradient);
    pdf.text('ER', x + green, y, { lineBreak: false });
}

// Módulo trapezoidal do cabeçalho do site, usado como "selo" do logotipo.
export function drawHeaderModule(
    pdf: PDFKit.PDFDocument,
    centerX: number,
    top: number,
    width: number,
    height: number,
) {
    const left = centerX - width / 2;
    const right = centerX + width / 2;
    const inset = width * 0.08;
    const radius = height * 0.12;
    const shape = () =>
        pdf
            .moveTo(left, top)
            .lineTo(right, top)
            .lineTo(right - inset, top + height - radius)
            .quadraticCurveTo(right - inset - 2, top + height, right - inset - radius, top + height)
            .lineTo(left + inset + radius, top + height)
            .quadraticCurveTo(left + inset + 2, top + height, left + inset, top + height - radius)
            .closePath();
    const fill = pdf.linearGradient(0, top, 0, top + height);
    fill.stop(0, colors.headerTop).stop(1, colors.headerBottom);
    shape().fill(fill);
    const glow = pdf.radialGradient(centerX, top, 0, centerX, top, width * 0.6);
    glow.stop(0, colors.cyan, 0.16).stop(1, colors.cyan, 0);
    shape().fill(glow);
    const border = pdf.linearGradient(left, top, right, top + height);
    border.stop(0, colors.mint, 0.55).stop(1, colors.cyan, 0.3);
    pdf.moveTo(left, top)
        .lineTo(left + inset, top + height - radius)
        .quadraticCurveTo(left + inset + 2, top + height, left + inset + radius, top + height)
        .lineTo(right - inset - radius, top + height)
        .quadraticCurveTo(right - inset - 2, top + height, right - inset, top + height - radius)
        .lineTo(right, top)
        .lineWidth(1)
        .stroke(border);
}

// Céu estrelado determinístico, como o fundo das páginas do site.
export function drawStars(
    pdf: PDFKit.PDFDocument,
    area: { x: number; y: number; width: number; height: number },
    count: number,
    seed = 7,
) {
    let state = seed;
    const random = () => {
        state = (state * 16807) % 2147483647;
        return state / 2147483647;
    };
    for (let index = 0; index < count; index++) {
        const x = area.x + random() * area.width;
        const y = area.y + random() * area.height;
        const size = random() < 0.92 ? 0.35 + random() * 0.55 : 1 + random() * 0.6;
        pdf.circle(x, y, size)
            .fillOpacity(0.25 + random() * 0.6)
            .fill(colors.snow);
    }
    pdf.fillOpacity(1);
}

// Faixa escura no topo das páginas internas, com o selo do logotipo ao centro.
export function drawPageHeader(pdf: PDFKit.PDFDocument, section: string, title: string) {
    const background = pdf.linearGradient(0, 0, 0, headerHeight);
    background.stop(0, colors.indigo).stop(1, colors.night);
    pdf.rect(0, 0, page.width, headerHeight).fill(background);
    drawStars(pdf, { x: 0, y: 0, width: page.width, height: headerHeight - 4 }, 70, 11);
    const accent = pdf.linearGradient(0, 0, page.width, 0);
    accent.stop(0, colors.emerald, 0).stop(0.5, colors.cyan, 0.9).stop(1, colors.emerald, 0);
    pdf.rect(0, headerHeight - 1.5, page.width, 1.5).fill(accent);

    const center = page.width / 2;
    drawHeaderModule(pdf, center, 0, 170, 52);
    drawWordmark(pdf, center, 12, 24);

    const side = (contentWidth - 190) / 2;
    pdf.font(fonts.semibold)
        .fontSize(7.5)
        .fillColor(colors.emeraldLight)
        .text(section.toUpperCase(), margin, 24, {
            width: side,
            characterSpacing: 1.4,
            lineBreak: false,
        });
    pdf.font(fonts.regular)
        .fontSize(9)
        .fillColor(colors.haze)
        .text('Relatório de monitoramento', margin, 37, { width: side, lineBreak: false });
    pdf.font(fonts.medium)
        .fontSize(9)
        .fillColor(colors.snow)
        .text(cleanText(title), page.width - margin - side, 30, {
            width: side,
            align: 'right',
            height: 12,
            ellipsis: true,
        });
    return contentTop;
}

export function addContentPage(pdf: PDFKit.PDFDocument, section: string, title: string) {
    pdf.addPage();
    pdf.rect(0, 0, page.width, page.height).fill(colors.paper);
    return drawPageHeader(pdf, section, title);
}

// Título de seção com marcador em degradê, como os títulos de card do site.
export function drawSectionTitle(
    pdf: PDFKit.PDFDocument,
    y: number,
    title: string,
    subtitle?: string,
) {
    const bar = pdf.linearGradient(margin, y, margin, y + 18);
    bar.stop(0, colors.emerald).stop(1, colors.cyan);
    pdf.roundedRect(margin, y + 1, 3.5, 17, 1.75).fill(bar);
    pdf.font(fonts.bold)
        .fontSize(15)
        .fillColor(colors.ink)
        .text(title, margin + 12, y, { lineBreak: false });
    if (!subtitle) return y + 30;
    pdf.font(fonts.regular)
        .fontSize(9)
        .fillColor(colors.muted)
        .text(subtitle, margin + 12, y + 20, { width: contentWidth - 12, lineBreak: false });
    return y + 42;
}

export function drawCard(
    pdf: PDFKit.PDFDocument,
    x: number,
    y: number,
    width: number,
    height: number,
) {
    pdf.roundedRect(x, y, width, height, 10)
        .lineWidth(0.8)
        .fillAndStroke(colors.paper, colors.border);
}

export function drawFooters(pdf: PDFKit.PDFDocument) {
    const { start, count } = pdf.bufferedPageRange();
    // A capa (primeira página) não leva rodapé.
    for (let index = 1; index < count; index++) {
        pdf.switchToPage(start + index);
        const y = page.height - 34;
        const line = pdf.linearGradient(margin, 0, page.width - margin, 0);
        line.stop(0, colors.emerald).stop(1, colors.cyan, 0.2);
        pdf.rect(margin, y - 8, contentWidth, 0.8).fill(line);
        pdf.font(fonts.semibold)
            .fontSize(8)
            .fillColor(colors.primary)
            .text('GreenER', margin, y, { lineBreak: false });
        const brandWidth = pdf.widthOfString('GreenER');
        pdf.font(fonts.regular)
            .fontSize(8)
            .fillColor(colors.muted)
            .text('  ·  Monitoramento ambiental de serviços de software', margin + brandWidth, y, {
                lineBreak: false,
            });
        pdf.font(fonts.medium).text(`${index + 1} / ${count}`, margin, y, {
            width: contentWidth,
            align: 'right',
            lineBreak: false,
        });
    }
}
