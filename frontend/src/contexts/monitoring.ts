import { createContext, useContext } from 'react';
import type { MonitoringState } from '@/hooks/useMonitoringStatus';

export type MonitoringContextValue = MonitoringState;

export const MonitoringContext = createContext<MonitoringContextValue | null>(null);

// Estado do monitoramento compartilhado entre a barra e as páginas.
export function useMonitoring() {
    const value = useContext(MonitoringContext);
    if (!value) throw new Error('useMonitoring precisa estar dentro de <MonitoringProvider>');
    return value;
}
