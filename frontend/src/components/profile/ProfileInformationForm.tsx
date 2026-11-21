
import { useState, type FormEvent } from 'react';

import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';
import { InfoTooltip } from '@/components/shared/InfoTooltip';

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

export function ProfileInformationForm({
    profile,
    onSave,
    onBack,
    isSaving,
}: ProfileInformationFormProps) {
    // Os valores atuais aparecem como placeholders.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        try {
            await onSave({
                // Preserva os valores atuais caso não sejam alterados.
                name: name.trim() || profile.name,
                email: email.trim() || profile.email,
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-base font-semibold">
                    Informações pessoais
                </h3>

                <p className="text-sm text-muted-foreground">
                    Atualize seu nome e endereço de e-mail.
                </p>
            </div>

            {/* Nome atual como placeholder. */}
            <FloatingLabelInput
                id="profile-name"
                label="Nome"
                type="text"
                value={name}
                onChange={setName}
                placeholder={profile.name}
                autoComplete="name"
                disabled={isSaving}
            />

            {/* E-mail atual como placeholder. */}
            <FloatingLabelInput
                id="profile-email"
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder={profile.email}
                autoComplete="email"
                disabled={isSaving}
                labelAdornment={
                    <InfoTooltip
                        content="Use um e-mail atualizado. Ele será utilizado para recuperar o acesso à sua conta."
                        ariaLabel="Informações sobre o uso do e-mail"
                    />
                }
            />

            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}

            {/* Ações do formulário. */}
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
