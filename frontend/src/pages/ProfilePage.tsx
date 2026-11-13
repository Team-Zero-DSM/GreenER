
import { useState, type FormEvent } from 'react';
import {
    UserRound,
    Mail,
    Pencil,
    ChevronRight,
    LockKeyhole,
    Eye,
    EyeOff,
    ShieldCheck,
    LogOut,
    X,
    Check,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const inputClassName =
    'h-11 w-full rounded-lg border border-input bg-background/60 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400/15';

const labelClassName = 'text-sm font-medium text-foreground';

export function ProfilePage() {
    // Dados fictícios para a estrutura inicial.
    const [name, setName] = useState('Nome do usuário');
    const [email, setEmail] = useState('usuario@exemplo.com');

    // Controla a edição das informações pessoais.
    const [editingProfile, setEditingProfile] = useState(false);
    const [draftName, setDraftName] = useState(name);
    const [draftEmail, setDraftEmail] = useState(email);

    // Controla a visualização dos campos de senha.
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function handleEditProfile() {
        setDraftName(name);
        setDraftEmail(email);
        setEditingProfile(true);
    }

    function handleCancelEdit() {
        setDraftName(name);
        setDraftEmail(email);
        setEditingProfile(false);
    }

    function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Atualização apenas local, sem persistência no backend.
        setName(draftName.trim());
        setEmail(draftEmail.trim());
        setEditingProfile(false);
    }

    return (
        <PageShell>
            <PageHeader
                title="Meu perfil"
                description="Gerencie suas informações pessoais e a segurança da sua conta."
            />

            <section
                aria-label="Configurações da conta"
                className="space-y-5"
            >
                {/* Cards principais */}
                <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">

                    {/* Informações pessoais */}
                    <Card className="h-full min-w-0 border border-border/70 bg-linear-to-br from-card via-card to-emerald-950/10">
                        <CardHeader>
                            <CardTitle>Informações pessoais</CardTitle>
                            <CardDescription>
                                Seus dados de identificação na plataforma.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-1 flex-col gap-5">

                            {/* Identificação */}
                            <div className="flex items-center gap-3">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.08)]">
                                    <UserRound className="size-6" aria-hidden="true" />
                                </div>

                                <div className="min-w-0 flex-1 space-y-1">
                                    <h2 className="break-words text-base font-semibold text-foreground">
                                        {name}
                                    </h2>

                                    <Badge
                                        variant="outline"
                                        className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                    >
                                        Visualizador
                                    </Badge>
                                </div>
                            </div>

                            {/* E-mail */}
                            <div className="flex min-w-0 items-start gap-2 text-muted-foreground">
                                <Mail
                                    className="mt-0.5 size-4 shrink-0"
                                    aria-hidden="true"
                                />

                                <span className="break-all text-sm">
                                    {email}
                                </span>
                            </div>

                            <div className="mt-auto border-t border-border/70 pt-4">

                                {editingProfile ? (
                                    <form
                                        onSubmit={handleSaveProfile}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="profile-name"
                                                className={labelClassName}
                                            >
                                                Nome
                                            </label>

                                            <input
                                                id="profile-name"
                                                type="text"
                                                value={draftName}
                                                onChange={(event) =>
                                                    setDraftName(event.target.value)
                                                }
                                                placeholder="Digite seu nome"
                                                className={inputClassName}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="profile-email"
                                                className={labelClassName}
                                            >
                                                E-mail
                                            </label>

                                            <input
                                                id="profile-email"
                                                type="email"
                                                value={draftEmail}
                                                onChange={(event) =>
                                                    setDraftEmail(event.target.value)
                                                }
                                                placeholder="Digite seu e-mail"
                                                className={inputClassName}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-wrap justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                                            >
                                                <X className="size-4" />
                                                Cancelar
                                            </button>

                                            <button
                                                type="submit"
                                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
                                            >
                                                <Check className="size-4" />
                                                Salvar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleEditProfile}
                                        className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <Pencil className="size-4 shrink-0 text-emerald-400" />

                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground">
                                                    Editar informações pessoais
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    Alterar nome e e-mail
                                                </p>
                                            </div>
                                        </div>

                                        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Segurança da conta */}
                    <Card className="h-full min-w-0 border border-border/70 bg-linear-to-br from-card via-card to-cyan-950/10">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <LockKeyhole
                                    className="size-5 text-emerald-400"
                                    aria-hidden="true"
                                />

                                <CardTitle>Segurança da conta</CardTitle>
                            </div>

                            <CardDescription>
                                Gerencie sua senha de acesso à plataforma.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-1 flex-col gap-4">
                            <form
                                onSubmit={(event) => event.preventDefault()}
                                className="flex flex-1 flex-col gap-4"
                            >
                                {/* Senha atual */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="current-password"
                                        className={labelClassName}
                                    >
                                        Senha atual
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="current-password"
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            placeholder="Digite sua senha atual"
                                            className={`${inputClassName} pr-11`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword((value) => !value)
                                            }
                                            aria-label={
                                                showCurrentPassword
                                                    ? 'Ocultar senha atual'
                                                    : 'Mostrar senha atual'
                                            }
                                            aria-pressed={showCurrentPassword}
                                            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Nova senha */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="new-password"
                                        className={labelClassName}
                                    >
                                        Nova senha
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="new-password"
                                            type={showNewPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            placeholder="Digite sua nova senha"
                                            className={`${inputClassName} pr-11`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword((value) => !value)
                                            }
                                            aria-label={
                                                showNewPassword
                                                    ? 'Ocultar nova senha'
                                                    : 'Mostrar nova senha'
                                            }
                                            aria-pressed={showNewPassword}
                                            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmação */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirm-password"
                                        className={labelClassName}
                                    >
                                        Confirmar nova senha
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="confirm-password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            placeholder="Confirme sua nova senha"
                                            className={`${inputClassName} pr-11`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword((value) => !value)
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? 'Ocultar confirmação da senha'
                                                    : 'Mostrar confirmação da senha'
                                            }
                                            aria-pressed={showConfirmPassword}
                                            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
                                        Proteção da conta
                                    </div>

                                    <button
                                        type="submit"
                                        disabled
                                        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Atualizar senha
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Encerrar sessão */}
                <button
                    type="button"
                    disabled
                    className="group flex w-full items-center justify-between gap-4 rounded-xl border border-red-400/15 bg-red-400/[0.03] p-4 text-left transition-colors disabled:cursor-not-allowed"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-400">
                            <LogOut className="size-5" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                            <p className="text-sm font-medium text-red-400">
                                Sair da conta
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Encerrar sua sessão na plataforma.
                            </p>
                        </div>
                    </div>

                    <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </button>
            </section>
        </PageShell>
    );
}
