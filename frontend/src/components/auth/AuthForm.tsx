
import { useEffect, useState, type FormEvent } from 'react';

import { AuthInput } from '@/components/auth/AuthInput';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';
import { ResetPasswordDialog } from '@/components/auth/ResetPasswordDialog';

import type {
    AuthMode,
    LoginRequest,
    RegisterRequest,
} from '@/types/auth';

// Recupera o token do fragmento da URL.
function getResetTokenFromUrl(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const params = new URLSearchParams(
        window.location.hash.slice(1),
    );

    return params.get('token');
}

interface AuthFormProps {
    mode: AuthMode;
    onLogin: (data: LoginRequest) => Promise<void>;
    onRegister: (data: RegisterRequest) => Promise<void>;
    statusMessage?: string;
    externalError?: string;
    isSubmitting?: boolean;
}

export function AuthForm({
    mode,
    onLogin,
    onRegister,
    statusMessage,
    externalError,
    isSubmitting = false,
}: AuthFormProps) {
    const isLogin = mode === 'login';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState<string | null>(null);

    const [isForgotPasswordOpen, setIsForgotPasswordOpen] =
        useState(false);

    // Recupera o token na própria inicialização do estado.
    const [resetToken, setResetToken] = useState<string | null>(
        getResetTokenFromUrl,
    );

    // O Dialog já começa aberto quando existe um token na URL.
    const [isResetPasswordOpen, setIsResetPasswordOpen] =
        useState(() => Boolean(resetToken));

    // Remove o token da barra de endereço sem atualizar o estado.
    useEffect(() => {
        if (!resetToken) return;

        const currentToken = getResetTokenFromUrl();

        if (currentToken !== resetToken) return;

        window.history.replaceState(
            window.history.state,
            document.title,
            `${window.location.pathname}${window.location.search}`,
        );
    }, [resetToken]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting) return;

        setError(null);

        if (isLogin) {
            const loginData: LoginRequest = {
                email: email.trim(),
                password,
            };

            await onLogin(loginData);
            return;
        }

        // Validação do nome.
        if (!name.trim()) {
            setError('Informe um nome válido.');
            return;
        }

        if (name.trim().length > 100) {
            setError('O nome deve possuir no máximo 100 caracteres.');
            return;
        }

        // Validação do tamanho da senha.
        if (password.length < 8) {
            setError('A senha deve possuir pelo menos 8 caracteres.');
            return;
        }

        // Limite de 72 bytes utilizado pelo bcrypt no backend.
        const passwordBytes = new TextEncoder().encode(password).length;

        if (passwordBytes > 72) {
            setError('A senha não pode ultrapassar 72 bytes.');
            return;
        }

        // Confirmação da senha.
        if (password !== confirmPassword) {
            setError('As senhas não correspondem.');
            return;
        }

        const registerData: RegisterRequest = {
            name: name.trim(),
            email: email.trim(),
            password,
        };

        await onRegister(registerData);
    }

    function handleResetDialogChange(open: boolean) {
        setIsResetPasswordOpen(open);

        if (!open) {
            setResetToken(null);
        }
    }

    function handleRequestNewLink() {
        setIsResetPasswordOpen(false);
        setResetToken(null);
        setIsForgotPasswordOpen(true);
    }

    return (
        <>
            <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
            >
                {/* Nome: somente cadastro */}
                {!isLogin && (
                    <AuthInput
                        id="auth-name"
                        label="Nome"
                        type="text"
                        value={name}
                        placeholder="Digite seu nome"
                        autoComplete="name"
                        onChange={setName}
                    />
                )}

                {/* E-mail */}
                <AuthInput
                    id="auth-email"
                    label="E-mail"
                    type="email"
                    value={email}
                    placeholder="Digite seu e-mail"
                    autoComplete="email"
                    onChange={setEmail}
                />

                {/* Senha */}
                <AuthInput
                    id="auth-password"
                    label="Senha"
                    type="password"
                    value={password}
                    placeholder="Digite sua senha"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    onChange={setPassword}
                    labelAction={
                        isLogin ? (
                            <button
                                type="button"
                                onClick={() => setIsForgotPasswordOpen(true)}
                                className="shrink-0 text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                            >
                                Esqueceu sua senha?
                            </button>
                        ) : undefined
                    }
                />

                {/* Confirmação: somente cadastro */}
                {!isLogin && (
                    <AuthInput
                        id="auth-confirm-password"
                        label="Confirmar senha"
                        type="password"
                        value={confirmPassword}
                        placeholder="Digite novamente sua senha"
                        autoComplete="new-password"
                        onChange={setConfirmPassword}
                    />
                )}

                {/* Mensagens de erro */}
                {(error || externalError) && (
                    <p
                        role="alert"
                        className="text-sm text-red-400"
                    >
                        {error || externalError}
                    </p>
                )}

                {/* Mensagem de sucesso */}
                {statusMessage && (
                    <p
                        role="status"
                        className="text-sm text-emerald-400"
                    >
                        {statusMessage}
                    </p>
                )}

                {/* Envio do formulário */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? isLogin
                            ? 'Entrando...'
                            : 'Criando conta...'
                        : isLogin
                            ? 'Entrar'
                            : 'Criar conta'}
                </button>
            </form>

            {isForgotPasswordOpen && (
    <ForgotPasswordDialog
        initialEmail={email}
        onOpenChange={setIsForgotPasswordOpen}
    />
)}

{isResetPasswordOpen && (
    <ResetPasswordDialog
        token={resetToken}
        onOpenChange={handleResetDialogChange}
        onRequestNewLink={handleRequestNewLink}
    />
)}
           
        </>
    );
}
