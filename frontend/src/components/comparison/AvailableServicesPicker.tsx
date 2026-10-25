import { MapPin, Server, X } from 'lucide-react';
import type { ServiceSummary } from '@/types/service';

interface AvailableServicesPickerProps {
    servicos: ServiceSummary[];
    onAdicionar: (servico: ServiceSummary) => void;
    onFechar: () => void;
}

export function AvailableServicesPicker({
    servicos,
    onAdicionar,
    onFechar,
}: AvailableServicesPickerProps) {
    return (
        <div className="space-y-4 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="font-semibold">
                        Adicionar serviço
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Escolha um serviço para incluir na comparação.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onFechar}
                    aria-label="Fechar lista de serviços"
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                    <X aria-hidden="true" className="size-4" />
                </button>
            </div>

            {servicos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    Nenhum serviço disponível.
                </p>
            ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {servicos.map((servico) => (
                        <button
                            key={servico.id}
                            type="button"
                            onClick={() => {
                                onAdicionar(servico);
                                onFechar();
                            }}
                            className="flex min-w-0 items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary"
                        >
                            <Server
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                            />

                            <div className="min-w-0 flex-1 space-y-1">
                                <span className="block break-words font-medium">
                                    {servico.name}
                                </span>

                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin
                                        aria-hidden="true"
                                        className="size-3.5 shrink-0"
                                    />

                                    {servico.location?.city ??
                                        servico.location?.region ??
                                        'Região não informada'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}