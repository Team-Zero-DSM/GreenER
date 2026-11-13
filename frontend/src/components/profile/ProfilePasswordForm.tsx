
import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface ProfilePasswordFormProps {
    onBack: () => void;
}

const fields = [
    {
        id: 'current-password',
        label: 'Senha atual',
        placeholder: 'Digite sua senha atual',
    },
    {
        id: 'new-password',
        label: 'Nova senha',
        placeholder: 'Digite sua nova senha',
    },
    {
        id: 'confirm-password',
        label: 'Confirmar nova senha',
        placeholder: 'Confirme sua nova senha',
    },
];

export function ProfilePasswordForm({
    onBack,
}: ProfilePasswordFormProps) {
    const [showPasswords, setShowPasswords] = useState<boolean[]>([
        false,
        false,
        false,
    ]);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [feedback, setFeedback] = useState('');

    function toggleVisibility(index: number) {
        setShowPasswords((current) =>
            current.map((value, i) =>
                i === index ? !value : value
            )
        );
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setFeedback('A confirmação da senha não corresponde.');
            return;
        }

        setFeedback(
            'Validação local concluída. A atualização real será integrada ao backend.'
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                    <label
                        htmlFor={field.id}
                        className="text-sm font-medium"
                    >
                        {field.label}
                    </label>

                    <div className="relative">
                        <input
                            id={field.id}
                            type={showPasswords[index] ? 'text' : 'password'}
                            placeholder={field.placeholder}
                            autoComplete={
                                index === 0
                                    ? 'current-password'
                                    : 'new-password'
                            }
                            required
                            value={
                                index === 1
                                    ? newPassword
                                    : index === 2
                                      ? confirmPassword
                                      : undefined
                            }
                            onChange={
                                index === 1
                                    ? (event) => setNewPassword(event.target.value)
                                    : index === 2
                                      ? (event) => setConfirmPassword(event.target.value)
                                      : undefined
                            }
                            className="h-11 w-full rounded-lg border border-input bg-background/60 px-4 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400/15"
                        />

                        <button
                            type="button"
                            onClick={() => toggleVisibility(index)}
                            aria-label={
                                showPasswords[index]
                                    ? 'Ocultar senha'
                                    : 'Mostrar senha'
                            }
                            aria-pressed={showPasswords[index]}
                            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
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

            {feedback && (
                <p role="status" className="text-sm text-muted-foreground">
                    {feedback}
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
                        className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    >
                        Voltar
                    </button>

                    <button
                        type="submit"
                        className="min-h-11 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                    >
                        Atualizar senha
                    </button>
                </div>
            </div>
        </form>
    );
}
