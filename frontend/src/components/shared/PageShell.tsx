import type { ReactNode } from 'react';

interface PageShellProps {
    children: ReactNode;
    className?: string;
}

export function PageShell({
    children,
    className = 'mx-auto max-w-7xl space-y-6 p-4 sm:p-6',
}: PageShellProps) {
    return <main className={className}>{children}</main>;
}
