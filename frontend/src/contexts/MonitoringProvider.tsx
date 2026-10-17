import type { ReactNode } from 'react';
import { MonitoringContext } from '@/contexts/monitoring';
import { useMonitoringStatus } from '@/hooks/useMonitoringStatus';

// Uma única consulta a /monitoring/status para a aplicação inteira.
export function MonitoringProvider({ children }: { children: ReactNode }) {
    const monitoring = useMonitoringStatus();

    return <MonitoringContext.Provider value={monitoring}>{children}</MonitoringContext.Provider>;
}
