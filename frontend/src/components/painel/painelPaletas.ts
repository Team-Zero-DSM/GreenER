import type { PainelWidget } from '@/types/painel';

// Paleta: as cores das séries de um widget, na ordem em que as séries aparecem.
// Todas usam tons claros e saturados, que mantêm o contraste sobre o fundo
// escuro do painel.
export interface PainelPalette {
    id: string;
    label: string;
    colors: readonly string[];
}

export const PAINEL_PALETTES: readonly PainelPalette[] = [
    {
        id: 'padrao',
        label: 'Padrão',
        colors: ['#34d399', '#22d3ee', '#a78bfa', '#fbbf24', '#f472b6'],
    },
    {
        id: 'oceano',
        label: 'Oceano',
        colors: ['#38bdf8', '#818cf8', '#2dd4bf', '#a5f3fc', '#c4b5fd'],
    },
    {
        id: 'solar',
        label: 'Solar',
        colors: ['#fbbf24', '#fb923c', '#f87171', '#fde047', '#f9a8d4'],
    },
    {
        id: 'floresta',
        label: 'Floresta',
        colors: ['#4ade80', '#a3e635', '#2dd4bf', '#86efac', '#fde68a'],
    },
    {
        id: 'contraste',
        label: 'Alto contraste',
        colors: ['#ffffff', '#facc15', '#22d3ee', '#f472b6', '#a3e635'],
    },
];

// Cores do widget: a paleta escolhida pelo usuário ou, sem escolha, a padrão.
export function getWidgetColors(widget: PainelWidget): readonly string[] {
    const palette = PAINEL_PALETTES.find((item) => item.id === widget.palette);

    return (palette ?? PAINEL_PALETTES[0]).colors;
}
