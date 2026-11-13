export type ProfileRole = 'admin' | 'visualizador';

export interface UserProfile {
    name: string;
    email: string;
    role: ProfileRole;
}