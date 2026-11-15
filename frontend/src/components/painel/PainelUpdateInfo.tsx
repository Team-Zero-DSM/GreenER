import { RefreshCw } from 'lucide-react';

import { useMonitoring } from '@/contexts/monitoring';
import { formatDateTimeSeconds } from '@/lib/format';

// Avisa que o painel se atualiza sozinho e mostra de quando são os dados na tela.
// A busca é refeita pelo useApiQuery sempre que o backend termina uma rodada de coleta.
export function PainelUpdateInfo() {
    const { status, screenUpdatedAt } = useMonitoring();

    const interval = status?.collectionIntervalSeconds;

    return (
        <p
            aria-live="polite"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground"
        >
            <RefreshCw aria-hidden="true" className="size-3.5 text-primary" />
            <span>
                Atualização automática a cada rodada de coleta
                {interval ? ` (${interval} s)` : ''}.
            </span>
            {screenUpdatedAt !== null && (
                <span>Dados de {formatDateTimeSeconds(screenUpdatedAt)}.</span>
            )}
        </p>
    );
}
