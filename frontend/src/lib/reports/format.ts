const numFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const smallFmt = new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 2 });

export const fmtNum = (v: number) =>
    v !== 0 && Math.abs(v) < 1 ? smallFmt.format(v) : numFmt.format(v);

export const fmtEnergy = (kwh: number | null) => (kwh === null ? '—' : `${fmtNum(kwh)} kWh`);

export const fmtCo2 = (g: number | null) => {
    if (g === null) return '—';
    return g >= 1000 ? `${numFmt.format(g / 1000)} kg` : `${fmtNum(g)} g`;
};

const dateFmt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });
const dateTimeFmt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

function safe(fmt: Intl.DateTimeFormat, value: string | number | Date | null | undefined): string {
    if (value === null || value === undefined) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : fmt.format(date);
}

export const fmtDate = (value: string | number | Date | null | undefined) => safe(dateFmt, value);
export const fmtDateTime = (value: string | number | Date | null | undefined) =>
    safe(dateTimeFmt, value);
