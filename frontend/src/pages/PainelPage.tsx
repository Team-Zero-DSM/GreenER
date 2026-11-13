export function PainelPage() {
    return (
        // O painel não usa o PageShell: ele ocupa toda a largura da tela, sem o
        // limite max-w-7xl das demais páginas, para caber mais indicadores lado a lado.
        <main className="w-full space-y-4 p-4 sm:p-6">
            <header className="min-w-0 space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Painel de monitoramento</h1>
                <p className="text-muted-foreground">
                    Indicadores de operação e impacto ambiental reunidos em um painel
                    personalizável.
                </p>
            </header>
        </main>
    );
}
