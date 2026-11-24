import { useState } from 'react';
import { UserRound, ShieldCheck, Settings, LogOut } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { ProfileInformationCard } from '@/components/profile/ProfileInformationCard';
import { ProfileInformationForm } from '@/components/profile/ProfileInformationForm';
import { ProfilePasswordForm } from '@/components/profile/ProfilePasswordForm';
import { ProfileMenuItem } from '@/components/profile/ProfileMenuItem';

import { AnimatedContent } from '@/components/shared/AnimatedContent';

import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

import type { UpdateProfileRequest } from '@/types/profile';

import { ProfileGlobeBackground } from '@/components/globe/ProfileGlobeBackground';

type ProfileSection = 'overview' | 'information' | 'security';

export function ProfilePage() {
    const { logout } = useAuth();

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

    const [activeSection, setActiveSection] = useState<ProfileSection>('overview');

    async function handleSaveProfile(data: UpdateProfileRequest) {
        await saveProfile(data);

        // Retorna ao menu somente depois do salvamento bem-sucedido.
        setActiveSection('overview');
    }

    return (
        <>
            {/* Fundo espacial e globo 3D. */}
            <ProfileGlobeBackground />

            <main className="relative z-10 grid h-[calc(100dvh_-_var(--header-h,5rem)_-_7rem)] min-h-0 w-full grid-cols-1 grid-rows-[minmax(0,1fr)] items-center overflow-hidden overscroll-none px-3 py-2 md:h-auto md:min-h-[calc(100svh_-_var(--header-h,_5rem)_-_4rem)] md:grid-rows-none md:overflow-visible md:px-4 md:py-8 lg:grid-cols-2 lg:px-0 lg:py-6">
                {/* Divisão visual exclusiva do desktop. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-8 left-1/2 hidden w-px -translate-x-1/2 bg-linear-to-b from-transparent via-border/50 to-transparent lg:block"
                />

                {/* Card centralizado na direita no desktop e ocupando a largura disponível no mobile. */}
                <section className="mx-auto flex max-h-full min-h-0 w-full max-w-2xl flex-col lg:col-start-2 lg:w-[90%] lg:max-w-4xl">
                    <Card className="max-h-full min-h-0 w-full overflow-hidden border border-border/70 bg-card/75 sm:bg-card/65">
                        {/* Cabeçalho do perfil. */}
                        <CardHeader className="gap-1 px-4 sm:px-8">
                            <CardTitle className="text-2xl font-semibold">Meu perfil</CardTitle>

                            <CardDescription className="text-sm leading-relaxed xl:whitespace-nowrap">
                                Gerencie suas informações pessoais e a segurança da sua conta.
                            </CardDescription>
                        </CardHeader>

                        {/* Carregamento inicial. */}
                        {isLoading && (
                            <CardContent className="flex min-h-[24rem] items-center justify-center px-4 sm:px-8">
                                <p role="status" className="text-sm text-muted-foreground">
                                    Carregando informações do perfil...
                                </p>
                            </CardContent>
                        )}

                        {/* Erro ao carregar o perfil. */}
                        {!isLoading && error && (
                            <CardContent className="flex min-h-[24rem] flex-col items-center justify-center gap-4 px-4 text-center sm:px-8">
                                <p role="alert" className="text-sm text-red-400">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={reload}
                                    className="min-h-11 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
                                >
                                    Tentar novamente
                                </button>
                            </CardContent>
                        )}

                        {/* Conteúdo do perfil. */}
                        {!isLoading && !error && profile && (
                            <CardContent className="space-y-4 px-4 py-3 sm:space-y-6 sm:px-8 sm:py-6">
                                {/* Identificação fixa do usuário. */}
                                <ProfileInformationCard profile={profile} />

                                <div className="border-t border-border/70" />

                                {/* Conteúdo dinâmico com transição entre seções. */}
                                <AnimatedContent animationKey={activeSection}>
                                    {/* Menu principal. */}
                                    {activeSection === 'overview' && (
                                        <div className="space-y-2">
                                            <ProfileMenuItem
                                                icon={UserRound}
                                                title="Informações pessoais"
                                                description="Alterar nome e e-mail"
                                                onClick={() => setActiveSection('information')}
                                            />

                                            <ProfileMenuItem
                                                icon={ShieldCheck}
                                                title="Segurança da conta"
                                                description="Gerenciar senha de acesso"
                                                onClick={() => setActiveSection('security')}
                                            />

                                            {/* Opção exclusiva do administrador. */}
                                            {profile.role === 'admin' && (
                                                <ProfileMenuItem
                                                    icon={Settings}
                                                    title="Configurações do sistema"
                                                    description="Gerenciar configurações administrativas"
                                                    to="/configuracoes"
                                                />
                                            )}

                                            {/* Sair da conta. */}
                                            <div className="mt-4 border-t border-border/70 pt-3">
                                                <ProfileMenuItem
                                                    icon={LogOut}
                                                    title="Sair da conta"
                                                    description="Encerrar sua sessão na plataforma"
                                                    tone="danger"
                                                    onClick={logout}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Edição das informações pessoais. */}
                                    {activeSection === 'information' && (
                                        <ProfileInformationForm
                                            profile={profile}
                                            onSave={handleSaveProfile}
                                            onBack={() => setActiveSection('overview')}
                                            isSaving={isSavingProfile}
                                        />
                                    )}

                                    {/* Alteração de senha. */}
                                    {activeSection === 'security' && (
                                        <ProfilePasswordForm
                                            onSubmit={savePassword}
                                            onBack={() => setActiveSection('overview')}
                                            isSubmitting={isChangingPassword}
                                        />
                                    )}
                                </AnimatedContent>
                            </CardContent>
                        )}
                    </Card>
                </section>
            </main>
        </>
    );
}
