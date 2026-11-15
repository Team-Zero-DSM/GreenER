import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import { AuthContext } from './auth';

import {
    saveAuthSession,
    getAuthSession,
    clearAuthSession,
} from '@/api/session';

import { getCurrentUser } from '@/api/auth';
import { ApiError } from '@/api/services';

import type {
    AuthenticatedUser,
    AuthSession,
} from '@/types/auth';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // Salva a sessão recebida após cadastro ou login.
    const setSession = useCallback((session: AuthSession) => {
        saveAuthSession(session);
        setUser(session.user);
    }, []);

    // Encerra a sessão e remove os dados armazenados.
    const logout = useCallback(() => {
        clearAuthSession();
        setUser(null);
    }, []);

    // Tenta restaurar e validar uma sessão existente.
    useEffect(() => {
        let active = true;

        async function restoreSession() {
            const storedSession = getAuthSession();

            if (!storedSession) {
                setIsInitializing(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser(
                    storedSession.token,
                );

                if (!active) return;

                // Atualiza os dados com a resposta mais recente do backend.
                saveAuthSession({
                    token: storedSession.token,
                    user: currentUser,
                });

                setUser(currentUser);
            } catch (error) {
                if (!active) return;

                // Token inválido ou expirado: encerra a sessão.
                if (error instanceof ApiError && error.status === 401) {
                    clearAuthSession();
                    setUser(null);
                } else {
                    // Em caso de falha de comunicação, preserva a sessão local.
                    // O backend continuará validando o token nas operações protegidas.
                    setUser(storedSession.user);
                }
            } finally {
                if (active) {
                    setIsInitializing(false);
                }
            }
        }

        void restoreSession();

        return () => {
            active = false;
        };
    }, []);

    const contextValue = useMemo(
        () => ({
            user,
            isAuthenticated: user !== null,
            isInitializing,
            setSession,
            logout,
        }),
        [user, isInitializing, setSession, logout],
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}