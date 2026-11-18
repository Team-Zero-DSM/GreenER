
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { AuthInput } from '@/components/auth/AuthInput';
import { requestPasswordReset } from '@/api/auth';
import { validateEmail } from '@/lib/validation';

interface ForgotPasswordDialogProps {
    onOpenChange: (open: boolean) => void;
    initialEmail?: string;
}

export function ForgotPasswordDialog({
    onOpenChange,
    initialEmail = '',
}: ForgotPasswordDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [email, setEmail] = useState(initialEmail.trim());
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

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

        const normalizedEmail = email.trim();
        const emailError = validateEmail(normalizedEmail);

        if (emailError) {
            setError(emailError);
            return;
        }

        try {
            setIsSubmitting(true);

            await requestPasswordReset(normalizedEmail);

            setIsSubmitted(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível solicitar a recuperação. Tente novamente.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="forgot-password-title"
            aria-describedby="forgot-password-description"
            onCancel={(event) => {
                event.preventDefault();
                handleClose();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
            className="fixed left-1/2 top-1/2 m-0 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-0 text-slate-100 shadow-2xl backdrop:bg-slate-950/75"
        >
            <div className="flex flex-col gap-6 p-6 sm:p-8">
                {!isSubmitted ? (
                    <>
                        <div className="flex flex-col gap-2">
                            <h2
                                id="forgot-password-title"
                                className="text-xl font-semibold"
                            >
                                Esqueceu sua senha?
                            </h2>

                            <p
                                id="forgot-password-description"
                                className="text-sm leading-relaxed text-slate-400"
                            >
                                Informe o e-mail associado à sua conta.
                                Enviaremos um link para você redefinir sua senha.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="flex flex-col gap-5"
                        >
                            <AuthInput
                                id="forgot-password-email"
                                label="E-mail"
                                type="email"
                                value={email}
                                placeholder="Digite seu e-mail"
                                autoComplete="email"
                                onChange={setEmail}
                            />

                            {error && (
                                <p
                                    role="alert"
                                    className="text-sm text-red-400"
                                >
                                    {error}
                                </p>
                            )}

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting
                                        ? 'Enviando solicitação...'
                                        : 'Enviar link de recuperação'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="inline-flex min-h-10 w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
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
                                id="forgot-password-title"
                                className="text-xl font-semibold"
                            >
                                Solicitação recebida
                            </h2>

                            <p
                                id="forgot-password-description"
                                className="text-sm leading-relaxed text-slate-400"
                            >
                                Se houver uma conta ativa associada a esse
                                e-mail, você receberá um link para redefinir
                                sua senha. Verifique também sua caixa de spam.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
                        >
                            Fechar
                        </button>
                    </>
                )}
            </div>
        </dialog>
    );
}
