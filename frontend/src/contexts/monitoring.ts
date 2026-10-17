import { createContext, useContext } from 'react';
import type { MonitoringState } from '@/hooks/useMonitoringStatus';

export interface MonitoringContextValue extends MonitoringState {
    // Muda toda vez que o backend termina uma rodada de coleta; as páginas usam como
    // gatilho para buscar os dados de novo.
    refreshKey: number;
}

export const MonitoringContext = createContext<MonitoringContextValue | null>(null);

// Estado do monitoramento compartilhado entre a barra e as páginas.
export function useMonitoring() {
    const value = useContext(MonitoringContext);
    if (!value) throw new Error('useMonitoring precisa estar dentro de <MonitoringProvider>');
    return value;
}
