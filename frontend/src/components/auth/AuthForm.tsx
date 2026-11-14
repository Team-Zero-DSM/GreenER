
import { useState, type FormEvent } from 'react';

import { AuthInput } from '@/components/auth/AuthInput';

import type {
    AuthMode,
    LoginRequest,
    RegisterRequest,
} from '@/types/auth';

interface AuthFormProps {
    mode: AuthMode;
    onLogin: (data: LoginRequest) => void;
    onRegister: (data: RegisterRequest) => void;
    statusMessage?: string;
}

export function AuthForm({
    mode,
    onLogin,
    onRegister,
    statusMessage,
}: AuthFormProps) {
    const isLogin = mode === 'login';

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [forgotPasswordMessage, setForgotPasswordMessage] =
        useState<string | null>(null);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);
        setForgotPasswordMessage(null);

        if (isLogin) {
            const loginData: LoginRequest = {
                email: email.trim(),
                password,
            };

            onLogin(loginData);
            return;
        }

        // Verifica se o nome de usuário foi preenchido corretamente.
        if (!username.trim()) {
            setError('Informe um nome de usuário válido.');
            return;
        }

        // Verifica o tamanho mínimo da senha.
        if (password.length < 8) {
            setError('A senha deve possuir pelo menos 8 caracteres.');
            return;
        }

        // Verifica se a confirmação corresponde à senha.
        if (password !== confirmPassword) {
            setError('As senhas não correspondem.');
            return;
        }

        const registerData: RegisterRequest = {
            username: username.trim(),
            email: email.trim(),
            password,
        };

        onRegister(registerData);
    }

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            {!isLogin && (
                <AuthInput
                    id="auth-username"
                    label="Nome de usuário"
                    type="text"
                    value={username}
                    placeholder="Digite seu nome de usuário"
                    autoComplete="username"
                    onChange={setUsername}
                />
            )}

            <AuthInput
                id="auth-email"
                label="E-mail"
                type="email"
                value={email}
                placeholder="Digite seu e-mail"
                autoComplete="email"
                onChange={setEmail}
            />

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
                            onClick={() =>
                                setForgotPasswordMessage(
                                    'A recuperação de senha estará disponível após a integração com o backend.'
                                )
                            }
                            className="shrink-0 text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                        >
                            Esqueceu sua senha?
                        </button>
                    ) : undefined
                }
            />

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

            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}

            {forgotPasswordMessage && (
                <p role="status" className="text-sm text-muted-foreground">
                    {forgotPasswordMessage}
                </p>
            )}

            {statusMessage && (
                <p role="status" className="text-sm text-emerald-400">
                    {statusMessage}
                </p>
            )}

            <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
            >
                {isLogin ? 'Entrar' : 'Criar conta'}
            </button>

        </form>
    );
}
