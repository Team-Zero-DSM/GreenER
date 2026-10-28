const rankingColumns = ['#', 'Serviço', 'Região', 'Energia', 'CO₂e', 'Coletas'];

export function RankingTable() {
    return (
        <section
            aria-label="Tabela de classificação"
            className="space-y-3 border-t border-border pt-6"
        >
            <h2 className="text-xl font-semibold">Classificação</h2>

            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-xl text-sm">
                    <thead className="border-b border-border text-muted-foreground">
                        <tr>
                            {rankingColumns.map((column) => (
                                <th
                                    key={column}
                                    scope="col"
                                    className="px-4 py-3 text-left font-medium"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td
                                colSpan={rankingColumns.length}
                                className="px-4 py-10 text-center text-muted-foreground"
                            >
                                Área das linhas da classificação
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}
