import { useEffect, useState } from 'react';

/** Widths below 768px use the mobile experience. */
export const LAYOUT_BREAKPOINT = 768;

export function useDeviceLayout() {
    const query = `(max-width: ${LAYOUT_BREAKPOINT - 1}px)`;
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
            return false;
        return window.matchMedia(query).matches;
    });
    useEffect(() => {
        const media = window.matchMedia(query);
        const apply = () => setIsMobile(media.matches);
        apply();
        media.addEventListener('change', apply);
        return () => media.removeEventListener('change', apply);
    }, [query]);
    return { isMobile, isDesktop: !isMobile };
}
