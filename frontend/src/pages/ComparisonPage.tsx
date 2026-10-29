import {
    ComparisonServiceSelector,
    type ComparisonServiceSelection,
} from '@/components/comparison/selector/ComparisonServiceSelector';
import { useCallback, useState } from 'react';
import {
    ComparisonControls,
    type ComparisonMetric,
} from '@/components/comparison/controls/ComparisonControls';
import type { HistoryRange } from '@/types/service';
import { gerarMockComparisonResponse } from '@/mocks/comparisonResponse.mock';
import type {
    ComparisonRequest,
    ComparisonResponse,
} from '@/types/comparison';
import { ComparisonChart } from '@/components/comparison/results/ComparisonChart';


const CODIGOS_REGIAO: Record<string, string> = {
    'São Paulo': 'br-sudeste',
    Toronto: 'ca-toronto',
    Ashburn: 'us-east',
};

export function ComparisonPage() {

const [periodo, setPeriodo] = useState<HistoryRange>('24h');

const [metrica, setMetrica] =
    useState<ComparisonMetric>('co2eGrams');

const [servicosSelecionados, setServicosSelecionados] =
    useState<ComparisonServiceSelection[]>([]);

const [respostaComparacao, setRespostaComparacao] =
    useState<ComparisonResponse | null>(null);

const handleSelectionsChange = useCallback(
    (selections: ComparisonServiceSelection[]) => {
        setServicosSelecionados(selections);
    },
    [],
);

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

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold">Comparar serviços</h1>

                <p className="text-muted-foreground">
                    Selecione os serviços que deseja comparar, defina o período e analise as
                    métricas no mesmo gráfico.
                </p>
            </header>

            {/* Área principal do componente de comparação */}
            <section
                aria-label="Comparação de serviços"
                className="space-y-6 border-t border-border pt-6"
            >
                {/* Area de seleção de serviços */}
                        <ComparisonServiceSelector
    onSelectionsChange={handleSelectionsChange}
/>


                    
               

                {/* Local dos controles da comparação */}
                    <ComparisonControls
    periodo={periodo}
    metrica={metrica}
    onPeriodoChange={setPeriodo}
    onMetricaChange={setMetrica}
    onComparar={handleComparar}
/>
                    

                {/* Area de gráfico comparativo */}
                <div className="min-w-0 rounded-lg border border-border p-4">
    {respostaComparacao === null ? (
        <p className="text-sm text-muted-foreground">
            Selecione os serviços e clique em Comparar
            para visualizar o gráfico.
        </p>
    ) : (
        <ComparisonChart
            series={respostaComparacao.series.flatMap((serie) => {
                const servico = servicosSelecionados.find(
                    (item) =>
                        item.selectionId === serie.selectionId,
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
            })}
            metrica={metrica}
            periodo={respostaComparacao.range}
            periodoInicio={respostaComparacao.period.from}
            periodoFim={respostaComparacao.period.to}
        />
    )}
</div>

                {/* Area de resumo comparativo */}
                <div className="space-y-3 border-t border-border pt-6">
                    <div>
                        <h3 className="text-xl font-semibold">Resumo comparativo</h3>

                        <p className="text-sm text-muted-foreground">
                            Compare o serviço de referência com os demais serviços selecionados.
                        </p>
                    </div>

                    <div className="min-h-40 rounded-lg border border-border p-4">
                        <p className="text-sm text-muted-foreground">
                            Área dos indicadores comparativos e dos valores individuais dos
                            serviços.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
