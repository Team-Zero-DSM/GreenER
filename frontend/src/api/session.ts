import type { AuthSession } from '@/types/auth';

const SESSION_KEY = 'greener.auth.session';

// Verifica se os dados recuperados possuem o formato esperado.
function isValidSession(value: unknown): value is AuthSession {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const session = value as Record<string, unknown>;

    if (
        typeof session.token !== 'string' ||
        !session.token
    ) {
        return false;
    }

    if (!session.user || typeof session.user !== 'object') {
        return false;
    }

    const user = session.user as Record<string, unknown>;

    return (
        typeof user.id === 'string' &&
        typeof user.name === 'string' &&
        typeof user.email === 'string' &&
        (user.role === 'admin' || user.role === 'visualizador')
    );
}

// Armazena a sessão no navegador.
export function saveAuthSession(session: AuthSession): void {
    try {
        sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify(session),
        );
    } catch {
        throw new Error(
            'Não foi possível armazenar a sessão neste navegador.',
        );
    }
}

// Recupera a sessão armazenada.
export function getAuthSession(): AuthSession | null {
    try {
        const storedSession = sessionStorage.getItem(SESSION_KEY);

        if (!storedSession) {
            return null;
        }

        const parsedSession: unknown = JSON.parse(storedSession);

        if (!isValidSession(parsedSession)) {
            clearAuthSession();
            return null;
        }

        return parsedSession;
    } catch {
        clearAuthSession();
        return null;
    }
}

// Recupera somente o token.
export function getStoredAuthToken(): string | null {
    return getAuthSession()?.token ?? null;
}

// Remove a sessão do navegador.
export function clearAuthSession(): void {
    try {
        sessionStorage.removeItem(SESSION_KEY);
    } catch {
        // A limpeza não deve interromper o encerramento da sessão.
    }
}