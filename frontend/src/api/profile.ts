import { getJson, patchJson } from '@/api/services';

import { mockProfile } from '@/mocks/profile';

import type {
    UserProfile,
    UpdateProfileRequest,
    ChangePasswordRequest,
    ChangePasswordResponse,
} from '@/types/profile';

// Mantemos o mock ativo enquanto não existe backend.
const USE_PROFILE_MOCK = true;

const MOCK_DELAY = 400;

// Estado temporário do mock.
// Permanece atualizado enquanto a aplicação estiver aberta.
let profileMockData: UserProfile = { ...mockProfile };

// Simula o tempo de resposta de uma requisição.
function simulateRequest(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, MOCK_DELAY);
    });
}

// GET - Consultar perfil do usuário.
export async function getMyProfile(): Promise<UserProfile> {
    if (USE_PROFILE_MOCK) {
        await simulateRequest();

        return { ...profileMockData };
    }

    return getJson<UserProfile>('/users/me');
}

// PATCH - Atualizar nome e e-mail.
export async function updateMyProfile(
    data: UpdateProfileRequest,
): Promise<UserProfile> {
    if (USE_PROFILE_MOCK) {
        await simulateRequest();

        const name = data.name.trim();
        const email = data.email.trim();

        if (!name) {
            throw new Error('O nome não pode ficar vazio.');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Informe um e-mail válido.');
        }

        profileMockData = {
            ...profileMockData,
            name,
            email,
        };

        return { ...profileMockData };
    }

    return patchJson<UpdateProfileRequest, UserProfile>(
        '/users/me',
        data,
    );
}

// PATCH - Solicitar alteração de senha.
export async function changeMyPassword(
    data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
    if (USE_PROFILE_MOCK) {
        await simulateRequest();

        if (!data.currentPassword || !data.newPassword) {
            throw new Error('Preencha todos os campos de senha.');
        }

        // Não armazenamos nem alteramos senhas no mock.
        return {
            message:
                'Simulação concluída. Nenhuma senha foi alterada no backend.',
        };
    }

    return patchJson<
        ChangePasswordRequest,
        ChangePasswordResponse
    >('/users/me/password', data);
}