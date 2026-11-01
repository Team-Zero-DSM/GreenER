
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Info,
    Leaf,
    Minus,
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

type ClassificacaoComparacao = 'acima' | 'abaixo' | 'igual' | 'indisponivel';

function formatarValor(valor: number | null, metrica: ComparisonMetric): string {
    if (valor === null || !Number.isFinite(valor)) {
        return '—';
    }

    return valor.toLocaleString('pt-BR', {
        maximumFractionDigits: metrica === 'energyKwh' ? 4 : 2,
    });
}

function formatarPercentual(valor: number): string {
    return Math.abs(valor).toLocaleString('pt-BR', {
        maximumFractionDigits: 1,
    });
}

export function ComparisonSummary({
    servicosSelecionados,
    respostaComparacao,
    metrica,
    servicoPrincipalId,
}: ComparisonSummaryProps) {
    const unidade = metrica === 'co2eGrams' ? 'gCO₂e' : 'kWh';

    const tituloMetrica = metrica === 'co2eGrams' ? 'Emissões' : 'Energia';

    const tituloValor = metrica === 'co2eGrams' ? 'Emissões (gCO₂e)' : 'Energia (kWh)';

    // Identifica o serviço principal.
    const servicoPrincipal = servicosSelecionados.find(
        (item) => item.selectionId === servicoPrincipalId,
    );

    const nomeServicoPrincipal = servicoPrincipal?.name ?? 'Serviço de referência';

    // Localiza a série do serviço principal.
    const seriePrincipal = respostaComparacao?.series.find(
        (serie) => serie.selectionId === servicoPrincipalId,
    );

    const valorPrincipalBruto = seriePrincipal?.summary[metrica];

    const valorPrincipal =
        typeof valorPrincipalBruto === 'number' && Number.isFinite(valorPrincipalBruto)
            ? valorPrincipalBruto
            : null;

    // Obtém os valores disponíveis dos demais serviços.
    const valoresDemais = servicosSelecionados.flatMap((servico) => {
        if (servico.selectionId === servicoPrincipalId) {
            return [];
        }

        const serie = respostaComparacao?.series.find(
            (item) => item.selectionId === servico.selectionId,
        );

        const valor = serie?.summary[metrica];

        return typeof valor === 'number' && Number.isFinite(valor) ? [valor] : [];
    });

    // Calcula a média aritmética dos demais serviços.
    const mediaDemais =
        valoresDemais.length > 0
            ? valoresDemais.reduce((total, valor) => total + valor, 0) / valoresDemais.length
            : null;

    // Calcula a diferença absoluta entre a referência e a média.
    const diferencaAbsoluta =
        valorPrincipal !== null && mediaDemais !== null
            ? valorPrincipal - mediaDemais
            : null;

    // Identifica se a referência está acima, abaixo ou igual à média.
    const classificacao: ClassificacaoComparacao =
        diferencaAbsoluta === null
            ? 'indisponivel'
            : diferencaAbsoluta > 0
              ? 'acima'
              : diferencaAbsoluta < 0
                ? 'abaixo'
                : 'igual';

    // Calcula a diferença percentual em relação à média.
    const diferencaPercentual =
        diferencaAbsoluta === null || mediaDemais === null
            ? null
            : mediaDemais === 0
              ? diferencaAbsoluta === 0
                  ? 0
                  : null
              : (diferencaAbsoluta / mediaDemais) * 100;

    // Define a cor de acordo com o resultado.
    const corClassificacao =
        classificacao === 'acima'
            ? 'text-rose-400'
            : classificacao === 'abaixo'
              ? 'text-emerald-400'
              : classificacao === 'igual'
                ? 'text-slate-200'
                : 'text-slate-400';

    // Define o verbo de acordo com a métrica selecionada.
    const verboMetrica = metrica === 'co2eGrams' ? 'emitiu' : 'consumiu';

    return (
        <section className="space-y-4">
            {/* Cabeçalho. */}
            <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-400/10">
                    <Leaf className="size-5 text-teal-300" aria-hidden="true" />
                </div>

                <div className="min-w-0 space-y-1">
                    <h3 className="text-lg font-semibold text-slate-100">
                        Resumo comparativo — {tituloMetrica}
                    </h3>

                    <p className="text-xs text-slate-400 sm:text-sm">
                        O serviço de referência é comparado com a média dos demais serviços
                        selecionados.
                    </p>
                </div>
            </div>

            {/* Orientação antes da primeira comparação. */}
            {!respostaComparacao ? (
                <div className="flex min-h-16 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                    <p className="text-center text-sm text-slate-400">
                        Selecione pelo menos dois serviços e clique em Comparar para ver os
                        resultados.
                    </p>

                    <span className="group relative inline-flex shrink-0">
                        <button
                            type="button"
                            aria-label="Informações sobre como comparar serviços"
                            className="flex size-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                        >
                            <Info className="size-4" />
                        </button>

                        <span
                            role="tooltip"
                            className="invisible absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900 p-3 text-left text-xs leading-relaxed text-slate-300 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                        >
                            <span className="mb-2 block font-semibold text-slate-100">
                                Como fazer uma comparação
                            </span>

                            <span className="mb-2 block">1. Selecione de 2 a 5 serviços.</span>

                            <span className="mb-2 block">
                                2. Defina o serviço de referência, que será a base da comparação.
                            </span>

                            <span className="mb-2 block">
                                3. Escolha o período para definir o intervalo das coletas
                                analisadas.
                            </span>

                            <span className="block">
                                4. Escolha uma região para simular as emissões usando o fator de
                                carbono dela.
                            </span>
                        </span>
                    </span>
                </div>
            ) : (
                <>
                    {/* Quatro áreas com larguras iguais. */}
                    <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                                            backgroundColor: servicoPrincipal?.color ?? '#2563EB',
                                        }}
                                    >
                                        <Server className="size-5" aria-hidden="true" />
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

                                <p className="text-xs text-slate-400">Total no período</p>
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
                                              valoresDemais.length === 1 ? 'serviço' : 'serviços'
                                          } com valores disponíveis.`
                                        : 'Não há outros serviços com valores disponíveis.'}
                                </p>
                            </div>
                        </div>

                        {/* Diferença percentual. */}
                        <div className="flex min-h-[190px] min-w-0 flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                            <div className="flex items-center gap-2">
                                <span
                                    className="flex size-6 shrink-0 items-center justify-center text-2xl font-semibold text-slate-300"
                                    aria-hidden="true"
                                >
                                    %
                                </span>

                                <span className="text-sm font-medium text-slate-200">
                                    Diferença percentual
                                </span>
                            </div>

                            <div className="space-y-3">
                                {/* Seta e percentual em destaque, sem texto ao lado. */}
                                <div className="flex items-center gap-3">
                                    {classificacao === 'acima' && (
                                        <ArrowUp
                                            className={`size-8 shrink-0 ${corClassificacao}`}
                                            aria-hidden="true"
                                        />
                                    )}

                                    {classificacao === 'abaixo' && (
                                        <ArrowDown
                                            className={`size-8 shrink-0 ${corClassificacao}`}
                                            aria-hidden="true"
                                        />
                                    )}

                                    {classificacao === 'igual' && (
                                        <Minus
                                            className={`size-8 shrink-0 ${corClassificacao}`}
                                            aria-hidden="true"
                                        />
                                    )}

                                    {classificacao === 'indisponivel' && (
                                        <ArrowUpDown
                                            className="size-8 shrink-0 text-slate-400"
                                            aria-hidden="true"
                                        />
                                    )}

                                    <p
                                        className={`text-3xl font-semibold tabular-nums sm:text-4xl ${corClassificacao}`}
                                    >
                                        {diferencaPercentual !== null
                                            ? `${formatarPercentual(diferencaPercentual)}%`
                                            : '—'}
                                    </p>
                                </div>

                                {/* Descrição com informações importantes em destaque. */}
                                <p className="text-xs leading-relaxed text-slate-400">
                                    {diferencaAbsoluta === null ? (
                                        'Não há valores disponíveis suficientes para realizar essa comparação.'
                                    ) : classificacao === 'igual' ? (
                                        <>
                                            <strong className="font-semibold text-slate-200">
                                                {nomeServicoPrincipal}
                                            </strong>{' '}
                                            apresentou o mesmo valor que a média dos demais serviços
                                            selecionados.
                                        </>
                                    ) : (
                                        <>
                                            <strong className="font-semibold text-slate-200">
                                                {nomeServicoPrincipal}
                                            </strong>{' '}
                                            {verboMetrica}{' '}
                                            <strong className="font-semibold text-slate-200">
                                                {formatarValor(
                                                    Math.abs(diferencaAbsoluta),
                                                    metrica,
                                                )}{' '}
                                                {unidade}
                                            </strong>{' '}
                                            <strong className="font-semibold text-slate-200">
                                                {classificacao === 'acima' ? 'a mais' : 'a menos'}
                                            </strong>{' '}
                                            que a média dos demais serviços selecionados.
                                        </>
                                    )}
                                </p>
                            </div>
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
                                            <th className="pb-3 pr-2 font-medium">Serviço</th>

                                            <th className="pb-3 text-right font-medium whitespace-nowrap">
                                                {tituloValor}
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {servicosSelecionados.map((servico) => {
                                            const serie = respostaComparacao.series.find(
                                                (item) => item.selectionId === servico.selectionId,
                                            );

                                            const valor = serie ? serie.summary[metrica] : null;

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
                                                                    backgroundColor: servico.color,
                                                                }}
                                                                aria-hidden="true"
                                                            />

                                                            <span className="truncate font-medium">
                                                                {servico.name}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="py-3 text-right font-medium text-slate-200 tabular-nums whitespace-nowrap">
                                                        {formatarValor(valor, metrica)}
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
                </>
            )}
        </section>
    );
}
