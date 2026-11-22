import type { Region } from '@/types/api';
import {
    DROPDOWN_SURFACE_CLASS_NAME,
    getDropdownOptionClassName,
} from '@/components/shared/dropdownStyles';

interface ComparisonRegionPickerProps {
    regioes: Region[];
    regiaoAtual: string | null;
    regioesCarregando: boolean;
    erroRegioes: string | null;
    onSelecionarRegiao: (regiao: string | null) => void;
    onFechar: () => void;
}

export function ComparisonRegionPicker({
    regioes,
    regiaoAtual,
    regioesCarregando,
    erroRegioes,
    onSelecionarRegiao,
    onFechar,
}: ComparisonRegionPickerProps) {
    return (
        <div className={DROPDOWN_SURFACE_CLASS_NAME}>
            <div className="flex flex-col gap-1">
                {/* Utilizar a região original do serviço. */}
                <button
                    type="button"
                    onClick={() => {
                        onSelecionarRegiao(null);
                        onFechar();
                    }}
                    aria-pressed={regiaoAtual === null}
                    className={`${getDropdownOptionClassName(regiaoAtual === null)} gap-3`}
                >
                    <span className="flex-1">Usar região original</span>
                </button>

                {/* Estados de carregamento e erro. */}
                {regioesCarregando ? (
                    <p className="px-3 py-3 text-sm text-muted-foreground">Carregando regiões...</p>
                ) : erroRegioes && regioes.length === 0 ? (
                    <p className="px-3 py-3 text-sm text-red-400">
                        Não foi possível carregar as regiões: {erroRegioes}
                    </p>
                ) : regioes.length === 0 ? (
                    <p className="px-3 py-3 text-sm text-muted-foreground">
                        Nenhuma região cadastrada.
                    </p>
                ) : (
                    /* Lista de regiões recebidas da API. */
                    regioes.map((regiao) => {
                        const selecionada = regiao.code === regiaoAtual;

                        return (
                            <button
                                key={regiao.code}
                                type="button"
                                onClick={() => {
                                    onSelecionarRegiao(regiao.code);
                                    onFechar();
                                }}
                                aria-pressed={selecionada}
                                className={`${getDropdownOptionClassName(selecionada)} gap-3`}
                            >
                                <span className="flex flex-1 flex-col">
                                    <span className="font-medium">
                                        {regiao.city ?? regiao.region}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        {regiao.country}
                                    </span>
                                </span>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
