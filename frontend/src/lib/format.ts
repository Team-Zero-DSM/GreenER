const EMPTY = '—';

export function formatNumber(
  value: number | null | undefined,
  unit: string,
  maximumFractionDigits = 1,
): string {
  if (value === null || value === undefined) {
    return EMPTY;
  }

  return `${value.toLocaleString('pt-BR', { maximumFractionDigits })} ${unit}`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return EMPTY;
  }

  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}