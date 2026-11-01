import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { en, hi } from '../i18n/messages.js';
const LanguageContext = createContext(null);
const KEY = 'pramaan.lang';
export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(() => {
        const saved = sessionStorage.getItem(KEY);
        return saved === 'hi' ? 'hi' : 'en';
    });
    useEffect(() => {
        document.documentElement.lang = lang;
        sessionStorage.setItem(KEY, lang);
    }, [lang]);
    const value = useMemo(() => ({
        lang,
        messages: lang === 'hi' ? hi : en,
        setLang: setLangState,
    }), [lang]);
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
    const value = useContext(LanguageContext);
    if (!value)
        throw new Error('useLanguage must be used within LanguageProvider');
    return value;
}
