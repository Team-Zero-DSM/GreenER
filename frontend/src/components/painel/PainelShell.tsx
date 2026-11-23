import type { ReactNode } from 'react';

interface PainelShellProps {
    fullscreen?: boolean;
    children: ReactNode;
}

export function PainelShell({ fullscreen = false, children }: PainelShellProps) {
    return (
        <main
            data-painel-fullscreen={fullscreen ? 'true' : undefined}
            className={`w-full p-4 sm:p-6 ${
                fullscreen
                    ? 'fixed inset-0 z-[60] flex flex-col gap-4 overflow-y-auto bg-transparent md:overflow-hidden'
                    : 'space-y-4'
            }`}
        >
            {children}
        </main>
    );
}