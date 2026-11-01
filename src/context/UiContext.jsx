import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const UiContext = createContext(null);
const KEY = 'pramaan.font';
const SIZE = {
    sm: '15px',
    md: '16px',
    lg: '18px',
};
export function UiProvider({ children }) {
    const [scale, setScaleState] = useState(() => {
        const saved = sessionStorage.getItem(KEY);
        if (saved === 'sm' || saved === 'lg')
            return saved;
        return 'md';
    });
    useEffect(() => {
        document.documentElement.style.fontSize = SIZE[scale];
        sessionStorage.setItem(KEY, scale);
    }, [scale]);
    const value = useMemo(() => ({ scale, setScale: setScaleState }), [scale]);
    return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}
export function useUi() {
    const value = useContext(UiContext);
    if (!value)
        throw new Error('useUi must be used within UiProvider');
    return value;
}
