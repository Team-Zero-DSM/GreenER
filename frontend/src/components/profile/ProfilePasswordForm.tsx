
import { useState, type FormEvent } from 'react';
import { ShieldCheck } from 'lucide-react';

import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';
import { InfoTooltip } from '@/components/shared/InfoTooltip';

import type { ChangePasswordRequest } from '@/types/profile';
import { isCommonPassword } from '@/lib/commonPasswords';

interface ProfilePasswordFormProps {
    onBack: () => void;
    onSubmit: (data: ChangePasswordRequest) => Promise<void>;
    isSubmitting: boolean;
}

export function ProfilePasswordForm({
    onBack,
    onSubmit,
    isSubmitting,
}: ProfilePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);
        setSuccess(null);

        // Verifica o tamanho mínimo da nova senha.
        if (newPassword.length < 8) {
            setError('A nova senha deve possuir pelo menos 8 caracteres.');
            return;
        }

        // Recusa senhas comuns, como o backend.
        if (isCommonPassword(newPassword)) {
            setError('Essa senha é muito comum. Escolha uma senha mais difícil de adivinhar.');
            return;
        }

        // O bcrypt aceita no máximo 72 bytes.
        const passwordBytes = new TextEncoder().encode(newPassword).length;

        if (passwordBytes > 72) {
            setError('A nova senha não pode ultrapassar 72 bytes.');
            return;
        }

        // Confirma se as senhas são iguais.
        if (newPassword !== confirmPassword) {
            setError('A confirmação da nova senha não corresponde.');
            return;
        }

        try {
            await onSubmit({
                currentPassword,
                newPassword,
            });

            setSuccess(
                'Senha alterada com sucesso. Sua sessão continua ativa.',
            );

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível alterar a senha.',
            );
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-base font-semibold">
                    Segurança da conta
                </h3>

                <p className="text-sm text-muted-foreground">
                    Preencha os campos abaixo para alterar sua senha.
                </p>
            </div>

            {/* Senha atual. */}
            <FloatingLabelInput
                id="current-password"
                label="Senha atual"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Digite sua senha atual"
                autoComplete="current-password"
                disabled={isSubmitting}
                required
            />

            {/* Nova senha. */}
            <FloatingLabelInput
                id="new-password"
                label="Nova senha"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Digite sua nova senha"
                autoComplete="new-password"
                disabled={isSubmitting}
                required
                labelAdornment={
                    <InfoTooltip
                        content="Utilize pelo menos 8 caracteres e evite senhas comuns."
                        ariaLabel="Dicas para criar uma senha segura"
                    />
                }
            />

            {/* Confirmação da nova senha. */}
            <FloatingLabelInput
                id="confirm-password"
                label="Confirmar nova senha"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirme sua nova senha"
                autoComplete="new-password"
                disabled={isSubmitting}
                required
            />

            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}

            {success && (
                <p role="status" className="text-sm text-emerald-400">
                    {success}
                </p>
            )}

            {/* Ações do formulário. */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    Proteção da conta
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-50"
                    >
                        Voltar
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-h-11 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? 'Enviando...' : 'Atualizar senha'}
                    </button>
                </div>
            </div>
        </form>
    );
}
