
import { useState } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type AuthMode = 'login' | 'register';

export function AuthPage() {
    const [mode, setMode] = useState<AuthMode>('login');

    const isLogin = mode === 'login';

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

                {/* Área reservada para os formulários */}
                <div
                    aria-label={
                        isLogin
                            ? 'Formulário de login'
                            : 'Formulário de cadastro'
                    }
                    className="min-h-48"
                >
                    {/* Os componentes dos formulários serão adicionados na próxima task. */}
                </div>

                {/* Alternância entre login e cadastro */}
                <div className="border-t border-border/70 pt-5 text-center">
                    <p className="text-sm text-muted-foreground">
                        {isLogin
                            ? 'Ainda não possui uma conta?'
                            : 'Já possui uma conta?'}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setMode(isLogin ? 'register' : 'login')
                        }
                        className="mt-2 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                        {isLogin ? 'Criar conta' : 'Entrar'}
                    </button>
                </div>

            </CardContent>
        </Card>
    );
}
