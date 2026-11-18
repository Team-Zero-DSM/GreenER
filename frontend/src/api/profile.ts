
import { getJson, patchJson } from '@/api/services';

import type { AuthSession } from '@/types/auth';

import type {
    UserProfile,
    UpdateProfileRequest,
    ChangePasswordRequest,
} from '@/types/profile';

// GET - Consultar os dados do usuário autenticado.
export async function getMyProfile(): Promise<UserProfile> {
    return getJson<UserProfile>('/profile', {
        authenticated: true,
    });
}

// PATCH - Atualizar nome e e-mail.
export async function updateMyProfile(
    data: UpdateProfileRequest,
): Promise<AuthSession> {
    return patchJson<UpdateProfileRequest, AuthSession>(
        '/profile',
        data,
        {
            authenticated: true,
        },
    );
}

// PATCH - Alterar a senha do usuário autenticado.
export async function changeMyPassword(
    data: ChangePasswordRequest,
): Promise<AuthSession> {
    return patchJson<ChangePasswordRequest, AuthSession>(
        '/profile/password',
        data,
        {
            authenticated: true,
        },
    );
}
