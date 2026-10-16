import { useEffect, useState } from 'react';
import { USE_MOCKS } from '@/api/services';
import { REFRESH_SECONDS } from '@/hooks/useApiQuery';

export function MonitoringBar() {
    const [remaining, setRemaining] = useState(REFRESH_SECONDS);

    useEffect(() => {
        const timer = setInterval(
            () => setRemaining((value) => (value <= 1 ? REFRESH_SECONDS : value - 1)),
            1000,
        );

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
            <div className="mx-auto flex max-w-7xl flex-wrap gap-4">
                {USE_MOCKS ? (
                    <strong className="text-amber-300">SIMULADO · sem conexão à API</strong>
                ) : (
                    <strong className="text-emerald-300">Conectado à API</strong>
                )}

                <span>Próxima atualização da tela: em {remaining} s</span>

                <span>
                    {USE_MOCKS
                        ? 'Contador demonstrativo; não altera a coleta do backend.'
                        : `A tela busca a API a cada ${REFRESH_SECONDS} s, no ritmo da coleta do backend.`}
                </span>
            </div>
        </div>
    );
}
