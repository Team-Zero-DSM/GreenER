import type { AuthenticatedUser } from '@/types/auth';


export type ProfileRole = AuthenticatedUser['role'];
export type UserProfile = AuthenticatedUser;

// Dados enviados para atualizar o perfil.
export interface UpdateProfileRequest {
    name: string;
    email: string;
}

// Dados enviados para alterar a senha.
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
