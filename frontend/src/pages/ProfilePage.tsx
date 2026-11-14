import { useState } from 'react';
import { UserRound, ShieldCheck, Settings, LogOut } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';

import { Card, CardContent } from '@/components/ui/card';

import { ProfileInformationCard } from '@/components/profile/ProfileInformationCard';
import { ProfileInformationForm } from '@/components/profile/ProfileInformationForm';
import { ProfilePasswordForm } from '@/components/profile/ProfilePasswordForm';
import { ProfileMenuItem } from '@/components/profile/ProfileMenuItem';

import { useProfile } from '@/hooks/useProfile';

import type {
    UpdateProfileRequest,
} from '@/types/profile';

type ProfileSection = 'overview' | 'information' | 'security';

export function ProfilePage() {
    const {
        profile,
        isLoading,
        error,
        isSavingProfile,
        isChangingPassword,
        reload,
        saveProfile,
        savePassword,
    } = useProfile();

    const [activeSection, setActiveSection] =
        useState<ProfileSection>('overview');

    async function handleSaveProfile(data: UpdateProfileRequest) {
        await saveProfile(data);

        // Volta ao menu somente depois da operação bem-sucedida.
        setActiveSection('overview');
    }

    return (
        <PageShell>
            <PageHeader
                title="Meu perfil"
                description="Gerencie suas informações pessoais e as configurações da sua conta."
            />

            {/* Carregamento inicial */}
            {isLoading && (
                <Card className="mx-auto w-full max-w-2xl border border-border/70">
                    <CardContent className="flex min-h-40 items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                            Carregando informações do perfil...
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Erro ao carregar o perfil */}
            {!isLoading && error && (
                <Card className="mx-auto w-full max-w-2xl border border-border/70">
                    <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                        <p className="text-sm text-red-400">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={reload}
                            className="min-h-11 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                        >
                            Tentar novamente
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* Conteúdo do perfil */}
            {!isLoading && !error && profile && (
                <Card className="mx-auto min-h-[34rem] w-full max-w-2xl border border-border/70 bg-card/80">
                    <CardContent className="space-y-6 p-6 sm:p-8">

                        {/* Área fixa: identificação do usuário */}
                        <ProfileInformationCard profile={profile} />

                        <div className="border-t border-border/70" />

                        {/* Área dinâmica: opções e formulários */}
                        <div className="min-h-[20rem]">

                            {/* Menu principal */}
                            {activeSection === 'overview' && (
                                <div className="space-y-2">
                                    <ProfileMenuItem
                                        icon={UserRound}
                                        title="Informações pessoais"
                                        description="Alterar nome e e-mail"
                                        onClick={() =>
                                            setActiveSection('information')
                                        }
                                    />

                                    <ProfileMenuItem
                                        icon={ShieldCheck}
                                        title="Segurança da conta"
                                        description="Gerenciar senha de acesso"
                                        onClick={() =>
                                            setActiveSection('security')
                                        }
                                    />

                                    {/* Configurações exclusivas do administrador */}
                                    {profile.role === 'admin' && (
                                        <ProfileMenuItem
                                            icon={Settings}
                                            title="Configurações do sistema"
                                            description="Gerenciar configurações administrativas"
                                            to="/configuracoes"
                                        />
                                    )}

                                    {/* Sair da conta */}
                                    <div className="mt-4 border-t border-border/70 pt-3">
                                        <ProfileMenuItem
                                            icon={LogOut}
                                            title="Sair da conta"
                                            description="Encerrar sua sessão na plataforma"
                                            tone="danger"
                                            disabled
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Formulário de informações pessoais */}
                            {activeSection === 'information' && (
                                <ProfileInformationForm
                                    profile={profile}
                                    onSave={handleSaveProfile}
                                    onBack={() =>
                                        setActiveSection('overview')
                                    }
                                    isSaving={isSavingProfile}
                                />
                            )}

                            {/* Formulário de segurança */}
                            {activeSection === 'security' && (
                                <ProfilePasswordForm
                                    onSubmit={savePassword}
                                    onBack={() =>
                                        setActiveSection('overview')
                                    }
                                    isSubmitting={isChangingPassword}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </PageShell>
    );
}