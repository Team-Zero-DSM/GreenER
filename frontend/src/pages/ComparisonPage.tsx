export function ComparisonPage() {
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
                <div className="space-y-3">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Serviços selecionados{' '}
                            <span className="text-sm text-muted-foreground">(máx. 5)</span>
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Selecione os serviços que deseja comparar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                        <div className="flex min-h-32 items-center justify-center rounded-lg border border-border p-4">
                            <p className="text-sm text-muted-foreground">
                                Área dos serviços selecionados
                            </p>
                        </div>

                        <div className="min-h-32 rounded-lg border border-border p-4">
                            <h3 className="font-medium">Alternar região de comparação</h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Para simular um serviço em outra região, clique na engrenagem e
                                selecione outra região disponível.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Local dos controles da comparação */}
                    <div className="flex flex-col gap-4 border-t border-border pt-6 lg:flex-row lg:items-end lg:justify-between">
                        {/* Grupo: Período */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Período</h3>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex min-h-9 items-center rounded-md border border-dashed border-border px-3 py-2">
                                    <p className="text-sm text-muted-foreground">1h</p>
                                </div>

                                <div className="flex min-h-9 items-center rounded-md border border-dashed border-border px-3 py-2">
                                    <p className="text-sm text-muted-foreground">6h</p>
                                </div>

                                <div className="flex min-h-9 items-center rounded-md border border-dashed border-border px-3 py-2">
                                    <p className="text-sm text-muted-foreground">24h</p>
                                </div>

                                <div className="flex min-h-9 items-center rounded-md border border-dashed border-border px-3 py-2">
                                    <p className="text-sm text-muted-foreground">7d</p>
                                </div>

                                <div className="flex min-h-9 items-center rounded-md border border-dashed border-border px-3 py-2">
                                    <p className="text-sm text-muted-foreground">30d</p>
                                </div>
                            </div>
                        </div>

                        {/* Grupo: Métrica e botão */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Métrica</h3>

                                <div className="flex min-h-10 min-w-40 items-center rounded-md border border-dashed border-border px-3 py-2">
                                    <p className="text-sm text-muted-foreground">
                                        Selecionar métrica
                                    </p>
                                </div>
                            </div>

                            <div className="flex min-h-10 items-center justify-center rounded-md border border-dashed border-border px-6 py-2">
                                <p className="text-sm text-muted-foreground">Botão Comparar</p>
                            </div>
                        </div>
                    </div>

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
