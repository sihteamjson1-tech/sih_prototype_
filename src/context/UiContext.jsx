import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
const UiContext = createContext(null);
const KEY = 'pramaan.font';
const THEME_KEY = 'pramaan.theme';
const SIZE = {
    sm: '15px',
    md: '16px',
    lg: '18px',
};
function readTheme() {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'dark' || saved === 'light')
            return saved;
    }
    catch {
        /* Storage can be unavailable in a private browser session. */
    }
    return 'light';
}
export function UiProvider({ children }) {
    const [scale, setScaleState] = useState(() => {
        const saved = sessionStorage.getItem(KEY);
        if (saved === 'sm' || saved === 'lg')
            return saved;
        return 'md';
    });
    const [theme, setThemeState] = useState(readTheme);
    useEffect(() => {
        document.documentElement.style.fontSize = SIZE[scale];
        sessionStorage.setItem(KEY, scale);
    }, [scale]);
    useLayoutEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.style.colorScheme = theme;
        try {
            localStorage.setItem(THEME_KEY, theme);
        }
        catch {
            /* Ignore storage failures and keep the choice for this view. */
        }
    }, [theme]);
    const value = useMemo(() => ({ scale, setScale: setScaleState, theme, setTheme: setThemeState }), [scale, theme]);
    return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}
export function useUi() {
    const value = useContext(UiContext);
    if (!value)
        throw new Error('useUi must be used within UiProvider');
    return value;
}
