import {
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type InputHTMLAttributes,
    type ReactNode,
    type CSSProperties,
} from 'react';

import { Eye, EyeOff } from 'lucide-react';

export type FloatingLabelInputType = 'text' | 'email' | 'password' | 'number' | 'search';

interface FloatingLabelInputProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange' | 'className'
> {
    label: string;
    type?: FloatingLabelInputType;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    className?: string;
    inputClassName?: string;
    labelAdornment?: ReactNode;
    labelAlwaysFloating?: boolean;
}

const FIELD_HEIGHT = 48;
const BORDER_INSET = 0.75;
const BORDER_RADIUS = 12;
const LABEL_LEFT = 16;
const LABEL_SCALE = 0.78;
const STROKE_WIDTH = 1.5;

export function FloatingLabelInput({
    id,
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    onFocus,
    onBlur,
    className,
    inputClassName,
    labelAdornment,
    labelAlwaysFloating = false,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...inputProps
}: FloatingLabelInputProps) {
    const generatedId = useId().replace(/:/g, '');

    const inputId = id ?? `floating-input-${generatedId}`;
    const errorId = `${inputId}-error`;
    const maskId = `floating-mask-${generatedId}`;

    const fieldRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [fieldWidth, setFieldWidth] = useState(320);
    const [labelWidth, setLabelWidth] = useState(0);

    const isPassword = type === 'password';
    const isFloating = labelAlwaysFloating || isFocused || value.length > 0;

    const inputType = isPassword && showPassword ? 'text' : type;

    // Mede o campo e o rótulo completo, incluindo elementos adicionais.
    useLayoutEffect(() => {
        const field = fieldRef.current;
        const labelElement = labelRef.current;

        if (!field || !labelElement) return;

        const measure = () => {
            setFieldWidth(Math.max(field.clientWidth, 180));
            setLabelWidth(labelElement.offsetWidth);
        };

        measure();

        const resizeObserver = new ResizeObserver(measure);

        resizeObserver.observe(field);
        resizeObserver.observe(labelElement);

        const fonts = labelElement.ownerDocument.fonts;

        fonts?.addEventListener('loadingdone', measure);

        return () => {
            resizeObserver.disconnect();
            fonts?.removeEventListener('loadingdone', measure);
        };
    }, [label]);

    // Calcula o espaço que o rótulo e seu complemento ocupam na borda.
    const notchStart = Math.max(BORDER_RADIUS * 0.6, LABEL_LEFT - 5);

    const notchEnd = Math.max(
        notchStart + 8,
        Math.min(fieldWidth - 12, LABEL_LEFT + labelWidth * LABEL_SCALE + 8),
    );

    const notchCenter = (notchStart + notchEnd) / 2;

    const right = fieldWidth - BORDER_INSET;
    const bottom = FIELD_HEIGHT - BORDER_INSET;
    const arc = BORDER_RADIUS - BORDER_INSET;

    // Contorno único do campo, com espaço reservado para o rótulo.
    const borderPath = `
        M ${notchCenter} ${BORDER_INSET}
        L ${fieldWidth - BORDER_RADIUS} ${BORDER_INSET}
        A ${arc} ${arc} 0 0 1 ${right} ${BORDER_RADIUS}
        L ${right} ${FIELD_HEIGHT - BORDER_RADIUS}
        A ${arc} ${arc} 0 0 1 ${fieldWidth - BORDER_RADIUS} ${bottom}
        L ${BORDER_RADIUS} ${bottom}
        A ${arc} ${arc} 0 0 1 ${BORDER_INSET} ${FIELD_HEIGHT - BORDER_RADIUS}
        L ${BORDER_INSET} ${BORDER_RADIUS}
        A ${arc} ${arc} 0 0 1 ${BORDER_RADIUS} ${BORDER_INSET}
        L ${notchCenter} ${BORDER_INSET}
        Z
    `;

    const borderColor = error ? '#f87171' : isFocused ? '#34d399' : 'rgba(148, 163, 184, 0.35)';

    const describedBy =
        [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined;

    function handlePasswordVisibility() {
        setShowPassword((previous) => !previous);
    }

    return (
        <div className={`fli w-full ${className ?? ''}`} data-focused={isFocused}>
            <style>{`
                .fli-label {
                    transition:
                        transform 260ms cubic-bezier(.3,.7,.3,1),
                        color 200ms ease;
                }

                .fli-label-text span {
                    display: inline-block;
                    white-space: pre;
                }

                .fli[data-focused="true"] .fli-label-text span {
                    animation: fli-hop .34s cubic-bezier(.3,.7,.4,1) both;
                    animation-delay: calc(var(--letter-index) * 22ms);
                }

                @keyframes fli-hop {
                    0%, 100% {
                        transform: translateY(0);
                    }

                    40% {
                        transform: translateY(-3px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .fli-label {
                        transition: none;
                    }

                    .fli[data-focused="true"] .fli-label-text span {
                        animation: none;
                    }
                }
            `}</style>

            {/* Espaço superior reservado para o rótulo flutuante. */}
            <div className="pt-3">
                <div ref={fieldRef} className="relative h-12 w-full">
                    {/* Borda SVG com recorte animado. */}
                    <svg
                        className="pointer-events-none absolute inset-0 overflow-visible"
                        width={fieldWidth}
                        height={FIELD_HEIGHT}
                        viewBox={`0 0 ${fieldWidth} ${FIELD_HEIGHT}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <mask
                            id={maskId}
                            maskUnits="userSpaceOnUse"
                            x={0}
                            y={0}
                            width={fieldWidth}
                            height={FIELD_HEIGHT}
                        >
                            <rect
                                x={0}
                                y={0}
                                width={fieldWidth}
                                height={FIELD_HEIGHT}
                                fill="white"
                            />

                            <rect
                                x={notchStart}
                                y={-2}
                                width={notchEnd - notchStart}
                                height={BORDER_INSET + STROKE_WIDTH + 3}
                                fill="black"
                                style={{
                                    transform: isFloating ? 'scaleX(1)' : 'scaleX(0)',
                                    transformOrigin: `${notchCenter}px 0`,
                                    transformBox: 'view-box',
                                    transition: 'transform 260ms cubic-bezier(.3,.7,.3,1)',
                                }}
                            />
                        </mask>

                        <path
                            d={borderPath}
                            fill="none"
                            stroke={borderColor}
                            strokeWidth={STROKE_WIDTH}
                            strokeLinecap="round"
                            mask={`url(#${maskId})`}
                            style={{
                                transition: 'stroke 200ms ease',
                            }}
                        />
                    </svg>

                    {/* Rótulo e elemento adicional que acompanham a animação. */}
                    <div
                        ref={labelRef}
                        className="fli-label absolute top-0 z-20 flex h-12 items-center gap-1 whitespace-nowrap text-sm font-medium"
                        style={{
                            left: LABEL_LEFT,
                            transform: isFloating
                                ? `translateY(-50%) scale(${LABEL_SCALE})`
                                : 'none',
                            transformOrigin: '0 50%',
                            color: error
                                ? '#f87171'
                                : isFocused
                                  ? 'var(--color-foreground)'
                                  : 'var(--color-muted-foreground)',
                            pointerEvents: 'none',
                        }}
                    >
                        <label
                            htmlFor={inputId}
                            className="fli-label-text inline-flex items-center whitespace-nowrap"
                        >
                            {Array.from(label).map((character, index) => (
                                <span
                                    key={index}
                                    style={
                                        {
                                            '--letter-index': index,
                                        } as CSSProperties
                                    }
                                >
                                    {character === ' ' ? '\u00A0' : character}
                                </span>
                            ))}
                        </label>

                        {labelAdornment && (
                            <span
                                className="inline-flex shrink-0 items-center"
                                style={{
                                    pointerEvents: 'auto',
                                }}
                            >
                                {labelAdornment}
                            </span>
                        )}
                    </div>

                    {/* Entrada de dados controlada pelo formulário. */}
                    <input
                        {...inputProps}
                        id={inputId}
                        name={inputProps.name ?? inputId}
                        type={inputType}
                        value={value}
                        placeholder={isFloating ? placeholder : ''}
                        onChange={(event) => onChange(event.target.value)}
                        onFocus={(event) => {
                            setIsFocused(true);
                            onFocus?.(event);
                        }}
                        onBlur={(event) => {
                            setIsFocused(false);
                            onBlur?.(event);
                        }}
                        aria-invalid={error ? true : ariaInvalid}
                        aria-describedby={describedBy}
                        className={`
                            absolute inset-0 z-10 h-full w-full
                            bg-transparent pl-4
                            ${isPassword ? 'pr-12' : 'pr-4'}
                            text-sm text-foreground
                            outline-none
                            placeholder:text-muted-foreground
                            placeholder:transition-opacity
                            ${inputClassName ?? ''}
                        `}
                    />

                    {/* Controle de visibilidade da senha. */}
                    {isPassword && (
                        <button
                            type="button"
                            onPointerDown={(event) => event.preventDefault()}
                            onClick={handlePasswordVisibility}
                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            aria-pressed={showPassword}
                            className="
                                absolute inset-y-0 right-1 z-20
                                flex w-10 items-center justify-center
                                rounded-lg text-muted-foreground
                                transition-colors hover:text-foreground
                                focus-visible:outline-none
                                focus-visible:ring-2 focus-visible:ring-emerald-400/50
                            "
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Mensagem opcional de validação. */}
            {error && (
                <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
