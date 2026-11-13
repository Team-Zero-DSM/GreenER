import { useState, type FormEvent } from 'react';

import type {
    UserProfile,
    UpdateProfileRequest,
} from '@/types/profile';

interface ProfileInformationFormProps {
    profile: UserProfile;
    onSave: (data: UpdateProfileRequest) => Promise<void>;
    onBack: () => void;
    isSaving: boolean;
}

const inputClassName =
    'h-11 w-full rounded-lg border border-input bg-background/60 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400/15';

export function ProfileInformationForm({
    profile,
    onSave,
    onBack,
    isSaving,
}: ProfileInformationFormProps) {
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        try {
            await onSave({
                name: name.trim(),
                email: email.trim(),
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível atualizar o perfil.',
            );
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
                <h3 className="text-base font-semibold">
                    Informações pessoais
                </h3>

                <p className="text-sm text-muted-foreground">
                    Atualize seu nome e endereço de e-mail.
                </p>
            </div>

            <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-medium">
                    Nome
                </label>

                <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Digite seu nome"
                    autoComplete="name"
                    className={inputClassName}
                    disabled={isSaving}
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="profile-email" className="text-sm font-medium">
                    E-mail
                </label>

                <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Digite seu e-mail"
                    autoComplete="email"
                    className={inputClassName}
                    disabled={isSaving}
                    required
                />
            </div>

            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="flex flex-wrap justify-end gap-2 border-t border-border/70 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isSaving}
                    className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-50"
                >
                    Voltar
                </button>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="min-h-11 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving ? 'Salvando...' : 'Salvar alterações'}
                </button>
            </div>
        </form>
    );
}   