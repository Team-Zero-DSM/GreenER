import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Calculator, Check, Gauge, Settings, Users, X } from 'lucide-react';
import { Link } from 'react-router';

import {
    activateEstimate,
    getCollectionSettings,
    getEstimateCoefficients,
    getProjectMembers,
    previewEstimate,
    updateCollectionSettings,
    updateProjectMember,
    type CollectionSettings,
    type EstimateCoefficients,
    type EstimateInputs,
    type EstimatePreview,
    type ProjectMember,
} from '@/api/project';
import { useMonitoring } from '@/contexts/monitoring';
import { useProfile } from '@/hooks/useProfile';
import type { ProfileRole } from '@/types/profile';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Feedback = { type: 'success' | 'error'; message: string } | null;
type EstimateField = keyof EstimateInputs;

function AdminSection({
    id,
    icon: Icon,
    title,
    description,
    action,
    children,
}: {
    id: string;
    icon: typeof Settings;
    title: string;
    description: string;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <Card id={id} className="scroll-mt-28 border border-border/70 bg-card/80">
            <CardHeader className="gap-3 border-b border-border/70 pb-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <div className="space-y-1">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
                {action}
            </CardHeader>
            <CardContent className="space-y-5">{children}</CardContent>
        </Card>
    );
}

function FeedbackMessage({ feedback }: { feedback: Feedback }) {
    if (!feedback) return null;
    const isError = feedback.type === 'error';
    const Icon = isError ? X : Check;

    return (
        <p
            role={isError ? 'alert' : 'status'}
            className={`flex items-start gap-2 text-sm ${isError ? 'text-destructive' : 'text-primary'}`}
        >
            <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{feedback.message}</span>
        </p>
    );
}

function SettingField({
    label,
    value,
    onChange,
    min = 0,
    step = 'any',
    max,
    disabled = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    min?: number;
    step?: number | 'any';
    max?: number;
    disabled?: boolean;
}) {
    return (
        <label className="flex min-w-0 flex-col gap-2 text-sm font-medium">
            <span>{label}</span>
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-input bg-background/70 px-3 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
        </label>
    );
}

function formatDate(value: string | null | undefined): string {
    if (!value) return 'Nenhuma rodada concluída';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Data indisponível';
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
}

function toInputs(coefficients: EstimateCoefficients | null): Record<EstimateField, string> {
    return {
        cpuMaxWatts: coefficients ? String(coefficients.cpuMaxWatts) : '',
        ramWattsPerGb: coefficients ? String(coefficients.ramWattsPerGb) : '',
        diskWattsPerGb: coefficients ? String(coefficients.diskWattsPerGb) : '',
        networkWattsPerGb: coefficients ? String(coefficients.networkWattsPerGb) : '',
    };
}

function toNumbers(values: Record<EstimateField, string>): EstimateInputs | null {
    const numbers: EstimateInputs = {
        cpuMaxWatts: Number(values.cpuMaxWatts),
        ramWattsPerGb: Number(values.ramWattsPerGb),
        diskWattsPerGb: Number(values.diskWattsPerGb),
        networkWattsPerGb: Number(values.networkWattsPerGb),
    };
    const rawValues = Object.values(values);
    if (
        rawValues.some((value) => value.trim() === '') ||
        Object.values(numbers).some((value) => !Number.isFinite(value) || value < 0)
    ) {
        return null;
    }
    return numbers;
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(value);
}

