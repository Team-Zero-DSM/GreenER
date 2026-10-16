
export function formatIntensity(value: number | null): string {
  if (value == null) return '—';
  return `${value.toLocaleString('pt-BR')} gCO₂e/kWh`;
}

export function formatEnergy(value: number | null): string {
  if (value == null) return '—';
  return `${value.toLocaleString('pt-BR')} kWh`;
}

export function formatCo2e(value: number | null): string {
  if (value == null) return '—';
  return `${value.toLocaleString('pt-BR')} gCO₂e`;
}
