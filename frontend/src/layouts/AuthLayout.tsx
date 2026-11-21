import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export function AuthLayout() {
    const { isAuthenticated, isInitializing } = useAuth();
    const { hash } = useLocation();

    // Quem já está logado vai direto para o Início. O link de redefinição de
    // senha (#token=...) continua abrindo aqui mesmo com sessão ativa.
    if (!isInitializing && isAuthenticated && !hash.startsWith('#token=')) {
        return <Navigate to="/inicio" replace />;
    }

    return (
        <div className="dark min-h-screen bg-background text-foreground">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6">
                {/* Identidade da plataforma */}
                <header>
                    <span className="bg-linear-to-r from-emerald-300 to-cyan-400 bg-clip-text text-2xl font-extrabold text-transparent">
                        Green<span className="font-light">ER</span>
                    </span>
                </header>

                {/* Conteúdo da autenticação */}
                <main className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
