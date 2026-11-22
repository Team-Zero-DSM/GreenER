import { AnimatedContent } from '@/components/shared/AnimatedContent';
import { ReportHistoryChart } from '@/components/reports/ReportHistoryChart';
import { fmtCo2, fmtDate, fmtEnergy, fmtNum } from '@/lib/reports/format';
import { RANGE_LABEL } from '@/lib/reports/historyRanges';
import type { ReportChartOptions, ReportHistory } from '@/types/report';

export interface HistoryView {
    status: 'loading' | 'ready' | 'error';
    data: ReportHistory | null;
    error: string | null;
    onRetry: () => void;
}

interface Props {
    options: ReportChartOptions;
    history: HistoryView;
}

const ENERGY_COLOR = '#2e8b62';
const CO2_COLOR = '#3b6fa0';

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export function ReportHistorySection({ options, history }: Props) {
    const { status, data, error, onRetry } = history;
    const loading = status === 'loading';

    const period = data
        ? data.custom
            ? `${fmtDate(data.from)} a ${fmtDate(data.to)}`
            : RANGE_LABEL[data.range]
        : '';

    const animationKey = `${status}-${data ? 'with-data' : 'without-data'}`;

    return (
        <section className="mt-8 break-inside-avoid">
            <h3 className="font-serif text-lg font-bold">Histórico de energia e CO₂e</h3>

            <AnimatedContent
                animationKey={animationKey}
                className="mt-2 print:!h-auto print:!overflow-visible"
            >
                {status === 'error' ? (
                    <div role="alert" className="grid justify-items-start gap-2">
                        <p className="text-sm text-[#b5483d]">
                            {error ?? 'Não foi possível carregar o histórico.'}
                        </p>

                        <button
                            type="button"
                            onClick={onRetry}
                            className="rounded border border-[#17262a]/30 px-3 py-1 text-sm hover:bg-black/5 print:hidden"
                        >
                            Tentar de novo
                        </button>
                    </div>
                ) : !data ? (
                    <p className="text-sm text-[#5b6b6e]">Carregando histórico...</p>
                ) : (
                    <div className={`transition-opacity ${loading ? 'opacity-60' : ''}`}>
                        <p className="mb-3 mt-1 text-sm text-[#5b6b6e]">
                            {period}, somando {data.serviceCount}{' '}
                            {plural(data.serviceCount, 'serviço', 'serviços')}:{' '}
                            {fmtEnergy(data.totalEnergyKwh)} e {fmtCo2(data.totalCo2eGrams)} de
                            CO₂e.
                            {data.failedCount > 0 &&
                                ` ${data.failedCount} ${plural(data.failedCount, 'serviço ficou', 'serviços ficaram')} sem histórico.`}
                            {data.truncated &&
                                ' O histórico guarda só os últimos 30 dias, então o período foi limitado a isso.'}
                        </p>

                        <div className="grid gap-5">
                            <figure>
                                <figcaption className="mb-1 text-sm font-semibold">
                                    Energia por intervalo (kWh)
                                </figcaption>

                                <ReportHistoryChart
                                    points={data.points.map((p) => ({
                                        time: p.time,
                                        value: p.energyKwh,
                                    }))}
                                    from={data.from}
                                    to={data.to}
                                    type={options.type}
                                    color={ENERGY_COLOR}
                                    range={data.range}
                                    formatAxis={fmtNum}
                                    formatValue={fmtEnergy}
                                    ariaLabel={`Energia por intervalo, ${period.toLowerCase()}. Pico de ${fmtEnergy(
                                        Math.max(0, ...data.points.map((p) => p.energyKwh)),
                                    )}.`}
                                />
                            </figure>

                            <figure>
                                <figcaption className="mb-1 text-sm font-semibold">
                                    CO₂e por intervalo (g)
                                </figcaption>

                                <ReportHistoryChart
                                    points={data.points.map((p) => ({
                                        time: p.time,
                                        value: p.co2eGrams,
                                    }))}
                                    from={data.from}
                                    to={data.to}
                                    type={options.type}
                                    color={CO2_COLOR}
                                    range={data.range}
                                    formatAxis={fmtNum}
                                    formatValue={(v) => `${fmtNum(v)} g`}
                                    ariaLabel={`CO₂e por intervalo, ${period.toLowerCase()}. Pico de ${fmtNum(
                                        Math.max(0, ...data.points.map((p) => p.co2eGrams)),
                                    )} g.`}
                                />
                            </figure>
                        </div>
                    </div>
                )}
            </AnimatedContent>
        </section>
    );
}
