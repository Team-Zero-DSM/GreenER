import { useCallback, useState } from 'react';

import {
    ComparisonServiceSelector,
    type ComparisonServiceSelection,
} from '@/components/comparison/selector/ComparisonServiceSelector';

import {
    ComparisonControls,
    type ComparisonMetric,
} from '@/components/comparison/controls/ComparisonControls';

import { ComparisonChart } from '@/components/comparison/results/ComparisonChart';

import { gerarMockComparisonResponse } from '@/mocks/comparisonResponse.mock';

import type { HistoryRange } from '@/types/service';

import type {
    ComparisonRequest,
    ComparisonResponse,
} from '@/types/comparison';
import { ComparisonSummary } from '@/components/comparison/results/ComparisonSummary';
const CODIGOS_REGIAO: Record<string, string> = {
    'São Paulo': 'br-sudeste',
    Toronto: 'ca-toronto',
    Ashburn: 'us-east',
};

export function ComparisonPage() {
    // Configurações da comparação.
    const [periodo, setPeriodo] = useState<HistoryRange>('24h');

    const [metrica, setMetrica] =
        useState<ComparisonMetric>('co2eGrams');

    // Serviços escolhidos pelo usuário.
    const [servicosSelecionados, setServicosSelecionados] =
        useState<ComparisonServiceSelection[]>([]);

    // Serviço escolhido como principal referência.
    const [servicoPrincipalId, setServicoPrincipalId] =
        useState<string | null>(null);

    // Resultado da última comparação.
    const [respostaComparacao, setRespostaComparacao] =
        useState<ComparisonResponse | null>(null);

    // Recebe as informações enviadas pelo seletor.
    const handleSelectionsChange = useCallback(
        (
            selections: ComparisonServiceSelection[],
            principalId: string | null,
        ) => {
            setServicosSelecionados(selections);
            setServicoPrincipalId(principalId);
        },
        [],
    );

    // Executa a comparação utilizando o mock.
    function handleComparar() {
        const request: ComparisonRequest = {
            range: periodo,

            selections: servicosSelecionados.map((item) => ({
                selectionId: item.selectionId,
                externalId: item.externalId,
                simulatedRegionCode:
                    item.simulatedRegion === null
                        ? null
                        : CODIGOS_REGIAO[item.simulatedRegion] ?? null,
            })),
        };

        const resposta = gerarMockComparisonResponse(request);

        setRespostaComparacao(resposta);

        console.log('Requisição da comparação:', request);
        console.log('Resposta do mock:', resposta);
    }

    // Prepara as séries que serão entregues ao gráfico.
    const seriesGrafico =
        respostaComparacao?.series.flatMap((serie) => {
            const servico = servicosSelecionados.find(
                (item) => item.selectionId === serie.selectionId,
            );

            if (!servico) {
                return [];
            }

            return [
                {
                    selectionId: serie.selectionId,
                    name: servico.name,
                    color: servico.color,
                    points: serie.points,
                },
            ];
        }) ?? [];

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold">
                    Comparar serviços
                </h1>

                <p className="text-muted-foreground">
                    Selecione os serviços que deseja comparar, defina o período
                    e analise as métricas no mesmo gráfico.
                </p>
            </header>

            <section
                aria-label="Comparação de serviços"
                className="space-y-6 border-t border-border pt-6"
            >
                {/* Seleção dos serviços. */}
                <ComparisonServiceSelector
                    onSelectionsChange={handleSelectionsChange}
                />

                {/* Configurações da comparação. */}
                <ComparisonControls
                    periodo={periodo}
                    metrica={metrica}
                    onPeriodoChange={setPeriodo}
                    onMetricaChange={setMetrica}
                    onComparar={handleComparar}
                />

                {/* Gráfico comparativo. */}
                <div className="min-w-0 rounded-lg border border-border p-4">
                    {respostaComparacao === null ? (
                        <p className="text-sm text-muted-foreground">
                            Selecione os serviços e clique em Comparar
                            para visualizar o gráfico.
                        </p>
                    ) : (
                        <ComparisonChart
                            series={seriesGrafico}
                            metrica={metrica}
                            periodo={respostaComparacao.range}
                            periodoInicio={respostaComparacao.period.from}
                            periodoFim={respostaComparacao.period.to}
                        />
                    )}
                </div>

                {/* Resumo comparativo. */}
                <ComparisonSummary
    servicosSelecionados={servicosSelecionados}
    respostaComparacao={respostaComparacao}
    metrica={metrica}
    servicoPrincipalId={servicoPrincipalId}
/>
                
            </section>
        </main>
    );
}
