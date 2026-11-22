import { statusMeta, type StatusMeta } from './status';

const TONE_STYLE: Record<StatusMeta['tone'], { token: string; badge: string }> = {
    good: {
        token: '--status-good',
        badge: 'bg-status-good-surface text-status-good ring-1 ring-status-good-border',
    },
    warning: {
        token: '--status-warning',
        badge: 'bg-status-warning-surface text-status-warning ring-1 ring-status-warning-border',
    },
    critical: {
        token: '--status-critical',
        badge: 'bg-status-critical-surface text-status-critical ring-1 ring-status-critical-border',
    },
    neutral: {
        token: '--status-neutral',
        badge: 'bg-status-neutral-surface text-status-neutral ring-1 ring-status-neutral-border',
    },
};

export function statusStyle(status: string) {
    const style = TONE_STYLE[statusMeta(status).tone];

    return {
        badge: style.badge,
        color: getComputedStyle(document.documentElement).getPropertyValue(style.token).trim(),
    };
}
