import type { HistoryRange } from '@/types/service';

export const HISTORY_RANGES: HistoryRange[] = ['1h', '6h', '24h', '7d', '30d'];

export const RANGE_LABEL: Record<HistoryRange, string> = {
  '1h': 'Última hora',
  '6h': 'Últimas 6 horas',
  '24h': 'Últimas 24 horas',
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
};

export const RANGE_MS: Record<HistoryRange, number> = {
  '1h': 3_600_000,
  '6h': 21_600_000,
  '24h': 86_400_000,
  '7d': 604_800_000,
  '30d': 2_592_000_000,
};