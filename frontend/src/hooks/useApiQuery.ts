import { useEffect, useState } from 'react';

// Mesmo intervalo da coleta do backend (COLLECTION_INTERVAL_SECONDS=30).
export const REFRESH_SECONDS = 30;

interface QueryState<T> {
    data: T | null;
    error: string | null;
}

// Busca os dados ao montar, sempre que `fetcher` mudar e a cada REFRESH_SECONDS.
// `fetcher` deve vir de um useCallback para não refazer a busca a cada render.
export function useApiQuery<T>(fetcher: () => Promise<T>) {
    const [state, setState] = useState<QueryState<T>>({ data: null, error: null });

    useEffect(() => {
        let cancelled = false;

        const load = () => {
            fetcher()
                .then((data) => {
                    if (!cancelled) setState({ data, error: null });
                })
                .catch((err: unknown) => {
                    if (!cancelled) {
                        setState((previous) => ({
                            data: previous.data,
                            error:
                                err instanceof Error ? err.message : 'Erro ao comunicar com a API.',
                        }));
                    }
                });
        };

        load();
        const timer = setInterval(load, REFRESH_SECONDS * 1000);

        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [fetcher]);

    return {
        data: state.data,
        error: state.error,
        isLoading: state.data === null && state.error === null,
    };
}
