import { useSyncExternalStore } from 'react';

// Acompanha uma media query do CSS e re-renderiza quando ela passa a valer ou não.
export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        (onChange) => {
            const mediaQuery = window.matchMedia(query);

            mediaQuery.addEventListener('change', onChange);

            return () => mediaQuery.removeEventListener('change', onChange);
        },
        () => window.matchMedia(query).matches,
    );
}
