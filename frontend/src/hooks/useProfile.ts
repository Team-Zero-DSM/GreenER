import { useCallback, useEffect, useState } from 'react';

import {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
} from '@/api/profile';

import type {
    UserProfile,
    UpdateProfileRequest,
    ChangePasswordRequest,
    ChangePasswordResponse,
} from '@/types/profile';

interface ProfileState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error
        ? error.message
        : 'Ocorreu um erro inesperado.';
}

export function useProfile() {
    const [state, setState] = useState<ProfileState>({
        profile: null,
        isLoading: true,
        error: null,
    });

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [reloadVersion, setReloadVersion] = useState(0);

    // Consulta inicial do perfil.
    useEffect(() => {
        let cancelled = false;

        getMyProfile()
            .then((profile) => {
                if (cancelled) return;

                setState({
                    profile,
                    isLoading: false,
                    error: null,
                });
            })
            .catch((error: unknown) => {
                if (cancelled) return;

                setState({
                    profile: null,
                    isLoading: false,
                    error: getErrorMessage(error),
                });
            });

        return () => {
            cancelled = true;
        };
    }, [reloadVersion]);

    // Permite tentar carregar o perfil novamente.
    const reload = useCallback(() => {
        setState((previous) => ({
            ...previous,
            isLoading: true,
            error: null,
        }));

        setReloadVersion((previous) => previous + 1);
    }, []);

    // Atualiza nome e e-mail.
    const saveProfile = useCallback(
        async (data: UpdateProfileRequest): Promise<UserProfile> => {
            setIsSavingProfile(true);

            try {
                const updatedProfile = await updateMyProfile(data);

                setState((previous) => ({
                    ...previous,
                    profile: updatedProfile,
                }));

                return updatedProfile;
            } finally {
                setIsSavingProfile(false);
            }
        },
        [],
    );

    // Solicita a alteração da senha.
    const savePassword = useCallback(
        async (
            data: ChangePasswordRequest,
        ): Promise<ChangePasswordResponse> => {
            setIsChangingPassword(true);

            try {
                return await changeMyPassword(data);
            } finally {
                setIsChangingPassword(false);
            }
        },
        [],
    );

    return {
        profile: state.profile,
        isLoading: state.isLoading,
        error: state.error,

        isSavingProfile,
        isChangingPassword,

        reload,
        saveProfile,
        savePassword,
    };
}