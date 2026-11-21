import { downloadBlob } from '@/lib/reports/download';
import type { ReportData } from '@/types/report';
import { STATUS_META } from '@/utils/reportStatusMeta';

const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;
const num = (v: number | null) =>
  v === null ? '' : v.toLocaleString('pt-BR', { maximumSignificantDigits: 6, useGrouping: false });

export function exportReportCsv(report: ReportData) {
  const header = ['Região', 'Serviço', 'Status', 'Energia (kWh)', 'CO2e (g)', 'Atualizado em'];
  const rows = report.sections.flatMap((section) =>
    section.services.map((s) => [
      section.region.name,
      s.name,
      STATUS_META[s.status].label,
      num(s.energyKwh),
      num(s.co2eGrams),
      new Date(s.updatedAt).toLocaleDateString('pt-BR'),
    ]),
  );
  const csv = [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
  const stamp = report.generatedAt.slice(0, 10);
  downloadBlob(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }), `relatorio-${stamp}.csv`);
}