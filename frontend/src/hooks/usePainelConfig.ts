import { useCallback, useEffect, useState } from 'react';

import { fetchMyDashboard, saveMyDashboard } from '@/api/dashboards';
import { PAINEL_DEFAULT_CONFIG } from '@/components/painel/painelLayoutPadrao';
import type { PainelConfig } from '@/types/painel';
import { readStoredPainelConfig, writeStoredPainelConfig } from '@/utils/painelStorage';
import { useAuth } from '@/hooks/useAuth';

const LOCAL_NOTICE =
    'O servidor não respondeu para guardar o painel. A configuração está sendo mantida neste navegador.';

// Carrega a configuração do painel ao abrir a página e devolve a função que a
// grava. Enquanto carrega, e para quem nunca salvou, vale o layout padrão.
// Se o backend de persistência não responder, a configuração é lida e gravada
// no navegador, para não se perder entre os acessos.
export function usePainelConfig() {
    const { user } = useAuth();
    const userId = user?.id;
    const [config, setConfig] = useState<PainelConfig>(PAINEL_DEFAULT_CONFIG);
    const [isLoading, setIsLoading] = useState(Boolean(userId));
    // Aviso para o usuário quando a configuração está só no navegador.
    const [notice, setNotice] = useState<string | null>(null);
    const [configUserId, setConfigUserId] = useState(userId);

    if (configUserId !== userId) {
        setConfigUserId(userId);
        setConfig(PAINEL_DEFAULT_CONFIG);
        setIsLoading(Boolean(userId));
        setNotice(null);
    }

    useEffect(() => {
        let cancelled = false;
        if (!userId) return;

        fetchMyDashboard()
            .then((saved) => {
                if (cancelled) return;

                // Sem painel salvo no backend, aproveita o que estiver no navegador.
                const next = saved ?? readStoredPainelConfig(userId);

                if (next) {
                    setConfig(next);
                    writeStoredPainelConfig(userId, next);
                }
            })
            .catch(() => {
                if (cancelled) return;

                const stored = readStoredPainelConfig(userId);

                if (stored) {
                    setConfig(stored);
                }

                setNotice(LOCAL_NOTICE);
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [userId]);

    const saveConfig = useCallback(
        async (next: PainelConfig) => {
            if (!userId) throw new Error('Entre na sua conta para salvar o painel.');
            // A tela já passa a usar a nova configuração; a gravação segue em segundo plano.
            setConfig(next);
            // A cópia do navegador é gravada sempre, mesmo que o backend falhe em seguida.
            writeStoredPainelConfig(userId, next);

            try {
                await saveMyDashboard(next);
                setNotice(null);
            } catch {
                setNotice(LOCAL_NOTICE);
            }
        },
        [userId],
    );

    return { config, isLoading, notice, saveConfig };
}
