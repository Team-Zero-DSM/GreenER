import { useCallback, useEffect, useState } from 'react';

import { fetchMyDashboard, saveMyDashboard } from '@/api/dashboards';
import { PAINEL_DEFAULT_CONFIG } from '@/components/painel/painelLayoutPadrao';
import type { PainelConfig } from '@/types/painel';

// Carrega a configuração do painel ao abrir a página e devolve a função que a
// grava. Enquanto carrega, e para quem nunca salvou, vale o layout padrão.
export function usePainelConfig() {
    const [config, setConfig] = useState<PainelConfig>(PAINEL_DEFAULT_CONFIG);
    const [isLoading, setIsLoading] = useState(true);
    // Aviso para o usuário quando carregar ou salvar não dá certo.
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetchMyDashboard()
            .then((saved) => {
                if (!cancelled && saved) {
                    setConfig(saved);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setNotice(
                        'Não foi possível carregar o painel salvo. Exibindo o layout padrão.',
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const saveConfig = useCallback(async (next: PainelConfig) => {
        // A tela já passa a usar a nova configuração; a gravação segue em segundo plano.
        setConfig(next);

        try {
            await saveMyDashboard(next);
            setNotice(null);
        } catch {
            setNotice(
                'Não foi possível salvar o painel. As alterações valem só até sair da página.',
            );
        }
    }, []);

    return { config, isLoading, notice, saveConfig };
}
