import type { ReactNode } from 'react';

import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';

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
    return (
        <div className="flex flex-col gap-1.5">
            {/* Ação adicional do campo, como recuperação de senha. */}
            {labelAction && (
                <div className="flex items-center justify-end gap-3">
                    {labelAction}
                </div>
            )}

            {/* Campo compartilhado com rótulo flutuante e tooltip integrado. */}
            <FloatingLabelInput
                id={id}
                label={label}
                type={type}
                value={value}
                placeholder={placeholder}
                autoComplete={autoComplete}
                onChange={onChange}
                required={required}
                labelAdornment={
                    infoTooltip ? (
                        <InfoTooltip
                            content={infoTooltip}
                            ariaLabel={`Informações sobre ${label.toLowerCase()}`}
                        />
                    ) : undefined
                }
            />
        </div>
    );
}