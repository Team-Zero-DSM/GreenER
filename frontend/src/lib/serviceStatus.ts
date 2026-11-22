import type { ServiceStatus } from '@/types/service';

// O ícone repete a informação da cor, para o estado não depender só dela.
export const statusInfo: Record<
    ServiceStatus,
    { label: string; icon: string; description: string }
> = {
    available: {
        label: 'Disponível',
        icon: '●',
        description: 'A última coleta do serviço foi bem-sucedida.',
    },
    metrics_missing: {
        label: 'Sem métricas',
        icon: '◐',
        description: 'O serviço foi encontrado, mas não trouxe métricas válidas.',
    },
    unavailable: {
        label: 'Indisponível',
        icon: '✕',
        description: 'Não foi possível coletar as métricas do serviço.',
    },
    removed: {
        label: 'Removido',
        icon: '−',
        description: 'Serviço não aparece mais na descoberta.',
    },
    unknown: {
        label: 'Desconhecido',
        icon: '?',
        description: 'Estado recebido não é reconhecido pela interface.',
    },
};
