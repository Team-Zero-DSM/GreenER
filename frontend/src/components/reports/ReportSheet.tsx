import { useId } from 'react';
import { ReportHistorySection, type HistoryView } from '@/components/reports/ReportHistorySection';
import { fmtCo2, fmtEnergy } from '@/lib/reports/format';
import type { RegionSection, ReportChartOptions, ReportData, ReportRegion } from '@/types/report';
import type { ServiceStatus } from '@/types/service';
import { STATUS_META, STATUS_ORDER } from '@/utils/reportStatusMeta';

const dateFmt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });
const dateTimeFmt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const day = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00`));

function describePeriod(from: string, to: string) {
    if (from && to) return `${day(from)} a ${day(to)}`;
    if (from) return `desde ${day(from)}`;
    if (to) return `até ${day(to)}`;
    return 'Todo o período';
}

// A folha é clara de propósito (é o que vai para o PDF), então não usa as cores do tema escuro.
const PRINT_CSS = `
@page { size: A4; margin: 14mm; }
@media print {
  body * { visibility: hidden; }
  #report-sheet, #report-sheet * { visibility: visible; }
  #report-sheet { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}`;

const th = 'border-b border-[#d6dcd8] py-2 pr-3 text-left font-semibold text-[#5b6b6e]';
const td = 'border-b border-[#d6dcd8] py-2 pr-3 align-top';
const num = 'whitespace-nowrap pr-0 text-right tabular-nums';

function StatusMark({ status }: { status: ServiceStatus }) {
    return (
        <span
            aria-hidden="true"
            className="inline-block w-[1.1em] shrink-0 text-center font-bold leading-none"
            style={{ color: STATUS_META[status].color }}
        >
            {STATUS_META[status].icon}
        </span>
    );
}

function SectionTable({ section }: { section: RegionSection }) {
    const titleId = useId();
    return (
        <section className="mt-8 break-inside-avoid">
            <h3 id={titleId} className="mb-2 flex items-baseline justify-between gap-3 font-serif text-lg font-bold">
                {section.region.name}
                <span className="font-sans text-sm font-normal text-[#5b6b6e]">
                    {section.total} {plural(section.total, 'serviço', 'serviços')}
                    {section.energyKwh !== null && `, ${fmtEnergy(section.energyKwh)}`}
                </span>
            </h3>
            <div className="overflow-x-auto">
                <table aria-labelledby={titleId} className="w-full min-w-[480px] border-collapse text-sm">
                    <thead>
                        <tr>
                            <th scope="col" className={th}>
                                Serviço
                            </th>
                            <th scope="col" className={th}>
                                Status
                            </th>
                            <th scope="col" className={`${th} ${num}`}>
                                Energia
                            </th>
                            <th scope="col" className={`${th} ${num}`}>
                                CO₂e
                            </th>
                            <th scope="col" className={`${th} ${num}`}>
                                Atualizado em
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {section.services.map((s) => (
                            <tr key={s.id}>
                                <td className={td}>{s.name}</td>
                                <td className={td}>
                                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                        <StatusMark status={s.status} />
                                        {STATUS_META[s.status].label}
                                    </span>
                                </td>
                                <td className={`${td} ${num}`}>{fmtEnergy(s.energyKwh)}</td>
                                <td className={`${td} ${num}`}>{fmtCo2(s.co2eGrams)}</td>
                                <td className={`${td} ${num}`}>{dateFmt.format(new Date(s.updatedAt))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

interface Props {
    data: ReportData;
    regions: ReportRegion[];
    loading: boolean;
    chart: ReportChartOptions;
    history: HistoryView;
}

export function ReportSheet({ data, regions, loading, chart, history }: Props) {
    const { filters } = data;
    const regionNames = filters.regionCodes.length
        ? filters.regionCodes.map((code) => regions.find((r) => r.code === code)?.name ?? code).join(', ')
        : 'Todas as regiões';
    const statusNames = filters.statuses.length
        ? filters.statuses.map((s) => STATUS_META[s].label).join(', ')
        : 'Todos';
    const present = STATUS_ORDER.filter((s) => data.byStatus[s] > 0);
    const barLabel = present.map((s) => `${data.byStatus[s]} ${STATUS_META[s].label.toLowerCase()}`).join(', ');
    const hasMissingMetrics = data.sections.some((sec) => sec.services.some((s) => s.energyKwh === null));

    return (
        <>
            <style>{PRINT_CSS}</style>
            <article
                id="report-sheet"
                aria-busy={loading}
                className={`mx-auto w-full max-w-4xl rounded-sm bg-[#fafbf8] p-6 text-[#17262a] shadow-2xl shadow-black/40 transition-opacity sm:p-10 print:absolute print:left-0 print:top-0 print:max-w-none print:p-0 print:opacity-100 print:shadow-none ${
                    loading ? 'opacity-60' : ''
                }`}
            >
                <header>
                    <h2 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
                        Relatório de serviços por região
                    </h2>
                    <p className="mt-1.5 text-sm text-[#5b6b6e]">Gerado em {dateTimeFmt.format(new Date(data.generatedAt))}</p>
                </header>

                <dl className="my-6 grid gap-1.5 border-y border-[#d6dcd8] py-3.5 text-sm">
                    <div className="flex gap-3">
                        <dt className="w-24 shrink-0 text-[#5b6b6e]">Regiões</dt>
                        <dd>{regionNames}</dd>
                    </div>
                    <div className="flex gap-3">
                        <dt className="w-24 shrink-0 text-[#5b6b6e]">Status</dt>
                        <dd>{statusNames}</dd>
                    </div>
                    <div className="flex gap-3">
                        <dt className="w-24 shrink-0 text-[#5b6b6e]">Atualização</dt>
                        <dd>{describePeriod(filters.from, filters.to)}</dd>
                    </div>
                </dl>

                <p className="mb-3 font-serif text-lg">
                    {data.total} {plural(data.total, 'serviço', 'serviços')} em {data.sections.length}{' '}
                    {plural(data.sections.length, 'região', 'regiões')}.
                    {data.energyKwh !== null &&
                        ` Somando a última coleta de cada serviço: ${fmtEnergy(data.energyKwh)} e ${fmtCo2(data.co2eGrams)} de CO₂e.`}
                </p>
                <div role="img" aria-label={barLabel} className="flex h-2.5 overflow-hidden rounded-full bg-[#d6dcd8]">
                    {present.map((s) => (
                        <span
                            key={s}
                            className="basis-0"
                            style={{ flexGrow: data.byStatus[s], background: STATUS_META[s].color }}
                        />
                    ))}
                </div>
                <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    {present.map((s) => (
                        <li key={s} className="inline-flex items-center gap-1.5">
                            <StatusMark status={s} />
                            <strong>{data.byStatus[s]}</strong> {STATUS_META[s].label.toLowerCase()}
                        </li>
                    ))}
                </ul>
                <p className="mt-3 text-sm text-[#5b6b6e]">
                    Energia e CO₂e das tabelas se referem à última coleta de cada serviço.
                    {hasMissingMetrics && ' Serviços sem métricas aparecem com “—” e não entram nos totais.'}
                </p>

                {chart.enabled && <ReportHistorySection options={chart} history={history} />}

                {data.sections.map((section) => (
                    <SectionTable key={section.region.code} section={section} />
                ))}
            </article>
        </>
    );
}