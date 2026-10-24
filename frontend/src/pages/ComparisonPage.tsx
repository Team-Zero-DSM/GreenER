export function ComparisonPage() {
    return (
        <>
        <main>
            <header>
                <h1 className="text-3xl font-semibold">Comparar Serviços</h1>
                <p className="text-muted-foreground">
                    Selecione os serviços que deseja comparar, defina o periodo e analise as metricas.
                </p>
            </header>

            <section className="space-y-3 border-t border-border pt-6">
                <div>
                    <h2 className="text-xl font-semibold">
                        Serviços selecionados <span className="text-sm text-muted-foreground">(max. 5)</span>
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        area para selecionar os serviços que serão comparados.
                    </p>
                </div>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
                <div className="rounded-lg border border-border p-4">
                    <h2 className="text-xl font-semibold">
                        Resumo comparativo - Emissões
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        O serviço de referencia é comparado com a média dos demais serviços selecionados
                    </p>
                </div>
            </section>
            
            </main>
        </>
    )
}