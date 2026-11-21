import type { ReactNode } from 'react';

interface PainelShellProps {
    // Modo tela cheia/TV: o painel cobre a página inteira, por cima da navegação.
    fullscreen?: boolean;
    children: ReactNode;
}

// O painel não usa o PageShell: ele ocupa toda a largura da tela, sem o
// limite max-w-7xl das demais páginas, para caber mais indicadores lado a lado.
export function PainelShell({ fullscreen = false, children }: PainelShellProps) {
    return (
        <main
            className={`w-full p-4 sm:p-6 ${
                fullscreen
                    ? // Tela cheia: a altura da tela é o limite, e a grade ocupa o que
                      // sobra abaixo do cabeçalho (no celular, a pilha ainda rola).
                      'fixed inset-0 z-50 flex flex-col gap-4 overflow-y-auto bg-background md:overflow-hidden'
                    : 'space-y-4'
            }`}
        >
            {children}
        </main>
    );
}
