export interface SegmentedControlOption<T extends string> {
    value: T;
    label: string;
}

interface SegmentedControlProps<T extends string> {
    label: string;
    value: T;
    options: readonly SegmentedControlOption<T>[];
    onChange: (value: T) => void;
    className?: string;
    buttonClassName?: string;
}

export function SegmentedControl<T extends string>({
    label,
    value,
    options,
    onChange,
    className,
    buttonClassName,
}: SegmentedControlProps<T>) {
    return (
        <div
            role="group"
            aria-label={label}
            className={`flex w-full max-w-full flex-nowrap items-center justify-center gap-1 rounded-2xl border border-border/60 bg-card/55 p-1.5 shadow-sm backdrop-blur-md sm:inline-flex sm:w-auto sm:justify-start ${className ?? ''}`}
        >
            {options.map((option) => {
                const selected = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onChange(option.value)}
                        className={`min-h-9 min-w-0 flex-1 rounded-xl px-2 py-1.5 text-center text-sm font-medium tracking-tight whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:min-w-fit sm:flex-none sm:px-3.5 ${buttonClassName ?? ''} ${
                            selected
                                ? 'bg-linear-to-b from-primary/20 to-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
