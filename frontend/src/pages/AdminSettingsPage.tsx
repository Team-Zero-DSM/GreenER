import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Calculator, Check, Gauge, Settings, Users } from 'lucide-react';
import { Link } from 'react-router';

import { useProfile } from '@/hooks/useProfile';
import type { ProfileRole } from '@/types/profile';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: ProfileRole;
    linked: boolean;
}

const initialUsers: AdminUser[] = [
    { id: 1, name: 'Pedro', email: 'pedro@exemplo.com', role: 'admin', linked: true },
    { id: 2, name: 'Vitor', email: 'vitor@exemplo.com', role: 'visualizador', linked: true },
];

const initialEstimates = {
    cpuMaxWatts: '100',
    memoryWattsPerGb: '0.375',
    diskWattsPerGb: '0.01',
    networkWattsPerGb: '0.02',
};

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

function SettingField({
    label,
    value,
    onChange,
    min = 0,
    step = 'any',
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    min?: number;
    step?: number | 'any';
}) {
    return (
        <label className="flex min-w-0 flex-col gap-2 text-sm font-medium">
            <span>{label}</span>
            <input
                type="number"
                min={min}
                step={step}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-input bg-background/70 px-3 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            />
        </label>
    );
}

function DemoFeedback({ children }: { children: ReactNode }) {
    return (
        <p role="status" className="flex items-start gap-2 text-sm text-primary">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{children}</span>
        </p>
    );
}

