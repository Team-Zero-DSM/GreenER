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




export function ComparisonPage() {

const [periodo, setPeriodo] = useState<HistoryRange>('24h');

const [metrica, setMetrica] =
    useState<ComparisonMetric>('co2eGrams');

const [servicosSelecionados, setServicosSelecionados] =
    useState<ComparisonServiceSelection[]>([]);

const handleSelectionsChange = useCallback(
    (selections: ComparisonServiceSelection[]) => {
        setServicosSelecionados(selections);
    },
    [],
);

function handleComparar() {
    console.log('Configurações da comparação:', {
        periodo,
        metrica,
        servicosSelecionados,
    });
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
                <div className="space-y-3 border-t border-border pt-6">
                    <div>
                        <h3 className="text-xl font-semibold">Gráfico comparativo</h3>

                        <p className="text-sm text-muted-foreground">
                            Visualização das métricas dos serviços selecionados ao longo do período.
                        </p>
                    </div>

                    <div className="flex min-h-64 items-center justify-center rounded-lg border border-border p-4">
                        <p className="text-sm text-muted-foreground">Área do gráfico</p>
                    </div>
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
