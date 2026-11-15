export type AuthMode = 'login' | 'register';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'visualizador';
}

export interface AuthSession {
    token: string;
    user: AuthenticatedUser;
}