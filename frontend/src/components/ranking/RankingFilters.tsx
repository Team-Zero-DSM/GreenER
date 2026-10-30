export function RankingFilters() {
    return (
        <section
            aria-label="Filtros do ranking"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
            <div className="flex min-h-10 items-center rounded-md border border-dashed border-border px-3 py-2">
                <p className="text-sm text-muted-foreground">Emissão (CO₂e) | Energia</p>
            </div>

            <div className="flex min-h-10 items-center rounded-md border border-dashed border-border px-3 py-2">
                <p className="text-sm text-muted-foreground">1h | 6h | 24h | 7d | 30d</p>
            </div>
        </section>
    );
}
