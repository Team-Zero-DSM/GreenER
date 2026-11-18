
import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import type {
    ChangePasswordRequest,
} from '@/types/profile';

interface ProfilePasswordFormProps {
    onBack: () => void;
    onSubmit: (data: ChangePasswordRequest) => Promise<void>;
    isSubmitting: boolean;
}

const inputClassName =
    'h-11 w-full rounded-lg border border-input bg-background/60 px-4 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400/15';

export function ProfilePasswordForm({
    onBack,
    onSubmit,
    isSubmitting,
}: ProfilePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPasswords, setShowPasswords] = useState([
        false,
        false,
        false,
    ]);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    function toggleVisibility(index: number) {
        setShowPasswords((previous) =>
            previous.map((value, i) =>
                i === index ? !value : value,
            ),
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);
        setSuccess(null);

        // Valida o tamanho mínimo da nova senha.
        if (newPassword.length < 8) {
            setError('A nova senha deve possuir pelo menos 8 caracteres.');
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

    const fields = [
        {
            id: 'current-password',
            label: 'Senha atual',
            placeholder: 'Digite sua senha atual',
            value: currentPassword,
            onChange: setCurrentPassword,
            autoComplete: 'current-password',
        },
        {
            id: 'new-password',
            label: 'Nova senha',
            placeholder: 'Digite sua nova senha',
            value: newPassword,
            onChange: setNewPassword,
            autoComplete: 'new-password',
        },
        {
            id: 'confirm-password',
            label: 'Confirmar nova senha',
            placeholder: 'Confirme sua nova senha',
            value: confirmPassword,
            onChange: setConfirmPassword,
            autoComplete: 'new-password',
        },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
                <h3 className="text-base font-semibold">
                    Segurança da conta
                </h3>

                <p className="text-sm text-muted-foreground">
                    Preencha os campos abaixo para alterar sua senha.
                </p>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                    <div className="flex items-center gap-1.5">
    <label
        htmlFor={field.id}
        className="text-sm font-medium"
    >
        {field.label}
    </label>

    {field.id === 'new-password' && (
        <InfoTooltip
            content="Utilize pelo menos 8 caracteres e evite senhas comuns."
            ariaLabel="Dicas para criar uma senha segura"
        />
    )}
</div>

                    <div className="relative">
                        <input
                            id={field.id}
                            type={showPasswords[index] ? 'text' : 'password'}
                            value={field.value}
                            onChange={(event) =>
                                field.onChange(event.target.value)
                            }
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete}
                            className={inputClassName}
                            disabled={isSubmitting}
                            required
                        />

                        <button
                            type="button"
                            onClick={() => toggleVisibility(index)}
                            disabled={isSubmitting}
                            aria-label={
                                showPasswords[index]
                                    ? 'Ocultar senha'
                                    : 'Mostrar senha'
                            }
                            aria-pressed={showPasswords[index]}
                            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {showPasswords[index] ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
                </div>
            ))}

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
                        className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground disabled:opacity-50"
                    >
                        Voltar
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-h-11 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? 'Enviando...' : 'Atualizar senha'}
                    </button>
                </div>
            </div>
        </form>
    );
}
