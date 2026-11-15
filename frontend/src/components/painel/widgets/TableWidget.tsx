import type { PainelTableData } from '@/types/painel';

interface TableWidgetProps {
    data: PainelTableData;
}

export function TableWidget({ data }: TableWidgetProps) {
    return (
        // A rolagem fica dentro do widget: a tabela não estica o cartão além do
        // tamanho que o usuário definiu na grade.
        <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-card text-xs text-muted-foreground">
                    <tr>
                        {data.columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={`pr-3 pb-2 font-medium last:pr-0 ${
                                    column.align === 'right' ? 'text-right' : ''
                                }`}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((row) => (
                        <tr key={row.id} className="border-t border-border">
                            {data.columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={`py-2 pr-3 whitespace-nowrap last:pr-0 ${
                                        column.align === 'right'
                                            ? 'text-right font-semibold tabular-nums'
                                            : ''
                                    }`}
                                >
                                    {row.cells[column.key] ?? '—'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
