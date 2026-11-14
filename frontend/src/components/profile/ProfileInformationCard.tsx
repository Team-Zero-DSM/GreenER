
import { UserRound } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/types/profile';

interface ProfileInformationCardProps {
    profile: UserProfile;
}

export function ProfileInformationCard({
    profile,
}: ProfileInformationCardProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <UserRound className="size-7" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="break-words text-lg font-semibold text-foreground">
                        {profile.name}
                    </h2>

                    <Badge
                        variant="outline"
                        className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    >
                        {profile.role === 'admin'
                            ? 'Administrador'
                            : 'Visualizador'}
                    </Badge>
                </div>

                <p className="break-all text-sm text-muted-foreground">
                    {profile.email}
                </p>
            </div>
        </div>
    );
}
