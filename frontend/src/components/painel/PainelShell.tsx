import type { ReactNode } from 'react';

interface PainelShellProps {
    children: ReactNode;
}

// O painel não usa o PageShell: ele ocupa toda a largura da tela, sem o
// limite max-w-7xl das demais páginas, para caber mais indicadores lado a lado.
export function PainelShell({ children }: PainelShellProps) {
    return <main className="w-full space-y-4 p-4 sm:p-6">{children}</main>;
}
