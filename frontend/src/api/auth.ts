import { postJson, ApiError } from '@/api/services';

import type {
    AuthSession,
    AuthenticatedUser,
    RegisterRequest,
    LoginRequest,
} from '@/types/auth';



const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Cadastra um usuário no backend.
export async function registerAccount(
    data: RegisterRequest,
): Promise<AuthSession> {
    return postJson<RegisterRequest, AuthSession>(
        '/auth/register',
        data,
    );
}



export async function loginAccount(data: LoginRequest): Promise<AuthSession> {
    return postJson('/auth/login', data);
}

// Consulta os dados do usuário autenticado.
// Utilizada para validar e restaurar uma sessão após F5.
export async function getCurrentUser(
    token: string,
): Promise<AuthenticatedUser> {
    const response = await fetch(`${API_URL}/api/v1/profile`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
            error?: { message?: string };
        } | null;

        throw new ApiError(
            body?.error?.message ??
                `Falha na validação da sessão (HTTP ${response.status})`,
            response.status,
        );
    }

    return response.json() as Promise<AuthenticatedUser>;
}