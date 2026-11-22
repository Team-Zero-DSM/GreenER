import { ChevronDown } from 'lucide-react';

export interface DropdownSelectOption {
    value: string;
    label: string;
}

interface DropdownSelectProps {
    value: string;
    options: readonly DropdownSelectOption[];
    onChange: (value: string) => void;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
}

export function DropdownSelect({
    value,
    options,
    onChange,
    disabled = false,
    ariaLabel,
    className,
}: DropdownSelectProps) {
    return (
        <span className="relative block w-full">
            <select
                value={value}
                disabled={disabled}
                aria-label={ariaLabel}
                onChange={(event) => onChange(event.target.value)}
                className={`min-h-12 w-full appearance-none rounded-xl border border-border/60 bg-card/55 py-2 pr-10 pl-3 text-sm text-foreground outline-none transition hover:border-primary/30 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ''}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-popover">
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
        </span>
    );
}
