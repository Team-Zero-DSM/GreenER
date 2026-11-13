export type PainelTemplateId = 'visao-geral' | 'sustentabilidade' | 'operacional' | 'executivo';

// Cada widget ocupa um retângulo da grade de 12 colunas: x e y são a coluna e a
// linha onde ele começa (a partir de 0), w e h são quantas colunas e linhas ocupa.
export interface PainelWidget {
    id: string;
    title: string;
    x: number;
    y: number;
    w: number;
    h: number;
}
