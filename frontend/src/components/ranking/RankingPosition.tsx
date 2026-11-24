interface RankingPositionProps {
    position: number | null;
}

export function RankingPosition({ position }: RankingPositionProps) {
    return (
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/60 text-[11px] font-medium tabular-nums text-muted-foreground">
            {position ?? '—'}
        </span>
    );
}
