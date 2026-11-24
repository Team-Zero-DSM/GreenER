import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute() {
    const { isAuthenticated, isInitializing } = useAuth();

    // Aguarda a verificação da sessão antes de decidir o acesso.
    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center" role="status">
                Verificando autenticação...
            </div>
        );
    }

    // Usuário não autenticado deve voltar para o login.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Usuário autenticado pode acessar as rotas protegidas.
    return <Outlet />;
}
