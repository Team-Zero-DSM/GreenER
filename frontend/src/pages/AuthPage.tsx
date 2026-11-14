
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

import type {
    AuthMode,
    LoginRequest,
    RegisterRequest,
} from '@/types/auth';

export function AuthPage() {
    const navigate = useNavigate();

    const [mode, setMode] = useState<AuthMode>('login');
    const [registerFeedback, setRegisterFeedback] = useState('');

    const isLogin = mode === 'login';

    function handleLogin(data: LoginRequest) {
        // Redirecionamento provisório, sem autenticação real.
        void data;
        navigate('/inicio');
    }

    function handleRegister(data: RegisterRequest) {
        // Simulação local: os dados ainda não são enviados ao backend.
        void data;

        setRegisterFeedback(
            'Cadastro validado localmente. A integração será realizada posteriormente.'
        );
    }

    function handleModeChange() {
        setMode(isLogin ? 'register' : 'login');
        setRegisterFeedback('');
    }

    return (
        <Card className="w-full border border-border/70 bg-card/80">
            <CardHeader>
                <CardTitle className="text-2xl">
                    {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
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
                    statusMessage={registerFeedback}
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
                        className="mt-2 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                        {isLogin ? 'Criar conta' : 'Entrar'}
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
