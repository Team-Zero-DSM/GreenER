import {
    ArrowUpDown,
    Leaf,
    Percent,
    Server,
    Star,
    UsersRound,
} from 'lucide-react';

import type { ComparisonMetric } from '@/components/comparison/controls/ComparisonControls';
import type { ComparisonServiceSelection } from '@/components/comparison/selector/ComparisonServiceSelector';
import type { ComparisonResponse } from '@/types/comparison';

interface ComparisonSummaryProps {
    servicosSelecionados: ComparisonServiceSelection[];
    respostaComparacao: ComparisonResponse | null;
    metrica: ComparisonMetric;
    servicoPrincipalId: string | null;
}

function formatarValor(
    valor: number | null,
    metrica: ComparisonMetric,
): string {
    if (valor === null || !Number.isFinite(valor)) {
        return '—';
    }

    return valor.toLocaleString('pt-BR', {
        maximumFractionDigits: metrica === 'energyKwh' ? 4 : 2,
    });
}

export function ComparisonSummary({
    servicosSelecionados,
    respostaComparacao,
    metrica,
    servicoPrincipalId,
}: ComparisonSummaryProps) {
    const unidade =
        metrica === 'co2eGrams' ? 'gCO₂e' : 'kWh';

    const tituloMetrica =
        metrica === 'co2eGrams' ? 'Emissões' : 'Energia';

    const tituloValor =
        metrica === 'co2eGrams'
            ? 'Emissões (gCO₂e)'
            : 'Energia (kWh)';

    // Identifica o serviço principal.
    const servicoPrincipal = servicosSelecionados.find(
        (item) => item.selectionId === servicoPrincipalId,
    );

    // Localiza a série do serviço principal.
    const seriePrincipal = respostaComparacao?.series.find(
        (serie) => serie.selectionId === servicoPrincipalId,
    );

    const valorPrincipal = seriePrincipal
        ? seriePrincipal.summary[metrica]
        : null;

    // Obtém os totais dos demais serviços.
    const valoresDemais = servicosSelecionados.flatMap((servico) => {
        if (servico.selectionId === servicoPrincipalId) {
            return [];
        }

        const serie = respostaComparacao?.series.find(
            (item) => item.selectionId === servico.selectionId,
        );

        const valor = serie?.summary[metrica];

        return typeof valor === 'number' && Number.isFinite(valor)
            ? [valor]
            : [];
    });

    // Calcula a média dos demais serviços.
    const mediaDemais =
        valoresDemais.length > 0
            ? valoresDemais.reduce(
                  (total, valor) => total + valor,
                  0,
              ) / valoresDemais.length
            : null;

    return (
        <section className="space-y-4">
            {/* Cabeçalho. */}
            <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-400/10">
                    <Leaf
                        className="size-5 text-teal-300"
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0 space-y-1">
                    <h3 className="text-lg font-semibold text-slate-100">
                        Resumo comparativo — {tituloMetrica}
                    </h3>

                    <p className="text-xs text-slate-400 sm:text-sm">
                        O serviço de referência é comparado com a
                        média dos demais serviços selecionados.
                    </p>
                </div>
            </div>

            {/* Antes da comparação, mostra apenas a orientação. */}
            {!respostaComparacao ? (
                <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                    <p className="text-sm text-slate-400">
                        Clique em Comparar para visualizar os resultados.
                    </p>
                </div>
            ) : (
                <>
                    {/* Quatro áreas com larguras iguais. */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

                        {/* Serviço principal. */}
                        <div className="flex min-h-[190px] min-w-0 flex-col justify-between gap-5 rounded-xl border border-teal-400/50 bg-teal-400/[0.02] p-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                    <Star
                                        className="size-4 fill-teal-400 text-teal-400"
                                        aria-hidden="true"
                                    />

                                    <span>Serviço de referência</span>
                                </div>

                                <div className="flex min-w-0 items-center gap-3">
                                    <div
                                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
                                        style={{
                                            backgroundColor:
                                                servicoPrincipal?.color ?? '#2563EB',
                                        }}
                                    >
                                        <Server
                                            className="size-5"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <p className="truncate text-sm font-semibold text-slate-100">
                                        {servicoPrincipal?.name ?? 'Serviço'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-3xl font-semibold text-slate-100 tabular-nums sm:text-4xl">
                                    {formatarValor(valorPrincipal, metrica)}

                                    {seriePrincipal && (
                                        <span className="ml-2 text-base font-medium text-slate-400">
                                            {unidade}
                                        </span>
                                    )}
                                </p>

                                <p className="text-xs text-slate-400">
                                    Total no período
                                </p>
                            </div>
                        </div>

                        {/* Média dos demais serviços. */}
                        <div className="flex min-h-[190px] min-w-0 flex-col justify-between gap-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                <UsersRound
                                    className="size-5 shrink-0 text-slate-300"
                                    aria-hidden="true"
                                />

                                <span>Média dos demais serviços</span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-3xl font-semibold text-slate-100 tabular-nums sm:text-4xl">
                                    {formatarValor(mediaDemais, metrica)}

                                    <span className="ml-2 text-base font-medium text-slate-400">
                                        {unidade}
                                    </span>
                                </p>

                                <p className="text-xs text-slate-400">
                                    {mediaDemais !== null
                                        ? `Média de ${valoresDemais.length} ${
                                              valoresDemais.length === 1
                                                  ? 'serviço'
                                                  : 'serviços'
                                          } selecionados.`
                                        : 'Não há outros serviços com valores disponíveis.'}
                                </p>
                            </div>
                        </div>

                        {/* Diferença percentual: próxima task. */}
                        <div className="flex min-h-[190px] min-w-0 flex-col justify-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                            <div className="flex items-center gap-3">
                                <Percent
                                    className="size-7 shrink-0 text-slate-300"
                                    aria-hidden="true"
                                />

                                <ArrowUpDown
                                    className="size-5 text-slate-500"
                                    aria-hidden="true"
                                />

                                <p className="text-3xl font-semibold text-slate-500 tabular-nums">
                                    —
                                </p>
                            </div>

                            <p className="text-sm leading-relaxed text-slate-400">
                                A diferença percentual entre o serviço
                                de referência e a média dos demais será
                                apresentada aqui.
                            </p>
                        </div>

                        {/* Valores individuais. */}
                        <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-slate-100">
                                    Valores individuais
                                </h4>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[210px] text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-slate-400">
                                            <th className="pb-3 pr-2 font-medium">
                                                Serviço
                                            </th>

                                            <th className="pb-3 text-right font-medium whitespace-nowrap">
                                                {tituloValor}
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {servicosSelecionados.map((servico) => {
                                            const serie =
                                                respostaComparacao.series.find(
                                                    (item) =>
                                                        item.selectionId ===
                                                        servico.selectionId,
                                                );

                                            const valor = serie
                                                ? serie.summary[metrica]
                                                : null;

                                            return (
                                                <tr
                                                    key={servico.selectionId}
                                                    className="border-b border-slate-800/70 last:border-0"
                                                >
                                                    <td className="py-3 pr-2 text-slate-200">
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <span
                                                                className="size-2.5 shrink-0 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        servico.color,
                                                                }}
                                                                aria-hidden="true"
                                                            />

                                                            <span className="truncate font-medium">
                                                                {servico.name}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="py-3 text-right font-medium text-slate-200 tabular-nums whitespace-nowrap">
                                                        {formatarValor(
                                                            valor,
                                                            metrica,
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {servicosSelecionados.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={2}
                                                    className="py-5 text-center text-slate-400"
                                                >
                                                    Nenhum serviço selecionado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Rodapé. */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                        <p>
                            Os valores representam os totais acumulados
                            no período selecionado.
                        </p>

                        <p>Dados demonstrativos · GreenER</p>
                    </div>
                </>
            )}
        </section>
    );
}