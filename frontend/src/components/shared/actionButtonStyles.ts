const ACTION_BUTTON_BASE_CLASS_NAME =
    'inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none';

export const PRIMARY_ACTION_BUTTON_CLASS_NAME = `${ACTION_BUTTON_BASE_CLASS_NAME} border-primary/20 bg-primary font-semibold text-primary-foreground shadow-sm shadow-primary/10 hover:-translate-y-px hover:bg-primary/90 hover:shadow-md hover:shadow-primary/15 focus-visible:ring-primary/45 disabled:border-border/50 disabled:bg-muted disabled:text-muted-foreground`;

export const SECONDARY_ACTION_BUTTON_CLASS_NAME = `${ACTION_BUTTON_BASE_CLASS_NAME} border-border/70 bg-card/45 text-foreground hover:-translate-y-px hover:border-primary/30 hover:bg-primary/[0.05] hover:shadow-sm focus-visible:ring-primary/40`;

export const ACCENT_ACTION_BUTTON_CLASS_NAME = `${ACTION_BUTTON_BASE_CLASS_NAME} border-primary/25 bg-primary/[0.06] text-primary hover:-translate-y-px hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm focus-visible:ring-primary/40`;

export const DANGER_ACTION_BUTTON_CLASS_NAME = `${ACTION_BUTTON_BASE_CLASS_NAME} border-destructive/25 bg-destructive/[0.04] text-destructive hover:-translate-y-px hover:border-destructive/40 hover:bg-destructive/10 hover:shadow-sm focus-visible:ring-destructive/40`;
