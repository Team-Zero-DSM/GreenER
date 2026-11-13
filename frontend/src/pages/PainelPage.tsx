import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';

export function PainelPage() {
    return (
        <PageShell>
            <PageHeader
                title="Painel de monitoramento"
                description="Indicadores de operação e impacto ambiental reunidos em um painel personalizável."
            />
        </PageShell>
    );
}
