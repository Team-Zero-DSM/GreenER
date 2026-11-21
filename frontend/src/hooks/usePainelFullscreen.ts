import { useCallback, useEffect, useState } from 'react';

// Modo tela cheia/TV do painel. O painel cobre a página inteira (escondendo a
// navegação) e, quando o navegador permite, a janela também entra em tela cheia.
// A página continua montada, então a atualização automática segue funcionando.
export function usePainelFullscreen() {
    const [active, setActive] = useState(false);

    const enter = useCallback(() => {
        setActive(true);
        // Nem todo navegador libera a tela cheia (ex.: iPhone); sem ela, o painel
        // ainda cobre a página.
        void document.documentElement.requestFullscreen?.().catch(() => undefined);
    }, []);

    const exit = useCallback(() => {
        setActive(false);

        if (document.fullscreenElement) {
            void document.exitFullscreen().catch(() => undefined);
        }
    }, []);

    useEffect(() => {
        if (!active) {
            return;
        }

        // Sair da tela cheia do navegador (Esc ou F11) também encerra o modo TV.
        function handleFullscreenChange() {
            if (!document.fullscreenElement) {
                setActive(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                exit();
            }
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [active, exit]);

    return { active, enter, exit };
}
