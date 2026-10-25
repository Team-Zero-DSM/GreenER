import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import type { ServiceSummary } from '@/types/service';

import { useClickOutside } from '@/hooks/useClickOutside';
import { mockComparisonServices } from '@/mocks/comparisonServices.mock';
import { mockComparisonRegions } from '@/mocks/comparisonRegions.mock';

import { AvailableServicesPicker } from './AvailableServicesPicker';
import { ComparisonServiceCard } from './ComparisonServiceCard';

interface ServicoSelecionado {
    idSelecao: string;
    servico: ServiceSummary;
    cor: string;
    regiaoSimulada: string | null;
}

const MAX_SERVICOS = 5;

const CORES = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#A855F7',
    '#EC4899',
];

export function ComparisonServiceSelector() {
    const [servicosSelecionados, setServicosSelecionados] =
        useState<ServicoSelecionado[]>([]);

    const [servicoPrincipalId, setServicoPrincipalId] =
        useState<string | null>(null);

    const [mostrarDisponiveis, setMostrarDisponiveis] =
        useState(false);

    const adicionarButtonRef = useRef<HTMLButtonElement>(null);
    const servicosPickerRef = useRef<HTMLDivElement>(null);

    // Fecha o catálogo quando o clique acontece fora dele.
    useClickOutside(
        mostrarDisponiveis,
        adicionarButtonRef,
        servicosPickerRef,
        setMostrarDisponiveis,
    );

    function adicionarServico(servico: ServiceSummary) {
        if (servicosSelecionados.length >= MAX_SERVICOS) {
            return;
        }

        const corDisponivel = CORES.find(
            (cor) =>
                !servicosSelecionados.some(
                    (item) => item.cor === cor,
                ),
        );

        if (!corDisponivel) {
            return;
        }

        const novoServico: ServicoSelecionado = {
            idSelecao: crypto.randomUUID(),
            servico,
            cor: corDisponivel,
            regiaoSimulada: null,
        };

        setServicosSelecionados((atuais) => [
            ...atuais,
            novoServico,
        ]);

        if (servicoPrincipalId === null) {
            setServicoPrincipalId(novoServico.idSelecao);
        }

        setMostrarDisponiveis(false);
    }

    function removerServico(idSelecao: string) {
        const atualizados = servicosSelecionados.filter(
            (item) => item.idSelecao !== idSelecao,
        );

        setServicosSelecionados(atualizados);

        if (servicoPrincipalId === idSelecao) {
            setServicoPrincipalId(
                atualizados[0]?.idSelecao ?? null,
            );
        }
    }

    function alterarCor(idSelecao: string, novaCor: string) {
        setServicosSelecionados((atuais) => {
            const servicoAlvo = atuais.find(
                (item) => item.idSelecao === idSelecao,
            );

            if (!servicoAlvo || servicoAlvo.cor === novaCor) {
                return atuais;
            }

            const servicoComCorEscolhida = atuais.find(
                (item) =>
                    item.idSelecao !== idSelecao &&
                    item.cor === novaCor,
            );

            return atuais.map((item) => {
                if (item.idSelecao === idSelecao) {
                    return {
                        ...item,
                        cor: novaCor,
                    };
                }

                if (
                    servicoComCorEscolhida &&
                    item.idSelecao === servicoComCorEscolhida.idSelecao
                ) {
                    return {
                        ...item,
                        cor: servicoAlvo.cor,
                    };
                }

                return item;
            });
        });
    }

    function alterarRegiao(
        idSelecao: string,
        regiao: string | null,
    ) {
        setServicosSelecionados((atuais) =>
            atuais.map((item) =>
                item.idSelecao === idSelecao
                    ? {
                          ...item,
                          regiaoSimulada: regiao,
                      }
                    : item,
            ),
        );
    }

    return (
        <section className="space-y-4">
            {/* Título da área */}
            <div>
                <h2 className="text-xl font-semibold">
                    Serviços selecionados{' '}
                    <span className="text-sm text-muted-foreground">
                        (máx. {MAX_SERVICOS})
                    </span>
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Selecione os serviços que deseja comparar.
                </p>
            </div>

            {/* Cartões e botão para adicionar */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {servicosSelecionados.map((item) => {
                    const id = item.idSelecao;

                    const coresUsadasPorOutros =
                        servicosSelecionados
                            .filter((outro) => outro.idSelecao !== id)
                            .map((outro) => outro.cor);

                    return (
                        <ComparisonServiceCard
                            key={id}
                            servico={item.servico}
                            principal={servicoPrincipalId === id}
                            cor={item.cor}
                            cores={CORES}
                            coresUsadasPorOutros={coresUsadasPorOutros}
                            regioes={mockComparisonRegions}
                            regiaoSimulada={item.regiaoSimulada}
                            onDefinirPrincipal={() =>
                                setServicoPrincipalId(id)
                            }
                            onSelecionarCor={(cor) =>
                                alterarCor(id, cor)
                            }
                            onConfirmarRegiao={(regiao) =>
                                alterarRegiao(id, regiao)
                            }
                            onRemover={() => removerServico(id)}
                        />
                    );
                })}

                {/* Botão para adicionar serviço */}
                <button
                    ref={adicionarButtonRef}
                    type="button"
                    disabled={servicosSelecionados.length >= MAX_SERVICOS}
                    aria-expanded={mostrarDisponiveis}
                    aria-controls="servicos-disponiveis"
                    onClick={() =>
                        setMostrarDisponiveis((atual) => !atual)
                    }
                    className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus aria-hidden="true" className="size-7" />

                    <span className="font-medium">
                        Adicionar serviço
                    </span>

                    <span className="text-xs">
                        {servicosSelecionados.length}/{MAX_SERVICOS} selecionados
                    </span>
                </button>
            </div>

            {/* Catálogo de serviços disponíveis */}
            {mostrarDisponiveis &&
                servicosSelecionados.length < MAX_SERVICOS && (
                    <div
                        ref={servicosPickerRef}
                        id="servicos-disponiveis"
                    >
                        <AvailableServicesPicker
                            servicos={mockComparisonServices}
                            onAdicionar={adicionarServico}
                            onFechar={() =>
                                setMostrarDisponiveis(false)
                            }
                        />
                    </div>
                )}
        </section>
    );
}