
import { postJson, ApiError } from '@/api/services';

import type {
    AuthSession,
    AuthenticatedUser,
    RegisterRequest,
    LoginRequest,
} from '@/types/auth';

const API_URL = (
    import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
).replace(/\/+$/, '');

// Cadastra um usuário no backend.
export async function registerAccount(
    data: RegisterRequest,
): Promise<AuthSession> {
    return postJson<RegisterRequest, AuthSession>(
        '/auth/register',
        data,
    );
}

// Realiza o login do usuário.
export async function loginAccount(
    data: LoginRequest,
): Promise<AuthSession> {
    return postJson<LoginRequest, AuthSession>(
        '/auth/login',
        data,
    );
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

// Solicita o envio do link de recuperação de senha.
export async function requestPasswordReset(
    email: string,
): Promise<void> {
    await postJson<
        { email: string },
        { message: string }
    >('/auth/forgot-password', {
        email: email.trim(),
    });
}

// Redefine a senha utilizando o token recebido por e-mail.
export async function resetPassword(
    token: string,
    password: string,
): Promise<void> {
    await postJson<
        { token: string; password: string },
        void
    >('/auth/reset-password', {
        token,
        password,
    });
}
