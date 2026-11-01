import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export function usePageTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} | Pramaan` : 'Pramaan | Application Validation Prototype';
    }, [title]);
}
export function ScrollToTop() {
    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
            const target = document.getElementById(location.hash.slice(1));
            if (target) {
                target.scrollIntoView();
                return;
            }
        }
        window.scrollTo(0, 0);
    }, [location.pathname, location.hash]);
    return null;
}