export function AdminSettingsPage() {
    const { profile, isLoading, error, reload } = useProfile();
    const { status: monitoringStatus, error: monitoringError } = useMonitoring();

    const [collectionSettings, setCollectionSettings] = useState<CollectionSettings | null>(null);
    const [collectionInterval, setCollectionInterval] = useState('');
    const [isLoadingCollection, setIsLoadingCollection] = useState(true);
    const [isSavingCollection, setIsSavingCollection] = useState(false);
    const [collectionFeedback, setCollectionFeedback] = useState<Feedback>(null);

    const [activeCoefficients, setActiveCoefficients] = useState<EstimateCoefficients | null>(null);
    const [estimateValues, setEstimateValues] = useState<Record<EstimateField, string>>({
        cpuMaxWatts: '',
        ramWattsPerGb: '',
        diskWattsPerGb: '',
        networkWattsPerGb: '',
    });
    const [estimatePreview, setEstimatePreview] = useState<EstimatePreview | null>(null);
    const [isLoadingCoefficients, setIsLoadingCoefficients] = useState(true);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [estimateFeedback, setEstimateFeedback] = useState<Feedback>(null);

    const [search, setSearch] = useState('');
    const [submittedSearch, setSubmittedSearch] = useState('');
    const [users, setUsers] = useState<ProjectMember[]>([]);
    const [roleDrafts, setRoleDrafts] = useState<Record<string, ProfileRole>>({});
    const [savingMemberId, setSavingMemberId] = useState<string | null>(null);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);
    const [membersFeedback, setMembersFeedback] = useState<Feedback>(null);

    useEffect(() => {
        if (isLoading || profile?.role !== 'admin') return;
        let cancelled = false;
        getCollectionSettings()
            .then((settings) => {
                if (cancelled) return;
                setCollectionSettings(settings);
                setCollectionInterval(String(settings.intervalSeconds));
            })
            .catch((requestError: unknown) => {
                if (!cancelled) {
                    setCollectionFeedback({
                        type: 'error',
                        message:
                            requestError instanceof Error
                                ? requestError.message
                                : 'Não foi possível carregar as configurações da coleta.',
                    });
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoadingCollection(false);
            });

        getEstimateCoefficients()
            .then((coefficients) => {
                if (cancelled) return;
                setActiveCoefficients(coefficients);
                setEstimateValues(toInputs(coefficients));
            })
            .catch((requestError: unknown) => {
                if (!cancelled) {
                    setEstimateFeedback({
                        type: 'error',
                        message:
                            requestError instanceof Error
                                ? requestError.message
                                : 'Não foi possível carregar os parâmetros ativos.',
                    });
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoadingCoefficients(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isLoading, profile?.role]);

    useEffect(() => {
        if (isLoading || profile?.role !== 'admin') return;
        let cancelled = false;
        getProjectMembers(submittedSearch)
            .then((members) => {
                if (cancelled) return;
                setUsers(members);
                setRoleDrafts({});
            })
            .catch((requestError: unknown) => {
                if (!cancelled) {
                    setMembersFeedback({
                        type: 'error',
                        message:
                            requestError instanceof Error
                                ? requestError.message
                                : 'Não foi possível carregar os usuários.',
                    });
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoadingMembers(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isLoading, profile?.role, submittedSearch]);

    const numericEstimateValues = useMemo(() => toNumbers(estimateValues), [estimateValues]);

    async function handleSaveInterval(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const interval = Number(collectionInterval);
        if (!Number.isInteger(interval) || interval < 10 || interval > 3600) {
            setCollectionFeedback({
                type: 'error',
                message: 'Informe um intervalo inteiro entre 10 e 3.600 segundos.',
            });
            return;
        }

        setIsSavingCollection(true);
        setCollectionFeedback(null);
        try {
            await updateCollectionSettings(interval);
            const settings = await getCollectionSettings();
            setCollectionSettings(settings);
            setCollectionInterval(String(settings.intervalSeconds));
            setCollectionFeedback({ type: 'success', message: 'Intervalo salvo com sucesso.' });
        } catch (requestError) {
            setCollectionFeedback({
                type: 'error',
                message:
                    requestError instanceof Error
                        ? requestError.message
                        : 'Não foi possível salvar o intervalo.',
            });
        } finally {
            setIsSavingCollection(false);
        }
    }

    async function handlePreview(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!numericEstimateValues) {
            setEstimateFeedback({
                type: 'error',
                message:
                    'Preencha todos os parâmetros com valores numéricos iguais ou maiores que zero.',
            });
            return;
        }

        setIsPreviewing(true);
        setEstimateFeedback(null);
        try {
            const preview = await previewEstimate(numericEstimateValues);
            setEstimatePreview(preview);
            setEstimateFeedback({
                type: 'success',
                message: 'Simulação calculada com a amostra de uma hora.',
            });
        } catch (requestError) {
            setEstimateFeedback({
                type: 'error',
                message:
                    requestError instanceof Error
                        ? requestError.message
                        : 'Não foi possível simular os parâmetros.',
            });
        } finally {
            setIsPreviewing(false);
        }
    }

    async function handleActivateEstimate() {
        if (!estimatePreview || !numericEstimateValues) return;
        setIsActivating(true);
        setEstimateFeedback(null);
        try {
            const coefficients = await activateEstimate(numericEstimateValues);
            setActiveCoefficients(coefficients);
            setEstimatePreview(null);
            setEstimateFeedback({
                type: 'success',
                message: 'Novos parâmetros ativados com sucesso.',
            });
        } catch (requestError) {
            setEstimateFeedback({
                type: 'error',
                message:
                    requestError instanceof Error
                        ? requestError.message
                        : 'Não foi possível ativar os parâmetros.',
            });
        } finally {
            setIsActivating(false);
        }
    }

    async function saveMember(member: ProjectMember, role: ProfileRole, active: boolean) {
        setSavingMemberId(member.id);
        setMembersFeedback(null);
        try {
            const updated = await updateProjectMember(member.id, { role, active });
            setUsers((current) => current.map((user) => (user.id === updated.id ? updated : user)));
            setRoleDrafts((current) => {
                const next = { ...current };
                delete next[member.id];
                return next;
            });
            setMembersFeedback({
                type: 'success',
                message:
                    active === member.active
                        ? `Papel de ${member.name} atualizado.`
                        : `Acesso de ${member.name} atualizado.`,
            });
        } catch (requestError) {
            setMembersFeedback({
                type: 'error',
                message:
                    requestError instanceof Error
                        ? requestError.message
                        : `Não foi possível atualizar ${member.name}.`,
            });
        } finally {
            setSavingMemberId(null);
        }
    }

    if (isLoading) {
        return (
            <PageShell>
                <PageHeader
                    title="Configuração do projeto"
                    description="Gerencie coleta, estimativas ambientais e acesso ao GreenER."
                />
                <Card className="border border-border/70">
                    <CardContent className="py-8 text-sm text-muted-foreground">
                        Carregando seu perfil...
                    </CardContent>
                </Card>
            </PageShell>
        );
    }

    if (error || !profile) {
        return (
            <PageShell>
                <PageHeader
                    title="Configuração do projeto"
                    description="Gerencie coleta, estimativas ambientais e acesso ao GreenER."
                />
                <Card className="border border-border/70">
                    <CardContent className="flex flex-col items-start gap-4 py-6">
                        <p className="text-sm text-destructive">
                            {error ?? 'Não foi possível identificar a conta atual.'}
                        </p>
                        <button
                            type="button"
                            onClick={reload}
                            className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
                        >
                            Tentar novamente
                        </button>
                    </CardContent>
                </Card>
            </PageShell>
        );
    }

    if (profile.role !== 'admin') {
        return (
            <PageShell>
                <PageHeader
                    title="Acesso restrito"
                    description="As configurações do sistema estão disponíveis somente para administradores."
                />
                <Card className="border border-border/70">
                    <CardContent className="py-6">
                        <Link
                            to="/perfil"
                            className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
                        >
                            Voltar ao perfil
                        </Link>
                    </CardContent>
                </Card>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <PageHeader
                title="Configuração do projeto"
                description="Gerencie coleta, estimativas ambientais e acesso ao GreenER."
                actions={
                    <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 text-xs font-medium text-primary">
                        <Settings aria-hidden="true" className="size-3.5" />
                        Admin
                    </span>
                }
            />

            <nav
                aria-label="Seções de configuração"
                className="flex flex-wrap gap-2 border-b border-border/70 pb-4"
            >
                {[
                    { id: 'coleta', label: 'Coleta' },
                    { id: 'estimativas', label: 'Estimativas' },
                    { id: 'usuarios', label: 'Usuários' },
                ].map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="inline-flex min-h-10 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {item.label}
                    </a>
                ))}
            </nav>

            <AdminSection
                id="coleta"
                icon={Gauge}
                title="Coleta de métricas"
                description="Configure o intervalo entre as rodadas automáticas de coleta."
            >
                <div className="grid gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs text-muted-foreground">Intervalo em uso</p>
                        <p className="mt-1 font-semibold tabular-nums">
                            {monitoringStatus?.collectionIntervalSeconds != null
                                ? `${monitoringStatus.collectionIntervalSeconds} s`
                                : collectionSettings
                                  ? `${collectionSettings.effectiveIntervalSeconds} s`
                                  : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Última rodada concluída</p>
                        <p className="mt-1 font-medium">
                            {formatDate(
                                monitoringStatus?.lastRoundFinishedAt ??
                                    collectionSettings?.lastRoundAt,
                            )}
                        </p>
                    </div>
                </div>
                <FeedbackMessage feedback={collectionFeedback} />
                {monitoringError && (
                    <p role="alert" className="text-sm text-destructive">
                        Falha ao atualizar o monitoramento: {monitoringError}
                    </p>
                )}
                <form onSubmit={handleSaveInterval} className="flex flex-col items-start gap-4">
                    <label className="flex w-full max-w-sm flex-col gap-2 text-sm font-medium">
                        <span>Intervalo entre rodadas (s)</span>
                        <input
                            type="number"
                            min={10}
                            max={3600}
                            step={1}
                            required
                            value={collectionInterval}
                            disabled={isLoadingCollection || isSavingCollection}
                            onChange={(event) => setCollectionInterval(event.target.value)}
                            className="min-h-11 w-full rounded-lg border border-input bg-background/70 px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={isLoadingCollection || isSavingCollection}
                        className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isSavingCollection ? 'Salvando...' : 'Salvar intervalo'}
                    </button>
                </form>
            </AdminSection>

            <AdminSection
                id="estimativas"
                icon={Calculator}
                title="Parâmetros de estimativa"
                description="Defina os coeficientes usados no cálculo do impacto ambiental."
                action={
                    activeCoefficients && (
                        <span className="inline-flex min-h-8 w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-3 text-xs font-medium text-primary">
                            Conjunto #{activeCoefficients.id} ativo
                        </span>
                    )
                }
            >
                <FeedbackMessage feedback={estimateFeedback} />
                <form onSubmit={handlePreview} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <SettingField
                            label="Potência máxima da CPU (W)"
                            value={estimateValues.cpuMaxWatts}
                            min={0}
                            max={999999.9999}
                            step={0.0001}
                            disabled={isLoadingCoefficients || isPreviewing || isActivating}
                            onChange={(value) => {
                                setEstimateValues((current) => ({
                                    ...current,
                                    cpuMaxWatts: value,
                                }));
                                setEstimatePreview(null);
                                setEstimateFeedback(null);
                            }}
                        />
                        <SettingField
                            label="Potência da RAM por GB (W/GB)"
                            value={estimateValues.ramWattsPerGb}
                            min={0}
                            max={999999.9999}
                            step={0.0001}
                            disabled={isLoadingCoefficients || isPreviewing || isActivating}
                            onChange={(value) => {
                                setEstimateValues((current) => ({
                                    ...current,
                                    ramWattsPerGb: value,
                                }));
                                setEstimatePreview(null);
                                setEstimateFeedback(null);
                            }}
                        />
                        <SettingField
                            label="Potência do disco por GB (W/GB)"
                            value={estimateValues.diskWattsPerGb}
                            min={0}
                            max={999999.9999}
                            step={0.0001}
                            disabled={isLoadingCoefficients || isPreviewing || isActivating}
                            onChange={(value) => {
                                setEstimateValues((current) => ({
                                    ...current,
                                    diskWattsPerGb: value,
                                }));
                                setEstimatePreview(null);
                                setEstimateFeedback(null);
                            }}
                        />
                        <SettingField
                            label="Potência da rede por GB (W/GB)"
                            value={estimateValues.networkWattsPerGb}
                            min={0}
                            max={999999.9999}
                            step={0.0001}
                            disabled={isLoadingCoefficients || isPreviewing || isActivating}
                            onChange={(value) => {
                                setEstimateValues((current) => ({
                                    ...current,
                                    networkWattsPerGb: value,
                                }));
                                setEstimatePreview(null);
                                setEstimateFeedback(null);
                            }}
                        />
                    </div>
                    {estimatePreview && (
                        <div className="grid gap-4 rounded-xl border border-primary/20 bg-primary/[0.05] p-4 sm:grid-cols-2">
                            <div>
                                <h3 className="mb-2 font-medium">Parâmetros ativos</h3>
                                {estimatePreview.current ? (
                                    <dl className="space-y-1 text-sm text-muted-foreground">
                                        <div>
                                            Potência: {formatNumber(estimatePreview.current.powerW)}{' '}
                                            W
                                        </div>
                                        <div>
                                            Energia (1 h):{' '}
                                            {formatNumber(estimatePreview.current.energyKwh)} kWh
                                        </div>
                                        <div>
                                            Emissões: {formatNumber(estimatePreview.current.co2eG)}{' '}
                                            gCO₂e
                                        </div>
                                    </dl>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Não há parâmetros ativos.
                                    </p>
                                )}
                            </div>
                            <div>
                                <h3 className="mb-2 font-medium">Novos parâmetros</h3>
                                <dl className="space-y-1 text-sm text-muted-foreground">
                                    <div>
                                        Potência: {formatNumber(estimatePreview.proposed.powerW)} W
                                    </div>
                                    <div>
                                        Energia (1 h):{' '}
                                        {formatNumber(estimatePreview.proposed.energyKwh)} kWh
                                    </div>
                                    <div>
                                        Emissões: {formatNumber(estimatePreview.proposed.co2eG)}{' '}
                                        gCO₂e
                                    </div>
                                </dl>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoadingCoefficients || isPreviewing || isActivating}
                        className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isPreviewing ? 'Simulando...' : 'Simular cálculo'}
                    </button>
                </form>
                <button
                    type="button"
                    disabled={!estimatePreview || isActivating || isPreviewing}
                    onClick={() => void handleActivateEstimate()}
                    className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium transition enabled:hover:border-primary/40 enabled:hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isActivating ? 'Ativando...' : 'Ativar novos valores'}
                </button>
            </AdminSection>

            <AdminSection
                id="usuarios"
                icon={Users}
                title="Acesso de usuários"
                description="Pesquise usuários, altere papéis e gerencie o acesso às contas."
                action={
                    <span className="inline-flex min-h-8 w-fit items-center rounded-full border border-border px-3 text-xs text-muted-foreground">
                        {users.length} usuário(s)
                    </span>
                }
            >
                <FeedbackMessage feedback={membersFeedback} />
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (submittedSearch !== search) setIsLoadingMembers(true);
                        setSubmittedSearch(search);
                        setMembersFeedback(null);
                    }}
                    className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
                >
                    <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm font-medium">
                        <span>Buscar usuário</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Nome ou e-mail"
                            className="min-h-11 w-full rounded-lg border border-input bg-background/70 px-3 text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </label>
                    <button
                        type="submit"
                        className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted"
                    >
                        Buscar
                    </button>
                </form>
                <div className="divide-y divide-border/70">
                    {isLoadingMembers && (
                        <p className="py-5 text-sm text-muted-foreground">Carregando usuários...</p>
                    )}
                    {!isLoadingMembers &&
                        users.map((member) => {
                            const role = roleDrafts[member.id] ?? member.role;
                            const roleChanged = role !== member.role;
                            const isSaving = savingMemberId === member.id;
                            return (
                                <article
                                    key={member.id}
                                    className="grid gap-x-8 gap-y-4 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                                >
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">{member.name}</h3>
                                            <span
                                                className={`inline-flex min-h-6 items-center rounded-full border px-2 text-xs ${member.active ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                                            >
                                                {member.active ? 'Vinculado' : 'Desvinculado'}
                                            </span>
                                        </div>
                                        <p className="break-all text-sm text-muted-foreground">
                                            {member.email}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start gap-2 sm:col-start-1 sm:row-start-2 sm:flex-row sm:items-end">
                                        <label className="flex w-full min-w-0 flex-col gap-2 text-sm font-medium sm:w-52">
                                            <span>Papel</span>
                                            <select
                                                value={role}
                                                disabled={isSaving}
                                                onChange={(event) =>
                                                    setRoleDrafts((current) => ({
                                                        ...current,
                                                        [member.id]: event.target
                                                            .value as ProfileRole,
                                                    }))
                                                }
                                                className="min-h-11 w-full rounded-lg border border-input bg-background/70 px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="visualizador">Visualizador</option>
                                            </select>
                                        </label>
                                        <button
                                            type="button"
                                            disabled={!roleChanged || isSaving}
                                            onClick={() =>
                                                void saveMember(member, role, member.active)
                                            }
                                            className="min-h-11 rounded-lg border border-border px-3 text-sm font-medium transition enabled:hover:border-primary/40 enabled:hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {isSaving && roleChanged
                                                ? 'Salvando...'
                                                : 'Salvar papel'}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 sm:col-start-2 sm:row-start-1 sm:justify-end">
                                        <button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={() =>
                                                void saveMember(member, member.role, !member.active)
                                            }
                                            className={`min-h-10 rounded-lg border px-3 text-sm font-medium transition disabled:cursor-wait disabled:opacity-60 ${member.active ? 'border-destructive/30 text-destructive hover:bg-destructive/10' : 'border-primary/30 text-primary hover:bg-primary/10'}`}
                                        >
                                            {isSaving && !roleChanged
                                                ? 'Salvando...'
                                                : member.active
                                                  ? 'Desvincular'
                                                  : 'Vincular'}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    {!isLoadingMembers && users.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Nenhum usuário encontrado.
                        </p>
                    )}
                </div>
            </AdminSection>
        </PageShell>
    );
}
