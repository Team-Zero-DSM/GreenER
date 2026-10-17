import { useEffect, useState } from 'react';
import { useMonitoring } from '@/contexts/monitoring';

interface QueryState<T> {
    data: T | null;
    error: string | null;
}

// Busca os dados ao montar, sempre que `fetcher` mudar (filtro, serviço ou período) e
// depois de cada rodada de coleta do backend. Durante a recarga os dados atuais continuam
// na tela, sem recarregar a página. `fetcher` deve vir de um useCallback.
export function useApiQuery<T>(fetcher: () => Promise<T>) {
    const [state, setState] = useState<QueryState<T>>({ data: null, error: null });
    const { refreshKey } = useMonitoring();

    useEffect(() => {
        let cancelled = false;

        fetcher()
            .then((data) => {
                if (!cancelled) setState({ data, error: null });
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setState((previous) => ({
                        data: previous.data,
                        error: err instanceof Error ? err.message : 'Erro ao comunicar com a API.',
                    }));
                }
            });

        return () => {
            cancelled = true;
        };
    }, [fetcher, refreshKey]);

    return {
        data: state.data,
        error: state.error,
        isLoading: state.data === null && state.error === null,
    };
}