export function AdminSettingsPage() {
    const { profile, isLoading, error, reload } = useProfile();
    const [collectionInterval, setCollectionInterval] = useState('300');
    const [estimateValues, setEstimateValues] = useState(initialEstimates);
    const [previewReady, setPreviewReady] = useState(false);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState(initialUsers);
    const [feedback, setFeedback] = useState<string | null>(null);

    const visibleUsers = useMemo(() => {
        const query = search.trim().toLocaleLowerCase('pt-BR');
        if (!query) return users;
        return users.filter(
            (user) =>
                user.name.toLocaleLowerCase('pt-BR').includes(query) ||
                user.email.toLocaleLowerCase('pt-BR').includes(query),
        );
    }, [search, users]);

    function showDemoFeedback(message: string) {
        setFeedback(message);
    }

    function handleSaveInterval(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        showDemoFeedback('Intervalo atualizado apenas nesta demonstração; nada foi salvo no servidor.');
    }

    function handleSimulateEstimates(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPreviewReady(true);
        showDemoFeedback('Prévia demonstrativa atualizada com os parâmetros informados.');
    }

    function handleActivateEstimates() {
        showDemoFeedback('Ativação demonstrativa: os parâmetros ainda não foram enviados ao servidor.');
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
                            className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85"
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
                            className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

            {feedback && (
                <Card className="border border-primary/25 bg-primary/[0.06]">
                    <CardContent className="py-3">
                        <DemoFeedback>{feedback}</DemoFeedback>
                    </CardContent>
                </Card>
            )}

            <AdminSection
                id="coleta"
                icon={Gauge}
                title="Coleta de métricas"
                description="Configure o intervalo entre as rodadas automáticas de coleta."
            >
                <div className="grid gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs text-muted-foreground">Intervalo em uso</p>
                        <p className="mt-1 font-semibold tabular-nums">300 s</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Última atualização</p>
                        <p className="mt-1 font-medium">
                            {new Intl.DateTimeFormat('pt-BR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                            }).format(new Date())}
                        </p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Defina a pausa entre as rodadas, de 10 a 3.600 segundos.
                </p>
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
                            onChange={(event) => setCollectionInterval(event.target.value)}
                            className="min-h-11 w-full rounded-lg border border-input bg-background/70 px-3 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </label>
                    <button
                        type="submit"
                        className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Salvar intervalo
                    </button>
                </form>
            </AdminSection>

            <AdminSection
                id="estimativas"
                icon={Calculator}
                title="Parâmetros de estimativa"
                description="Defina os coeficientes usados no cálculo do impacto ambiental."
                action={
                    <span className="inline-flex min-h-8 w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-3 text-xs font-medium text-primary">
                        Conjunto #1 ativo
                    </span>
                }
            >
                <p className="text-sm text-muted-foreground">
                    O novo conjunto vale para as próximas coletas. O histórico conserva os
                    coeficientes já usados.
                </p>
                <form onSubmit={handleSimulateEstimates} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <SettingField
                            label="Potência máxima da CPU (W)"
                            value={estimateValues.cpuMaxWatts}
                            onChange={(value) => {
                                setEstimateValues((current) => ({ ...current, cpuMaxWatts: value }));
                                setPreviewReady(false);
                            }}
                        />
                        <SettingField
                            label="Potência da RAM por GB (W/GB)"
                            value={estimateValues.memoryWattsPerGb}
                            onChange={(value) => {
                                setEstimateValues((current) => ({
                                    ...current,
                                    memoryWattsPerGb: value,
                                }));
                                setPreviewReady(false);
                            }}
                        />
                        <SettingField
                            label="Potência do disco por GB (W/GB)"
                            value={estimateValues.diskWattsPerGb}
                            onChange={(value) => {
                                setEstimateValues((current) => ({ ...current, diskWattsPerGb: value }));
                                setPreviewReady(false);
                            }}
                        />
                        <SettingField
                            label="Potência da rede por GB (W/GB)"
                            value={estimateValues.networkWattsPerGb}
                            onChange={(value) => {
                                setEstimateValues((current) => ({
                                    ...current,
                                    networkWattsPerGb: value,
                                }));
                                setPreviewReady(false);
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h3 className="font-medium">Prévia da estimativa</h3>
                            <p className="text-sm text-muted-foreground">
                                Compare os valores ativos e os preenchidos usando a mesma amostra de
                                1 hora.
                            </p>
                            {previewReady && (
                                <p className="pt-1 text-sm text-primary">
                                    Parâmetros prontos para uma prévia demonstrativa.
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="min-h-11 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Simular cálculo
                        </button>
                    </div>
                </form>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Simule os parâmetros preenchidos para liberar a ativação.
                    </p>
                    <button
                        type="button"
                        disabled={!previewReady}
                        onClick={handleActivateEstimates}
                        className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium transition enabled:hover:border-primary/40 enabled:hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Ativar novos valores
                    </button>
                </div>
            </AdminSection>

            <AdminSection
                id="usuarios"
                icon={Users}
                title="Acesso de usuários"
                description="Pesquise usuários, altere papéis e gerencie vínculos de conta."
                action={
                    <span className="inline-flex min-h-8 w-fit items-center rounded-full border border-border px-3 text-xs text-muted-foreground">
                        {users.length} contas de demonstração
                    </span>
                }
            >
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        showDemoFeedback('Busca executada nos usuários de demonstração.');
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
                            className="min-h-11 w-full rounded-lg border border-input bg-background/70 px-3 text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </label>
                    <button
                        type="submit"
                        className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Buscar
                    </button>
                </form>

                <div className="divide-y divide-border/70">
                    {visibleUsers.map((user) => (
                        <article
                            key={user.id}
                            className="grid gap-x-8 gap-y-4 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                        >
                            <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-semibold">{user.name}</h3>
                                    <span
                                        className={`inline-flex min-h-6 items-center rounded-full border px-2 text-xs ${
                                            user.linked
                                                ? 'border-primary/30 bg-primary/10 text-primary'
                                                : 'border-border text-muted-foreground'
                                        }`}
                                    >
                                        {user.linked ? 'Vinculado' : 'Desvinculado'}
                                    </span>
                                </div>
                                <p className="break-all text-sm text-muted-foreground">{user.email}</p>
                            </div>

                            <div className="flex flex-wrap items-end gap-2 sm:col-start-1 sm:row-start-2">
                                <label className="flex min-w-0 flex-col gap-2 text-sm font-medium sm:w-52">
                                    <span>Papel</span>
                                    <select
                                        value={user.role}
                                        onChange={(event) => {
                                            const role = event.target.value as ProfileRole;
                                            setUsers((current) =>
                                                current.map((item) =>
                                                    item.id === user.id ? { ...item, role } : item,
                                                ),
                                            );
                                        }}
                                        className="min-h-11 w-full rounded-lg border border-input bg-background/70 px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="visualizador">Visualizador</option>
                                    </select>
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        showDemoFeedback(
                                            `Papel de ${user.name} atualizado apenas nesta demonstração.`,
                                        )
                                    }
                                    className="min-h-11 rounded-lg border border-border px-3 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    Salvar papel
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:col-start-2 sm:row-start-1 sm:justify-end">
                                <button
                                    type="button"
                                    disabled={!user.linked}
                                    onClick={() =>
                                        showDemoFeedback(
                                            `Desvinculação de ${user.name} está apenas representada nesta tela.`,
                                        )
                                    }
                                    className="min-h-10 rounded-lg border border-destructive/30 px-3 text-sm font-medium text-destructive transition hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Desvincular
                                </button>
                            </div>
                        </article>
                    ))}

                    {visibleUsers.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Nenhum usuário encontrado.
                        </p>
                    )}
                </div>
            </AdminSection>
        </PageShell>
    );
}
