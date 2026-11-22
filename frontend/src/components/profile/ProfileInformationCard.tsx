import { UserRound } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/types/profile';

interface ProfileInformationCardProps {
    profile: UserProfile;
}

export function ProfileInformationCard({ profile }: ProfileInformationCardProps) {
    return (
        <div className="flex items-center gap-4 py-2 sm:gap-5 sm:py-3">
            {/* Avatar do usuário. */}
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.08)]">
                <UserRound className="size-8" aria-hidden="true" />
            </div>

            {/* Nome, função e e-mail. */}
            <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="break-words text-xl leading-tight font-semibold text-foreground sm:text-2xl">
                        {profile.name}
                    </h2>

                    <Badge
                        variant="outline"
                        className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    >
                        {profile.role === 'admin' ? 'Administrador' : 'Visualizador'}
                    </Badge>
                </div>

                <p className="break-all text-sm text-muted-foreground sm:text-base">
                    {profile.email}
                </p>
            </div>
        </div>
    );
}
