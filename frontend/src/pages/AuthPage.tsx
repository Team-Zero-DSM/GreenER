
import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { AuthForm } from '@/components/auth/AuthForm';

import {
    registerAccount,
    loginAccount,
} from '@/api/auth';

import { ApiError } from '@/api/services';

import { useAuth } from '@/hooks/useAuth';

import type {
    AuthMode,
    LoginRequest,
    RegisterRequest,
} from '@/types/auth';

export function AuthPage() {
    const navigate = useNavigate();

    const { setSession } = useAuth();

    const [mode, setMode] = useState<AuthMode>('login');

    const [feedback, setFeedback] = useState('');
    const [formError, setFormError] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLogin = mode === 'login';

    // Realiza o login.
    async function handleLogin(data: LoginRequest) {
        setFormError('');
        setFeedback('');
        setIsSubmitting(true);

        try {
            const session = await loginAccount(data);

            // Armazena o token e os dados do usuário.
            setSession(session);

            // Redireciona após autenticação bem-sucedida.
            navigate('/inicio', { replace: true });

        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 401) {
                    setFormError('E-mail ou senha inválidos.');
                } else if (error.status === 429) {
                    setFormError(
                        'Muitas tentativas. Tente novamente mais tarde.'
                    );
                } else {
                    setFormError(error.message);
                }
            } else {
                setFormError(
                    'Não foi possível conectar ao servidor. Verifique se o backend está em execução.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    // Realiza o cadastro.
    async function handleRegister(data: RegisterRequest) {
        setFormError('');
        setFeedback('');
        setIsSubmitting(true);

        try {
            const session = await registerAccount(data);

            // O cadastro também retorna uma sessão autenticada.
            setSession(session);

            navigate('/inicio', { replace: true });

        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 409) {
                    setFormError('Este e-mail já está cadastrado.');
                } else if (error.status === 429) {
                    setFormError(
                        'Muitas tentativas. Tente novamente mais tarde.'
                    );
                } else {
                    setFormError(error.message);
                }
            } else {
                setFormError(
                    'Não foi possível conectar ao servidor. Verifique se o backend está em execução.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    // Alterna entre login e cadastro.
    function handleModeChange() {
        if (isSubmitting) return;

        setMode(isLogin ? 'register' : 'login');

        setFeedback('');
        setFormError('');
    }

    return (
        <Card className="w-full border border-border/70 bg-card/80">
            <CardHeader>
                <CardTitle className="text-2xl">
                    {isLogin
                        ? 'Acesse sua conta'
                        : 'Crie sua conta'}
                </CardTitle>

                <CardDescription>
                    {isLogin
                        ? 'Entre com suas credenciais para acessar o GreenER.'
                        : 'Preencha seus dados para começar a utilizar o GreenER.'}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <AuthForm
                    mode={mode}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    statusMessage={feedback}
                    externalError={formError}
                    isSubmitting={isSubmitting}
                />

                <div className="border-t border-border/70 pt-5 text-center">
                    <p className="text-sm text-muted-foreground">
                        {isLogin
                            ? 'Ainda não possui uma conta?'
                            : 'Já possui uma conta?'}
                    </p>

                    <button
                        type="button"
                        onClick={handleModeChange}
                        disabled={isSubmitting}
                        className="mt-2 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300 disabled:opacity-60"
                    >
                        {isLogin ? 'Criar conta' : 'Entrar'}
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
