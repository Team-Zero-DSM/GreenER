import type { PainelTableData } from '@/types/painel';

interface TableWidgetProps {
    data: PainelTableData;
}

export function TableWidget({ data }: TableWidgetProps) {
    return (
        <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead className="sticky top-0 z-10 bg-card text-[10px] font-medium uppercase tracking-[0.07em] text-muted-foreground">
                    <tr className="border-b border-border/80">
                        {data.columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={`px-3 py-2 first:pl-1 last:pr-1 ${
                                    column.align === 'right' ? 'text-right' : 'text-left'
                                }`}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((row) => (
                        <tr key={row.id} className="group border-b border-border/60 last:border-b-0">
                            {data.columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={`px-3 py-2.5 align-middle transition-colors group-hover:bg-secondary/25 first:pl-1 last:pr-1 ${
                                        column.align === 'right' ? 'text-right tabular-nums' : ''
                                    } ${
                                        column.key === 'motivo'
                                            ? 'max-w-0 whitespace-normal break-words leading-relaxed text-muted-foreground'
                                            : 'whitespace-nowrap'
                                    }`}
                                >
                                    <TableCellValue
                                        value={row.cells[column.key] ?? '—'}
                                        columnKey={column.key}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TableCellValue({ value, columnKey }: { value: string; columnKey: string }) {
    if (columnKey === 'posicao') {
        return <span className="font-medium tabular-nums text-muted-foreground">{value}</span>;
    }

    if (columnKey === 'regiao') {
        return <span className="text-muted-foreground">{value}</span>;
    }

    if (columnKey === 'co2e') {
        return <span className="font-medium text-foreground">{value}</span>;
    }

    if (columnKey === 'resultado') {
        const normalized = value.toLocaleLowerCase('pt-BR');
        const successful = normalized.includes('sucesso') || normalized.includes('conclu');
        const failed = normalized.includes('falha') || normalized.includes('erro');
        return (
            <span className="inline-flex items-center gap-1.5 text-foreground">
                {(successful || failed) && (
                    <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full ${successful ? 'bg-emerald-400/75' : 'bg-destructive/75'}`}
                    />
                )}
                {value}
            </span>
        );
    }

    if (columnKey === 'servico') {
        return <span className="font-medium text-foreground">{value}</span>;
    }

    if (columnKey === 'quando') {
        return <span className="text-muted-foreground">{value}</span>;
    }

    return value;
}
