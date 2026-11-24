import { getJson, putJson } from '@/api/client';
import type { PainelConfig } from '@/types/painel';

interface DashboardResponse {
    // null quando o usuário ainda não salvou um painel.
    dashboard: PainelConfig | null;
}

// GET /dashboards/me: painel salvo do usuário autenticado (envia o JWT da sessão).
export async function fetchMyDashboard(): Promise<PainelConfig | null> {
    const data = await getJson<DashboardResponse>('/dashboards/me', { authenticated: true });

    return data.dashboard;
}

// PUT /dashboards/me: grava a configuração do painel do usuário autenticado.
export async function saveMyDashboard(config: PainelConfig): Promise<PainelConfig> {
    const data = await putJson<PainelConfig, { dashboard: PainelConfig }>(
        '/dashboards/me',
        config,
        {
            authenticated: true,
        },
    );

    return data.dashboard;
}
