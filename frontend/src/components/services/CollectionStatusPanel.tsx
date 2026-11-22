import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
    Activity,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock3,
    TriangleAlert,
    X,
} from 'lucide-react';

import { useClickOutside } from '@/hooks/useClickOutside';
import {
    fetchCollectionStatuses,
    fetchCollectionStatusHistory,
    type CollectionStatusItem,
    type CollectionStatusQuery,
} from '@/api/collection-status';
import { useApiQuery } from '@/hooks/useApiQuery';
import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';
import {
    DROPDOWN_SURFACE_CLASS_NAME,
    getDropdownOptionClassName,
    getDropdownTriggerClassName,
} from '@/components/shared/dropdownStyles';

const typeLabels: Record<string, string> = {
    success: 'Coleta realizada',
    timeout: 'Tempo de espera excedido',
    metrics_missing: 'Métricas indisponíveis',
    service_missing: 'Serviço não encontrado',
    unavailable: 'Falha de conexão',
    bad_status: 'Erro na plataforma',
    cloudflare_error: 'Falha de acesso à plataforma',
    invalid_response: 'Dados inválidos',
    unexpected_error: 'Não foi possível concluir a coleta',
};

function formatTimestamp(value: string | null | undefined) {
    if (!value) return '—';
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'short',
        timeStyle: 'medium',
    }).format(new Date(value));
}

