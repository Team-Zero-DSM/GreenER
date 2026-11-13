
import { useState } from 'react';
import { UserRound, ShieldCheck, Settings, LogOut } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';

import { Card, CardContent } from '@/components/ui/card';

import { ProfileInformationCard } from '@/components/profile/ProfileInformationCard';
import { ProfileInformationForm } from '@/components/profile/ProfileInformationForm';
import { ProfilePasswordForm } from '@/components/profile/ProfilePasswordForm';
import { ProfileMenuItem } from '@/components/profile/ProfileMenuItem';

import { mockProfile } from '@/mocks/profile';
import type { UserProfile } from '@/types/profile';

type ProfileSection = 'overview' | 'information' | 'security';

export function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>(mockProfile);

    const [activeSection, setActiveSection] =
        useState<ProfileSection>('overview');

    function handleSaveProfile(updatedProfile: UserProfile) {
        setProfile(updatedProfile);
        setActiveSection('overview');
    }

    return (
        <PageShell>
            <PageHeader
                title="Meu perfil"
                description="Gerencie suas informações pessoais e as configurações da sua conta."
            />

            <Card className="mx-auto w-full max-w-2xl border border-border/70 bg-card/80">
                <CardContent className="space-y-6 p-6 sm:p-8">

                    {/* Área fixa: identificação do usuário */}
                    <ProfileInformationCard profile={profile} />

                    <div className="border-t border-border/70" />

                    {/* Área dinâmica: conteúdo conforme a seleção */}
                    <div className="min-h-80 space-y-4">

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

                                {profile.role === 'admin' && (
    <ProfileMenuItem
        icon={Settings}
        title="Configurações do sistema"
        description="Gerenciar configurações administrativas"
        to="/configuracoes"
    />
)}

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

                        {activeSection === 'information' && (
                            <ProfileInformationForm
                                profile={profile}
                                onSave={handleSaveProfile}
                                onBack={() => setActiveSection('overview')}
                            />
                        )}

                        {activeSection === 'security' && (
                            <ProfilePasswordForm
                                onBack={() => setActiveSection('overview')}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </PageShell>
    );
}
