import { Check, ChevronDown } from 'lucide-react';
import { Select } from 'radix-ui';

import {
    DROPDOWN_SURFACE_CLASS_NAME,
    getDropdownOptionClassName,
} from '@/components/shared/dropdownStyles';

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
        <Select.Root value={value} disabled={disabled} onValueChange={onChange}>
            <Select.Trigger
                aria-label={ariaLabel}
                className={`group relative flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border border-border/60 bg-card/55 px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/15 data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5 data-[state=open]:ring-2 data-[state=open]:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ''}`}
            >
                <Select.Value className="truncate" />
                <Select.Icon>
                    <ChevronDown
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
                    />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    position="popper"
                    align="start"
                    sideOffset={6}
                    className={`z-[100] max-h-60 w-[var(--radix-select-trigger-width)] overflow-hidden text-foreground ${DROPDOWN_SURFACE_CLASS_NAME}`}
                >
                    <Select.Viewport className="max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <Select.Item
                                key={option.value}
                                value={option.value}
                                className={`${getDropdownOptionClassName(false)} data-[state=checked]:bg-primary/10 data-[state=checked]:font-medium data-[state=checked]:text-primary data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary`}
                            >
                                <Select.ItemText>{option.label}</Select.ItemText>
                                <Select.ItemIndicator className="ml-auto inline-flex items-center">
                                    <Check aria-hidden="true" className="size-4" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}