function AttemptBadge({
    service,
}: {
    service: Pick<CollectionStatusItem, 'result' | 'latestAttempt'>;
}) {
    const Icon =
        service.result === 'success'
            ? CheckCircle2
            : service.result === 'pending'
              ? Clock3
              : TriangleAlert;
    const label = service.latestAttempt
        ? (typeLabels[service.latestAttempt.type] ?? 'Falha na coleta')
        : 'Sem tentativas';
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${service.result === 'success' ? 'border-primary/15 bg-primary/[0.08] text-primary' : service.result === 'pending' ? 'border-border/70 bg-muted/40 text-muted-foreground' : 'border-amber-400/20 bg-amber-400/[0.08] text-amber-300'}`}
        >
            <Icon size={13} className="shrink-0" aria-hidden="true" />
            {label}
        </span>
    );
}

function CollectionStatusHistory({ externalId, name }: { externalId: string; name: string }) {
    const fetcher = useCallback(() => fetchCollectionStatusHistory(externalId), [externalId]);
    const { data, error, isLoading } = useApiQuery(fetcher);
    const [visibleCount, setVisibleCount] = useState(20);

    return (
        <section aria-label={`Histórico de ${name}`} className="space-y-3">
            <div>
                <h3 className="font-medium">Histórico de coleta · {name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                    Tentativas mais recentes · Horários de Brasília
                </p>
            </div>
            {isLoading && (
                <p role="status" className="py-4 text-sm text-muted-foreground">
                    Carregando histórico...
                </p>
            )}
            {error && (
                <p role="alert" className="text-sm text-destructive">
                    Não foi possível atualizar o histórico: {error}
                    {data
                        ? ' Exibindo os últimos dados recebidos.'
                        : ' Feche e abra o histórico para tentar novamente.'}
                </p>
            )}
            {data &&
                (data.items.length === 0 ? (
                    <p className="py-4 text-sm text-muted-foreground">
                        Este serviço ainda não possui tentativas registradas.
                    </p>
                ) : (
                    <>
                        <div className="space-y-3 lg:hidden">
                            <ol className="space-y-3">
                                {data.items.slice(0, visibleCount).map((attempt) => (
                                    <li
                                        key={attempt.id}
                                        className="space-y-2 rounded-xl border bg-background/40 p-4"
                                    >
                                        <p className="text-xs text-muted-foreground tabular-nums">
                                            {formatTimestamp(attempt.observedAt)}
                                        </p>
                                        <AttemptBadge
                                            service={{
                                                result: attempt.result,
                                                latestAttempt: attempt,
                                            }}
                                        />
                                        <p className="break-words text-sm leading-relaxed">
                                            {attempt.type === 'unexpected_error'
                                                ? 'Não foi possível concluir a coleta.'
                                                : attempt.description}
                                        </p>
                                        {attempt.httpStatus !== null && (
                                            <p className="text-xs text-muted-foreground">
                                                Código HTTP: {attempt.httpStatus}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ol>
                            <p className="text-center text-xs text-muted-foreground">
                                Mostrando {Math.min(visibleCount, data.items.length)} de{' '}
                                {data.items.length} tentativas recebidas
                            </p>
                            {visibleCount < data.items.length && (
                                <button
                                    type="button"
                                    onClick={() => setVisibleCount((count) => count + 20)}
                                    className="min-h-11 w-full rounded-lg border py-3 text-sm font-medium text-primary"
                                >
                                    Mostrar mais 20 tentativas
                                </button>
                            )}
                        </div>
                        <div className="hidden max-h-96 overflow-auto rounded-lg border lg:block">
                            <table className="w-full text-left text-sm">
                                <caption className="sr-only">
                                    Últimas tentativas de coleta de {name}
                                </caption>
                                <thead className="sticky top-0 bg-secondary text-xs text-muted-foreground">
                                    <tr>
                                        {['Data e hora', 'Resultado', 'Descrição', 'HTTP'].map(
                                            (label) => (
                                                <th
                                                    key={label}
                                                    scope="col"
                                                    className="whitespace-nowrap px-4 py-3 font-medium"
                                                >
                                                    {label}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {data.items.map((attempt) => (
                                        <tr key={attempt.id}>
                                            <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums">
                                                {formatTimestamp(attempt.observedAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <AttemptBadge
                                                    service={{
                                                        result: attempt.result,
                                                        latestAttempt: attempt,
                                                    }}
                                                />
                                            </td>
                                            <td className="min-w-60 px-4 py-3 text-xs text-muted-foreground">
                                                {attempt.type === 'unexpected_error'
                                                    ? 'Não foi possível concluir a coleta.'
                                                    : attempt.description}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                {attempt.httpStatus ?? '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ))}
        </section>
    );
}

function MobileHistoryDialog({
    service,
    onClose,
}: {
    service: CollectionStatusItem;
    onClose: () => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const dialog = dialogRef.current;
        const previousOverflow = document.body.style.overflow;
        if (dialog && !dialog.open) dialog.showModal();
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            aria-labelledby="mobile-history-title"
            className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-lg overscroll-contain overflow-y-auto rounded-2xl border bg-popover p-0 text-foreground shadow-2xl backdrop:bg-black/70"
        >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-popover p-4">
                <h2 id="mobile-history-title" className="font-semibold">
                    Histórico do serviço
                </h2>
                <button
                    type="button"
                    aria-label="Fechar histórico"
                    onClick={onClose}
                    className="flex size-11 shrink-0 items-center justify-center rounded-lg border hover:bg-white/5"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="p-4">
                <CollectionStatusHistory externalId={service.externalId} name={service.name} />
            </div>
        </dialog>
    );
}

interface ResultsProps {
    query: CollectionStatusQuery;
    onResult: (result: CollectionStatusQuery['result']) => void;
    onPage: (page: number) => void;
}

function CollectionStatusResults({ query, onResult, onPage }: ResultsProps) {
    const fetcher = useCallback(
        async () => ({
            response: await fetchCollectionStatuses(query),
            query,
        }),
        [query],
    );
    const { data: loaded, error, isLoading } = useApiQuery(fetcher);
    const data = loaded?.response;
    const isUpdating = loaded !== null && loaded.query !== query && !error;
    const [expanded, setExpanded] = useState<string | null>(null);
    const [mobileHistory, setMobileHistory] = useState<CollectionStatusItem | null>(null);
    if (isLoading)
        return (
            <p role="status" className="rounded-xl border bg-card p-8 text-muted-foreground">
                Carregando status de coleta...
            </p>
        );
    if (!data)
        return (
            <div role="alert" className="rounded-xl border border-destructive/30 bg-card p-6">
                <p className="text-destructive">
                    {error ?? 'Não foi possível carregar os status.'}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Tente buscar novamente ou altere um filtro.
                </p>
            </div>
        );

    const cards = [
        {
            label: 'Serviços monitorados',
            count: data.summary.totalServices,
            note: 'Correspondentes à busca',
            icon: Activity,
            color: 'text-cyan-300',
            filter: 'all' as const,
        },
        {
            label: 'Última coleta com sucesso',
            count: data.summary.successfulServices,
            note: 'Última tentativa bem-sucedida',
            icon: CheckCircle2,
            color: 'text-primary',
            filter: 'success' as const,
        },
        {
            label: 'Precisam de atenção',
            count: data.summary.failedServices,
            note: 'Última tentativa com falha',
            icon: TriangleAlert,
            color: 'text-amber-300',
            filter: 'failure' as const,
        },
        {
            label: 'Aguardando coleta',
            count: data.summary.pendingServices,
            note: 'Sem tentativas registradas',
            icon: Clock3,
            color: 'text-muted-foreground',
            filter: 'pending' as const,
        },
    ];

    return (
        <>
            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
                >
                    Não foi possível atualizar: {error} Exibindo os últimos dados recebidos.
                </p>
            )}
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {cards.map(({ label, count, note, icon: Icon, color, filter }) => (
                    <button
                        key={filter}
                        type="button"
                        aria-pressed={query.result === filter}
                        onClick={() => onResult(filter)}
                        className={`rounded-xl border bg-card p-3 text-left transition-colors hover:bg-white/10 sm:p-5 ${query.result === filter ? 'border-primary/40' : 'border-white/10'}`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground sm:text-sm">
                                {label}
                            </span>
                            <Icon size={18} className={`shrink-0 ${color}`} aria-hidden="true" />
                        </div>
                        <p className={`mt-3 text-3xl font-semibold tabular-nums ${color}`}>
                            {count}
                        </p>
                        <p className="mt-1 hidden text-xs text-muted-foreground sm:block">{note}</p>
                    </button>
                ))}
            </div>
            <div aria-busy={isUpdating} className="overflow-hidden rounded-xl border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-4 sm:px-5 sm:py-5">
                    <div>
                        <h2 className="text-base font-semibold sm:text-lg">
                            Acompanhamento das coletas
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Última tentativa e última coleta com sucesso de cada serviço.
                        </p>
                    </div>
                    <span
                        role="status"
                        className="rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground tabular-nums"
                    >
                        {isUpdating
                            ? 'Atualizando serviços...'
                            : `${data.pagination.total} serviços encontrados`}
                    </span>
                </div>
                <div className="divide-y lg:hidden">
                    {data.items.map((service) => (
                        <article key={service.externalId} className="space-y-4 p-4">
                            <div>
                                <h3 className="break-words font-semibold">{service.name}</h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {[service.location.city, service.location.country]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </p>
                            </div>
                            <AttemptBadge service={service} />
                            <dl className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <dt className="text-muted-foreground">Última tentativa</dt>
                                    <dd className="mt-1 leading-relaxed tabular-nums">
                                        {service.latestAttempt
                                            ? formatTimestamp(service.latestAttempt.observedAt)
                                            : 'Sem registro'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Último sucesso</dt>
                                    <dd className="mt-1 leading-relaxed tabular-nums">
                                        {formatTimestamp(service.lastSuccessfulCollectionAt)}
                                    </dd>
                                </div>
                            </dl>
                            <button
                                type="button"
                                aria-haspopup="dialog"
                                aria-label={`Ver histórico de ${service.name}`}
                                onClick={() => setMobileHistory(service)}
                                className="flex min-h-11 w-full items-center justify-between rounded-lg border px-3 py-3 text-sm font-medium text-primary"
                            >
                                Ver histórico
                                <ChevronRight size={16} aria-hidden="true" />
                            </button>
                        </article>
                    ))}
                    {data.items.length === 0 && (
                        <p className="p-6 text-center text-sm text-muted-foreground">
                            Nenhum serviço encontrado nesta página com esses filtros.
                        </p>
                    )}
                </div>
                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[960px] table-fixed text-left text-sm">
                        <caption className="sr-only">
                            Status reais de coleta por serviço. Horários de Brasília.
                        </caption>
                        <colgroup>
                            <col className="w-[24%]" />
                            <col className="w-[20%]" />
                            <col className="w-[23%]" />
                            <col className="w-[20%]" />
                            <col className="w-[13%]" />
                        </colgroup>
                        <thead className="border-b border-border/60 bg-muted/25 text-[11px] text-muted-foreground">
                            <tr>
                                {[
                                    'Serviço',
                                    'Última tentativa',
                                    'Resultado da coleta',
                                    'Último sucesso',
                                    'Histórico',
                                ].map((label) => (
                                    <th
                                        scope="col"
                                        key={label}
                                        className="whitespace-nowrap px-5 py-3.5 font-semibold uppercase tracking-[0.06em]"
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {data.items.map((service) => (
                                <Fragment key={service.externalId}>
                                    <tr className="group transition-colors duration-150 hover:bg-muted/25">
                                        <td className="px-5 py-3.5">
                                            <p className="truncate font-medium text-foreground">
                                                {service.name}
                                            </p>
                                            <div className="mt-1.5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                                                <span className="truncate">
                                                    {[
                                                        service.location.city,
                                                        service.location.country,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' · ')}
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className="size-1 shrink-0 rounded-full bg-border"
                                                />
                                                <span className="shrink-0 font-mono text-[11px]">
                                                    {service.location.regionCode}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground tabular-nums">
                                            {service.latestAttempt
                                                ? formatTimestamp(service.latestAttempt.observedAt)
                                                : 'Sem registro'}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <AttemptBadge service={service} />
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground tabular-nums">
                                            {formatTimestamp(service.lastSuccessfulCollectionAt)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                type="button"
                                                aria-label={`${expanded === service.externalId ? 'Fechar' : 'Ver'} histórico de ${service.name}`}
                                                aria-expanded={expanded === service.externalId}
                                                aria-controls={`attempt-${service.externalId}`}
                                                onClick={() =>
                                                    setExpanded(
                                                        expanded === service.externalId
                                                            ? null
                                                            : service.externalId,
                                                    )
                                                }
                                                className="inline-flex min-h-10 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-transparent px-3 text-xs font-semibold text-primary transition-colors hover:border-primary/15 hover:bg-primary/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                                            >
                                                {expanded === service.externalId
                                                    ? 'Fechar'
                                                    : 'Ver histórico'}
                                                {expanded === service.externalId ? (
                                                    <ChevronDown size={14} />
                                                ) : (
                                                    <ChevronRight size={14} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                    {expanded === service.externalId && (
                                        <tr id={`attempt-${service.externalId}`}>
                                            <td colSpan={5} className="bg-background/40 px-5 py-5">
                                                <CollectionStatusHistory
                                                    key={service.externalId}
                                                    externalId={service.externalId}
                                                    name={service.name}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                            {data.items.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-muted-foreground"
                                    >
                                        Nenhum serviço encontrado nesta página com esses filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p className="text-xs text-muted-foreground">
                        {data.pagination.totalPages > 0
                            ? `Página ${data.pagination.page} de ${data.pagination.totalPages}`
                            : 'Nenhum resultado'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        <button
                            type="button"
                            disabled={isUpdating || data.pagination.page <= 1}
                            onClick={() => onPage(data.pagination.page - 1)}
                            className="min-h-11 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            disabled={
                                isUpdating || data.pagination.page >= data.pagination.totalPages
                            }
                            onClick={() => onPage(data.pagination.page + 1)}
                            className="min-h-11 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
                <p className="border-t px-5 py-3 text-xs text-muted-foreground">
                    Uma falha na coleta pode indicar dificuldade de acesso às métricas e não
                    confirma que o serviço esteja fora do ar.
                </p>
            </div>
            {mobileHistory && (
                <MobileHistoryDialog
                    key={mobileHistory.externalId}
                    service={mobileHistory}
                    onClose={() => setMobileHistory(null)}
                />
            )}
        </>
    );
}

interface CollectionFilterSelectProps {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}

function CollectionFilterSelect({ label, value, options, onChange }: CollectionFilterSelectProps) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useClickOutside(open, buttonRef, pickerRef, setOpen);

    const selected = options.find((option) => option.value === value);

    return (
        <div className={`relative min-w-0 ${open ? 'z-50' : 'z-0'}`}>
            <button
                ref={buttonRef}
                type="button"
                aria-label={label}
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className={getDropdownTriggerClassName(open)}
            >
                <span className="truncate">{selected?.label ?? value}</span>

                <ChevronDown
                    aria-hidden="true"
                    className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div
                    ref={pickerRef}
                    className={`absolute left-0 top-full z-[60] mt-2 max-h-60 w-full overflow-y-auto ${DROPDOWN_SURFACE_CLASS_NAME}`}
                >
                    <div className="flex flex-col gap-1">
                        {options.map((option) => {
                            const selected = option.value === value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className={`${getDropdownOptionClassName(selected)} justify-between`}
                                >
                                    <span>{option.label}</span>

                                    {selected && (
                                        <Check aria-hidden="true" className="size-4 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export function CollectionStatusPanel() {
    const [draft, setDraft] = useState('');
    const [query, setQuery] = useState<CollectionStatusQuery>({
        search: '',
        result: 'all',
        page: 1,
        limit: 20,
    });

    return (
        <section aria-label="Status de coleta" className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Dados do banco · Atualização a cada coleta
                </span>
                <span>Horários de Brasília</span>
            </div>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    setQuery({ ...query, search: draft.trim(), page: 1 });
                }}
                className="relative z-20 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center"
            >
                <FloatingLabelInput
                    className="col-span-2 min-w-0 flex-1 sm:min-w-56 sm:-translate-y-1.5"
                    label="Buscar serviço"
                    type="search"
                    maxLength={100}
                    placeholder="Buscar por nome ou identificador..."
                    value={draft}
                    onChange={setDraft}
                />

                <button
                    type="submit"
                    className="col-span-2 min-h-11 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:border-emerald-400/50 hover:bg-emerald-400/15"
                >
                    Buscar
                </button>

                <div className="flex min-w-0 flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center">
                    <span>Resultado</span>

                    <CollectionFilterSelect
                        label="Resultado"
                        value={query.result}
                        options={[
                            { value: 'all', label: 'Todos os resultados' },
                            { value: 'success', label: 'Sucesso' },
                            { value: 'failure', label: 'Com falha' },
                            { value: 'pending', label: 'Sem tentativas' },
                        ]}
                        onChange={(value) =>
                            setQuery({
                                ...query,
                                result: value as CollectionStatusQuery['result'],
                                page: 1,
                            })
                        }
                    />
                </div>
            </form>

            <CollectionStatusResults
                query={query}
                onResult={(result) => setQuery({ ...query, result, page: 1 })}
                onPage={(page) => setQuery({ ...query, page })}
            />
        </section>
    );
}
