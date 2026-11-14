
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router';

interface ProfileMenuItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onClick?: () => void;
    to?: string;
    tone?: 'default' | 'danger';
    disabled?: boolean;
}

export function ProfileMenuItem({
    icon: Icon,
    title,
    description,
    onClick,
    to,
    tone = 'default',
    disabled = false,
}: ProfileMenuItemProps) {
    const isDanger = tone === 'danger';

    const content = (
        <>
            <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    isDanger
                        ? 'bg-red-400/10 text-red-400'
                        : 'bg-emerald-400/10 text-emerald-400'
                }`}
            >
                <Icon className="size-5" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
                <p
                    className={`text-sm font-medium ${
                        isDanger ? 'text-red-400' : 'text-foreground'
                    }`}
                >
                    {title}
                </p>

                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            </div>

            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </>
    );

    const className =
        'group flex min-h-16 w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50';

    if (to) {
        return (
            <NavLink to={to} className={className}>
                {content}
            </NavLink>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}
        >
            {content}
        </button>
    );
}
