import { useEffect, useRef, useState, type FormEvent } from 'react';

import { AuthInput } from '@/components/auth/AuthInput';

import { resetPassword } from '@/api/auth';

import { isCommonPassword } from '@/lib/commonPasswords';

interface ResetPasswordDialogProps {
    token: string | null;
    onOpenChange: (open: boolean) => void;
    onRequestNewLink: () => void;
}

export function ResetPasswordDialog({
    token,
    onOpenChange,
    onRequestNewLink,
}: ResetPasswordDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const isTokenValid = Boolean(token && /^[a-f0-9]{64}$/.test(token));

    // Abre o Dialog quando o componente é montado.
    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        dialog.showModal();

        return () => {
            if (dialog.open) {
                dialog.close();
            }
        };
    }, []);

    function handleClose() {
        if (isSubmitting) return;

        onOpenChange(false);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting) return;

        setError(null);

        if (!token || !isTokenValid) {
            setError('O link de recuperação é inválido. Solicite um novo link.');
            return;
        }

        if (password.length < 8) {
            setError('A senha deve possuir pelo menos 8 caracteres.');
            return;
        }

        // Recusa senhas comuns, como o backend.
        if (isCommonPassword(password)) {
            setError('Essa senha é muito comum. Escolha uma senha mais difícil de adivinhar.');
            return;
        }

        const passwordBytes = new TextEncoder().encode(password).length;

        if (passwordBytes > 72) {
            setError('A senha não pode ultrapassar 72 bytes.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não correspondem.');
            return;
        }

        try {
            setIsSubmitting(true);

            await resetPassword(token, password);

            setIsSuccess(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível redefinir sua senha. Tente novamente.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="reset-password-title"
            aria-describedby="reset-password-description"
            onCancel={(event) => {
                event.preventDefault();
                handleClose();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
            className="fixed left-1/2 top-1/2 m-0 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border/70 bg-card/80 p-0 text-card-foreground shadow-2xl backdrop-blur-xl backdrop:bg-background/75"
        >
            <div className="flex flex-col gap-6 p-6 sm:p-8">
                {!isTokenValid ? (
                    <>
                        <div className="flex flex-col gap-2">
                            <h2
                                id="reset-password-title"
                                className="text-xl font-semibold text-foreground"
                            >
                                Link inválido
                            </h2>

                            <p
                                id="reset-password-description"
                                className="text-sm leading-relaxed text-muted-foreground"
                            >
                                Não foi possível identificar um token válido no link de recuperação.
                                Solicite um novo link para continuar.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onRequestNewLink}
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
                        >
                            Solicitar novo link
                        </button>
                    </>
                ) : isSuccess ? (
                    <>
                        <div className="flex flex-col gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </div>

                            <h2
                                id="reset-password-title"
                                className="text-xl font-semibold text-foreground"
                            >
                                Senha redefinida!
                            </h2>

                            <p
                                id="reset-password-description"
                                className="text-sm leading-relaxed text-muted-foreground"
                            >
                                Sua senha foi alterada com sucesso. Agora você pode entrar na sua
                                conta utilizando a nova senha.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
                        >
                            Voltar para o login
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col gap-2">
                            <h2
                                id="reset-password-title"
                                className="text-xl font-semibold text-foreground"
                            >
                                Redefinir senha
                            </h2>

                            <p
                                id="reset-password-description"
                                className="text-sm leading-relaxed text-muted-foreground"
                            >
                                Escolha uma nova senha para sua conta.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <AuthInput
                                id="reset-new-password"
                                label="Nova senha"
                                type="password"
                                value={password}
                                placeholder="Digite sua nova senha"
                                autoComplete="new-password"
                                onChange={setPassword}
                            />

                            <AuthInput
                                id="reset-confirm-password"
                                label="Confirmar nova senha"
                                type="password"
                                value={confirmPassword}
                                placeholder="Digite novamente sua senha"
                                autoComplete="new-password"
                                onChange={setConfirmPassword}
                            />

                            {error && (
                                <p role="alert" className="text-sm text-red-400">
                                    {error}
                                </p>
                            )}

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? 'Redefinindo senha...' : 'Redefinir senha'}
                                </button>

                                <button
                                    type="button"
                                    onClick={onRequestNewLink}
                                    disabled={isSubmitting}
                                    className="inline-flex min-h-10 w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Solicitar outro link
                                </button>

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="inline-flex min-h-10 w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </dialog>
    );
}
