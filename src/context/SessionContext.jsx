import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_PASSWORD } from '../services/demoData.js';
const SessionContext = createContext(null);
const KEY = 'pramaan.session';
export const DEMO_ACCOUNTS = {
    applicant: {
        name: 'Registrar, Demonstration Institute',
        email: 'registrar@institution.demo',
        role: 'applicant',
        organisation: 'Demonstration Technical Institute',
    },
    officer: {
        name: 'Reviewing Officer (Demo)',
        email: 'officer@pramaan.demo',
        role: 'officer',
        organisation: 'Pramaan demonstration desk',
    },
    compliance: {
        name: 'Compliance Officer (Demo)',
        email: 'compliance@pramaan.demo',
        role: 'compliance',
        organisation: 'Pramaan demonstration desk',
    },
    admin: {
        name: 'Portal Administrator (Demo)',
        email: 'admin@pramaan.demo',
        role: 'admin',
        organisation: 'Pramaan demonstration desk',
    },
};
export const ROLE_PATH = {
    applicant: '/dashboard/applicant',
    officer: '/dashboard/officer',
    compliance: '/dashboard/compliance',
    admin: '/dashboard/admin',
};
export function SessionProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = sessionStorage.getItem(KEY);
        if (!raw)
            return null;
        const role = raw;
        return DEMO_ACCOUNTS[role] ?? null;
    });
    useEffect(() => {
        if (user)
            sessionStorage.setItem(KEY, user.role);
        else
            sessionStorage.removeItem(KEY);
    }, [user]);
    const value = useMemo(() => ({
        user,
        login: (role, password) => {
            if (password.trim() !== DEMO_PASSWORD) {
                return 'The demonstration password was not accepted.';
            }
            setUser(DEMO_ACCOUNTS[role]);
            return null;
        },
        logout: () => setUser(null),
    }), [user]);
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
export function useSession() {
    const value = useContext(SessionContext);
    if (!value)
        throw new Error('useSession must be used within SessionProvider');
    return value;
}
