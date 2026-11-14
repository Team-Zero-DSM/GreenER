export type ProfileRole = 'admin' | 'visualizador';

export interface UserProfile {
    name: string;
    email: string;
    role: ProfileRole;
}

// Dados enviados para atualizar o perfil.
export interface UpdateProfileRequest {
    name: string;
    email: string;
}

// Dados enviados para solicitar a alteração da senha.
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}