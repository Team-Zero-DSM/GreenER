import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useId } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
    content: string;
    ariaLabel?: string;
}

export function InfoTooltip({ content, ariaLabel = 'Mais informações' }: InfoTooltipProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const closeTimer = useRef<number | null>(null);
    const tooltipId = useId();

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const updatePosition = useCallback(() => {
        const button = buttonRef.current;

        if (!button) return;

        const rect = button.getBoundingClientRect();
        const tooltipWidth = Math.min(220, window.innerWidth - 24);
        const center = rect.left + rect.width / 2;

        const left = Math.min(
            Math.max(center, 12 + tooltipWidth / 2),
            window.innerWidth - 12 - tooltipWidth / 2,
        );

        setPosition({
            top: rect.top - 8,
            left,
        });
    }, []);

    const openTooltip = useCallback(() => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }

        updatePosition();
        setIsOpen(true);
    }, [updatePosition]);

    const scheduleClose = useCallback(() => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
        }

        closeTimer.current = window.setTimeout(() => {
            setIsOpen(false);
            closeTimer.current = null;
        }, 120);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen, updatePosition]);

    useEffect(() => {
        return () => {
            if (closeTimer.current !== null) {
                window.clearTimeout(closeTimer.current);
            }
        };
    }, []);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                aria-label={ariaLabel}
                aria-describedby={isOpen ? tooltipId : undefined}
                onMouseEnter={openTooltip}
                onMouseLeave={scheduleClose}
                onFocus={openTooltip}
                onBlur={scheduleClose}
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Info className="size-4" aria-hidden="true" />
            </button>

            {isOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <span
                        id={tooltipId}
                        role="tooltip"
                        onMouseEnter={openTooltip}
                        onMouseLeave={scheduleClose}
                        className="pointer-events-auto fixed z-[9999] w-[13.75rem] max-w-[calc(100vw-1.5rem)] rounded-lg border border-border bg-popover px-3 py-2 text-left text-[11px] leading-snug text-popover-foreground shadow-xl"
                        style={{
                            top: position.top,
                            left: position.left,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        {content}
                    </span>,
                    document.body,
                )}
        </>
    );
}
