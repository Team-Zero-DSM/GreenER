import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import {
    DROPDOWN_SURFACE_CLASS_NAME,
    getDropdownOptionClassName,
    getDropdownTriggerClassName,
} from '@/components/shared/dropdownStyles';
import { statusInfo } from '@/lib/serviceStatus';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { ServiceStatus } from '@/types/service';
import type { ServiceFilterValues, ServiceSort } from './filterServices';

interface ServiceFiltersProps {
    filters: ServiceFilterValues;
    countries: string[];
    onChange: (filters: ServiceFilterValues) => void;
}

interface FilterSelectProps {
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}

const fieldClass = 'flex flex-col gap-1 text-sm font-medium';
const visibleStatuses = ['Disponível', 'Sem métricas', 'Indisponível'];

function FilterSelect({ value, options, onChange }: FilterSelectProps) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useClickOutside(open, buttonRef, pickerRef, setOpen);

    const selected = options.find((option) => option.value === value);

    return (
        <div className={`relative ${open ? 'z-50' : 'z-0'}`}>
            <button
                ref={buttonRef}
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className={getDropdownTriggerClassName(open)}
            >
                <span className="truncate">{selected?.label ?? value}</span>
                <ChevronDown
                    aria-hidden="true"
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div
                    ref={pickerRef}
                    className={`absolute left-0 top-full z-[60] mt-2 max-h-60 w-full overflow-y-auto ${DROPDOWN_SURFACE_CLASS_NAME}`}
                >
                    <div className="flex flex-col gap-1">
                        {options.map((option) => {
                            const selected = option.value === value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className={getDropdownOptionClassName(selected)}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export function ServiceFilters({ filters, countries, onChange }: ServiceFiltersProps) {
    return (

            <CardContent className="relative grid gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-4">
                <label className={fieldClass}>
                    Buscar serviço
                    <input
                        type="search"
                        placeholder="Nome ou ID"
                        value={filters.search}
                        onChange={(event) => onChange({ ...filters, search: event.target.value })}
                        className="min-h-12 w-full rounded-xl border border-border/60 bg-transparent px-3 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/30 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10"
                    />
                </label>

                <label className={fieldClass}>
                    Estado
                    <FilterSelect
                        value={filters.status}
                        options={[
                            { value: 'all', label: 'Todos' },
                            ...Object.entries(statusInfo)
                                .filter(([, info]) => visibleStatuses.includes(info.label))
                                .map(([value, info]) => ({
                                    value,
                                    label: info.label,
                                })),
                        ]}
                        onChange={(value) =>
                            onChange({
                                ...filters,
                                status: value as ServiceStatus | 'all',
                            })
                        }
                    />
                </label>

                <label className={fieldClass}>
                    País
                    <FilterSelect
                        value={filters.country}
                        options={[
                            { value: 'all', label: 'Todos' },
                            ...countries.map((country) => ({
                                value: country,
                                label: country,
                            })),
                        ]}
                        onChange={(value) => onChange({ ...filters, country: value })}
                    />
                </label>

                <label className={fieldClass}>
                    Ordenar por
                    <FilterSelect
                        value={filters.sort}
                        options={[
                            { value: 'co2e', label: 'Maior emissão' },
                            { value: 'energy', label: 'Maior consumo' },
                            { value: 'name', label: 'Nome' },
                        ]}
                        onChange={(value) =>
                            onChange({
                                ...filters,
                                sort: value as ServiceSort,
                            })
                        }
                    />
                </label>
            </CardContent>
    );
}
