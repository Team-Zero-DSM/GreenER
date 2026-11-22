export const DROPDOWN_SURFACE_CLASS_NAME =
    'rounded-xl border border-border/60 bg-popover/90 p-1.5 shadow-xl shadow-black/25 backdrop-blur-xl';

export const DROPDOWN_OPTION_CLASS_NAME =
    'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40';

export function getDropdownCompactTriggerClassName(open: boolean): string {
    const base =
        'flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40';

    return open
        ? `${base} border-primary/40 bg-primary/10 text-primary`
        : `${base} border-border/60 bg-card/55 text-muted-foreground hover:border-primary/30 hover:text-foreground`;
}

export function getDropdownTriggerClassName(open: boolean): string {
    const base =
        'flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/15';

    return open
        ? `${base} border-primary/50 bg-primary/5 ring-2 ring-primary/10`
        : `${base} border-border/60 bg-card/55 text-foreground hover:border-primary/30`;
}

export function getDropdownOptionClassName(selected: boolean): string {
    return selected
        ? `${DROPDOWN_OPTION_CLASS_NAME} bg-primary/10 font-medium text-primary`
        : `${DROPDOWN_OPTION_CLASS_NAME} text-foreground/80 hover:bg-primary/[0.06] hover:text-foreground`;
}
