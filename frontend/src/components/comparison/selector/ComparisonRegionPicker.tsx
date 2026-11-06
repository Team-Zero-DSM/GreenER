interface ComparisonRegionPickerProps {
    regioes: string[];
    regiaoAtual: string | null;
    onSelecionarRegiao: (regiao: string | null) => void;
    onFechar: () => void;
}

export function ComparisonRegionPicker({
    regioes,
    regiaoAtual,
    onSelecionarRegiao,
    onFechar,
}: ComparisonRegionPickerProps) {
    return (
        <div className="rounded-lg border border-border bg-background p-2">
            <div className="flex flex-col gap-1">
                <button
                    type="button"
                    onClick={() => {
                        onSelecionarRegiao(null);
                        onFechar();
                    }}
                    aria-pressed={regiaoAtual === null}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                        regiaoAtual === null ? 'bg-secondary' : ''
                    }`}
                >
                    <span className="flex-1">Usar região original</span>
                </button>

                {regioes.map((regiao) => {
                    const selecionada = regiao === regiaoAtual;

                    return (
                        <button
                            key={regiao}
                            type="button"
                            onClick={() => {
                                onSelecionarRegiao(regiao);
                                onFechar();
                            }}
                            aria-pressed={selecionada}
                            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                                selecionada ? 'bg-secondary' : ''
                            }`}
                        >
                            <span className="flex-1">{regiao}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
