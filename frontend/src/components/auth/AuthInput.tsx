import { useState, type ReactNode } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { InfoTooltip } from '@/components/shared/InfoTooltip';

interface AuthInputProps {
    id: string;
    label: string;
    type: 'text' | 'email' | 'password';
    value: string;
    placeholder: string;
    autoComplete?: string;
    onChange: (value: string) => void;
    required?: boolean;
    labelAction?: ReactNode;
    infoTooltip?: string;
}

export function AuthInput({
    id,
    label,
    type,
    value,
    placeholder,
    autoComplete,
    onChange,
    required = true,
    labelAction,
    infoTooltip,
}: AuthInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';

    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-1.5">
                    <label htmlFor={id} className="text-sm font-medium text-foreground">
                        {label}
                    </label>

                    {infoTooltip && (
                        <InfoTooltip
                            content={infoTooltip}
                            ariaLabel={`Informações sobre ${label.toLowerCase()}`}
                        />
                    )}
                </div>

                {labelAction}
            </div>

            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={inputType}
                    value={value}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    onChange={(event) => onChange(event.target.value)}
                    required={required}
                    className="h-11 w-full rounded-lg border border-input bg-background/60 px-4 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400/15"
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((previous) => !previous)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}
