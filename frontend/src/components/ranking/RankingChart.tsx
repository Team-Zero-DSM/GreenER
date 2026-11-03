export function RankingChart() {
    return (
        <section aria-label="Gráfico do ranking" className="space-y-3 border-t border-border pt-6">
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
    );
}
