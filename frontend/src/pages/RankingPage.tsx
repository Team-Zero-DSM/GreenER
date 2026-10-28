const rankingColumns = ['#', 'Serviço', 'Região', 'Energia', 'CO₂e', 'Coletas'];

export function RankingPage() {
    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <div className="flex items-start justify-between gap-4">
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold">Ranking de impacto</h1>

                    <p className="text-muted-foreground">
                        Serviços ordenados por emissão ou consumo estimado no período escolhido.
                    </p>
                </header>

                {/* Área dos filtros de critério e período */}
                <section aria-label="Filtros do ranking" className="flex items-center gap-3">
                    <div className="flex min-h-10 items-center rounded-md border border-dashed border-border px-3 py-2">
                        <p className="text-sm text-muted-foreground">Emissão (CO₂e) | Energia</p>
                    </div>

                    <div className="flex min-h-10 items-center rounded-md border border-dashed border-border px-3 py-2">
                        <p className="text-sm text-muted-foreground">1h | 6h | 24h | 7d | 30d</p>
                    </div>
                </section>
            </div>

            <p className="text-sm text-muted-foreground">
                Período considerado:{' '}
                <span className="font-medium text-foreground">início e fim do período</span>
            </p>

            {/* Área do gráfico de barras */}
            <section
                aria-label="Gráfico do ranking"
                className="space-y-3 border-t border-border pt-6"
            >
                <div>
                    <h2 className="text-xl font-semibold">Emissão por serviço</h2>

                    <p className="text-sm text-muted-foreground">
                        Clique numa barra para ver o serviço.
                    </p>
                </div>

                <div className="flex min-h-64 items-center justify-center rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Área do gráfico de barras</p>
                </div>
            </section>

            {/* Área da tabela de classificação */}
            <section
                aria-label="Tabela de classificação"
                className="space-y-3 border-t border-border pt-6"
            >
                <h2 className="text-xl font-semibold">Classificação</h2>

                <div className="rounded-lg border border-border">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border text-muted-foreground">
                            <tr>
                                {rankingColumns.map((column) => (
                                    <th
                                        key={column}
                                        scope="col"
                                        className="px-4 py-3 text-left font-medium"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td
                                    colSpan={rankingColumns.length}
                                    className="px-4 py-10 text-center text-muted-foreground"
                                >
                                    Área das linhas da classificação
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
