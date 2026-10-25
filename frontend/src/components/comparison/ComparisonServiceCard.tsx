import { useRef, useState } from 'react';
import {
    ChevronDown,
    MapPin,
    MapPinned,
    Server,
    Star,
    X,
} from 'lucide-react';
import type { ServiceSummary } from '@/types/service';

import { useClickOutside } from '@/hooks/useClickOutside';
import { ComparisonColorPicker } from './ComparisonColorPicker';
import { ComparisonRegionPicker } from './ComparisonRegionPicker';

interface ComparisonServiceCardProps {
    servico: ServiceSummary;
    principal: boolean;
    cor: string;
    cores: string[];
    coresUsadasPorOutros: string[];
    regioes: string[];
    regiaoSimulada: string | null;
    onDefinirPrincipal: () => void;
    onSelecionarCor: (cor: string) => void;
    onConfirmarRegiao: (regiao: string | null) => void;
    onRemover: () => void;
}

export function ComparisonServiceCard({
    servico,
    principal,
    cor,
    cores,
    coresUsadasPorOutros,
    regioes,
    regiaoSimulada,
    onDefinirPrincipal,
    onSelecionarCor,
    onConfirmarRegiao,
    onRemover,
}: ComparisonServiceCardProps) {
    const [mostrarCores, setMostrarCores] = useState(false);
    const [mostrarRegioes, setMostrarRegioes] = useState(false);

    const corButtonRef = useRef<HTMLButtonElement>(null);
    const corPickerRef = useRef<HTMLDivElement>(null);

    const regiaoButtonRef = useRef<HTMLButtonElement>(null);
    const regiaoPickerRef = useRef<HTMLDivElement>(null);

    useClickOutside(
        mostrarCores,
        corButtonRef,
        corPickerRef,
        setMostrarCores,
    );

    useClickOutside(
        mostrarRegioes,
        regiaoButtonRef,
        regiaoPickerRef,
        setMostrarRegioes,
    );

    const regiaoOriginal =
        servico.location?.city ??
        servico.location?.region ??
        null;

    const nomeRegiao = regiaoSimulada ?? regiaoOriginal;

    const statusTexto =
        servico.active === undefined
            ? 'Status desconhecido'
            : servico.active
              ? 'Ativo'
              : 'Inativo';

    const statusCor =
        servico.active === undefined
            ? 'bg-muted-foreground'
            : servico.active
              ? 'bg-emerald-500'
              : 'bg-destructive';

    return (
        <div className="space-y-2">
            {/* Cartão */}
            <div
                className={`rounded-lg border p-3 transition-colors ${
                    principal ? 'border-blue-500' : 'border-border'
                }`}
            >
                <div className="flex items-start gap-3">
                    <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: cor }}
                    >
                        <Server
                            aria-hidden="true"
                            className="size-5 text-white"
                        />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                        {/* Nome e principal */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex min-w-0 items-start gap-1">
                                <button
                                    type="button"
                                    onClick={onDefinirPrincipal}
                                    aria-label={
                                        principal
                                            ? `${servico.name} é o serviço principal`
                                            : `Definir ${servico.name} como principal`
                                    }
                                    title="Definir serviço principal"
                                    className="shrink-0 rounded p-0.5 hover:bg-secondary"
                                >
                                    <Star
                                        aria-hidden="true"
                                        className={`size-4 ${
                                            principal
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-muted-foreground'
                                        }`}
                                    />
                                </button>

                                <h3
                                    className="break-words text-sm font-semibold"
                                    title={servico.name}
                                >
                                    {servico.name}
                                </h3>
                            </div>

                            {principal && (
                                <span className="shrink-0 rounded-full border border-blue-500 px-2 py-0.5 text-xs text-blue-500">
                                    Principal
                                </span>
                            )}
                        </div>

                        {/* Região */}
                        <div className="flex flex-wrap items-center gap-1.5 text-sm">
                            <MapPin
                                aria-hidden="true"
                                className="size-4 shrink-0 text-muted-foreground"
                            />

                            {nomeRegiao ? (
                                <>
                                    <span className="text-muted-foreground">
                                        {nomeRegiao}
                                    </span>

                                    {regiaoSimulada !== null ? (
                                        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-400">
                                            Simulada
                                        </span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            (original)
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-muted-foreground">
                                    Região não informada
                                </span>
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 text-sm">
                            <span
                                aria-hidden="true"
                                className={`size-2.5 shrink-0 rounded-full ${statusCor}`}
                            />
                            <span>{statusTexto}</span>
                        </div>
                    </div>
                </div>

                {/* Botões inferiores */}
                <div className="mt-3 border-t border-border pt-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <button
                            ref={corButtonRef}
                            type="button"
                            onClick={() =>
                                setMostrarCores((atual) => !atual)
                            }
                            aria-expanded={mostrarCores}
                            className="flex items-center gap-2 rounded-md px-1 py-1 text-sm hover:bg-secondary"
                        >
                            <span
                                className="size-6 shrink-0 rounded-full border border-border"
                                style={{ backgroundColor: cor }}
                            />
                            <span>Cor</span>
                            <ChevronDown
                                aria-hidden="true"
                                className={`size-4 transition-transform ${
                                    mostrarCores ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        <div className="flex flex-wrap items-center gap-1">
                            <button
                                ref={regiaoButtonRef}
                                type="button"
                                onClick={() =>
                                    setMostrarRegioes((atual) => !atual)
                                }
                                aria-expanded={mostrarRegioes}
                                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
                            >
                                <MapPinned
                                    aria-hidden="true"
                                    className="size-4 shrink-0"
                                />
                                <span>Simular região</span>
                            </button>

                            <button
                                type="button"
                                onClick={onRemover}
                                aria-label={`Remover ${servico.name} da comparação`}
                                title="Remover serviço"
                                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                            >
                                <X
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de cores */}
            {mostrarCores && (
                <div ref={corPickerRef}>
                    <ComparisonColorPicker
                        cores={cores}
                        corAtual={cor}
                        coresUsadasPorOutros={coresUsadasPorOutros}
                        onSelecionarCor={onSelecionarCor}
                        onFechar={() => setMostrarCores(false)}
                    />
                </div>
            )}

            {/* Lista de regiões */}
            {mostrarRegioes && (
                <div ref={regiaoPickerRef}>
                    <ComparisonRegionPicker
                        regioes={regioes}
                        regiaoAtual={regiaoSimulada}
                        onSelecionarRegiao={onConfirmarRegiao}
                        onFechar={() => setMostrarRegioes(false)}
                    />
                </div>
            )}
        </div>
    );
}