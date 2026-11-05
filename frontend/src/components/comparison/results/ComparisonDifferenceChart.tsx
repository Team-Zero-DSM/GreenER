
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Minus,
} from 'lucide-react';

import {
    PolarAngleAxis,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
} from 'recharts';

import type { ComparisonMetric } from '@/components/comparison/controls/ComparisonControls';

type ClassificacaoComparacao =
    | 'acima'
    | 'abaixo'
    | 'igual'
    | 'indisponivel';

interface ComparisonDifferenceChartProps {
    percentual: number | null;
    classificacao: ClassificacaoComparacao;
    metrica: ComparisonMetric;
    descricao: string;
}

function formatarPercentual(valor: number): string {
    return Math.abs(valor).toLocaleString('pt-BR', {
        maximumFractionDigits: 1,
    });
}

export function ComparisonDifferenceChart({
    percentual,
    classificacao,
    metrica,
    descricao,
}: ComparisonDifferenceChartProps) {
    const percentualValido =
        percentual !== null && Number.isFinite(percentual);

    // Limita apenas o preenchimento visual do gráfico.
    const magnitude =
        percentualValido && classificacao !== 'indisponivel'
            ? Math.min(Math.abs(percentual), 100)
            : 0;

    // Distribui a diferença para o lado correspondente.
    const antes =
        classificacao === 'abaixo'
            ? 100 - magnitude
            : 100;

    const depois =
        classificacao === 'acima'
            ? 100 - magnitude
            : 100;

    const dadosGrafico = [
        {
            antes,
            diferenca: magnitude,
            depois,
        },
    ];

    const corDiferenca =
        classificacao === 'acima'
            ? '#FB7185'
            : classificacao === 'abaixo'
              ? '#34D399'
              : '#94A3B8';

    const corTexto =
        classificacao === 'acima'
            ? 'text-rose-400'
            : classificacao === 'abaixo'
              ? 'text-emerald-400'
              : classificacao === 'igual'
                ? 'text-slate-200'
                : 'text-slate-400';

    const IconeDirecao =
        classificacao === 'acima'
            ? ArrowUp
            : classificacao === 'abaixo'
              ? ArrowDown
              : classificacao === 'igual'
                ? Minus
                : ArrowUpDown;

    const acao =
        metrica === 'co2eGrams'
            ? 'Emitiu'
            : 'Consumiu';

    const percentualFormatado =
    percentualValido && percentual !== null
        ? formatarPercentual(percentual)
        : null;

const textoDirecao =
    classificacao === 'acima'
        ? `${acao} ${
              percentualFormatado !== null
                  ? `${percentualFormatado}% a mais`
                  : 'mais'
          } que a média`
        : classificacao === 'abaixo'
          ? `${acao} ${
                percentualFormatado !== null
                    ? `${percentualFormatado}% a menos`
                    : 'menos'
            } que a média`
          : classificacao === 'igual'
            ? 'Mesmo valor da média'
            : 'Comparação indisponível';

    return (
        <div className="flex flex-col items-center gap-1">

            {/* Gráfico radial */}
            <div className="h-[105px] w-full max-w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        data={dadosGrafico}
                        startAngle={180}
                        endAngle={0}
                        innerRadius="68%"
                        outerRadius="88%"
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 200]}
                            tick={false}
                        />

                        <PolarRadiusAxis
                            tick={false}
                            tickLine={false}
                            axisLine={false}
                        />

                        <RadialBar
                            dataKey="antes"
                            stackId="comparacao"
                            fill="#334155"
                            cornerRadius={0}
                        />

                        <RadialBar
                            dataKey="diferenca"
                            stackId="comparacao"
                            fill={corDiferenca}
                            cornerRadius={5}
                        />

                        <RadialBar
                            dataKey="depois"
                            stackId="comparacao"
                            fill="#334155"
                            cornerRadius={0}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>

            {/* Identificação da escala */}
            <div className="flex w-full max-w-[210px] justify-between text-[10px] text-slate-500">
                <span>Abaixo</span>
                <span>0%</span>
                <span>Acima</span>
            </div>

            {/* Percentual */}
            <p className={`text-2xl font-semibold tabular-nums ${corTexto}`}>
                {percentualValido
                    ? `${formatarPercentual(percentual)}%`
                    : '—'}
            </p>

            {/* Direção */}
            <div className={`flex items-center gap-2 text-sm font-medium ${corTexto}`}>
                <IconeDirecao className="size-4 shrink-0" />

                <span>
                    {textoDirecao}
                </span>
            </div>

            {/* Descrição */}
            <p className="text-center text-xs leading-relaxed text-slate-400">
                {descricao}
            </p>
        </div>
    );
}
