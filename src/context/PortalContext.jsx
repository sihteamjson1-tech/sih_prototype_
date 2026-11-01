import { createContext, useContext, useEffect, useMemo, useReducer, useRef, } from 'react';
import { useSession } from './SessionContext.jsx';
import { defaultCategories, defaultRules, seedApplications, seedAudit, seedClarifications, seedUsers, } from '../services/demoData.js';
import { createId } from '../utils/format.js';
const PortalContext = createContext(null);
const STORAGE_KEY = 'pramaan.portal.v1';
function seedState() {
    const rules = defaultRules();
    return {
        applications: seedApplications(rules),
        rules,
        clarifications: seedClarifications,
        audit: seedAudit,
        users: seedUsers(),
        categories: defaultCategories(),
        inbox: [],
    };
}
function loadState() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw)
            return seedState();
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed.applications) || !Array.isArray(parsed.rules))
            return seedState();
        return parsed;
    }
    catch {
        return seedState();
    }
}
function reducer(state, action) {
    switch (action.type) {
        case 'replace':
            return action.state;
        case 'upsert': {
            const exists = state.applications.some((item) => item.id === action.application.id);
            const applications = exists
                ? state.applications.map((item) => (item.id === action.application.id ? action.application : item))
                : [action.application, ...state.applications];
            return { ...state, applications };
        }
        case 'patch':
            return {
                ...state,
                applications: state.applications.map((item) => item.id === action.id ? { ...item, ...action.patch, updatedAt: new Date().toISOString() } : item),
            };
        case 'add-document':
            return {
                ...state,
                applications: state.applications.map((item) => item.id === action.applicationId
                    ? { ...item, documents: [...item.documents, action.document], updatedAt: new Date().toISOString() }
                    : item),
            };
        case 'patch-document':
            return {
                ...state,
                applications: state.applications.map((item) => item.id === action.applicationId
                    ? {
                        ...item,
                        updatedAt: new Date().toISOString(),
                        documents: item.documents.map((document) => document.id === action.documentId ? { ...document, ...action.patch } : document),
                    }
                    : item),
            };
        case 'remove-document':
            return {
                ...state,
                applications: state.applications.map((item) => item.id === action.applicationId
                    ? {
                        ...item,
                        updatedAt: new Date().toISOString(),
                        documents: item.documents.filter((document) => document.id !== action.documentId),
                    }
                    : item),
            };
        case 'set-checks':
            return {
                ...state,
                applications: state.applications.map((item) => item.id === action.applicationId
                    ? {
                        ...item,
                        checks: action.checks,
                        origin: action.origin,
                        lifecycle: item.lifecycle === 'draft' ? 'validated' : item.lifecycle,
                        updatedAt: new Date().toISOString(),
                    }
                    : item),
            };
        case 'decide':
            return {
                ...state,
                applications: state.applications.map((item) => item.id === action.applicationId
                    ? {
                        ...item,
                        updatedAt: new Date().toISOString(),
                        checks: item.checks.map((check) => check.id === action.checkId ? { ...check, reviewerDecision: action.decision } : check),
                    }
                    : item),
            };
        case 'submit':
            return {
                ...state,
                applications: state.applications.map((item) => item.id === action.applicationId
                    ? { ...item, lifecycle: 'under-review', submittedAt: action.at, updatedAt: action.at }
                    : item),
            };
        case 'notes':
            return {
                ...state,
                applications: state.applications.map((item) => item.id === action.applicationId
                    ? { ...item, officerNotes: action.notes, updatedAt: new Date().toISOString() }
                    : item),
            };
        case 'priority':
            return {
                ...state,
                applications: state.applications.map((item) => item.id === action.applicationId ? { ...item, priority: action.priority, updatedAt: new Date().toISOString() } : item),
            };
        case 'clarification':
            return {
                ...state,
                clarifications: [...state.clarifications, action.item],
                applications: state.applications.map((item) => item.id === action.item.applicationId
                    ? { ...item, lifecycle: action.lifecycle, updatedAt: action.item.createdAt }
                    : item),
            };
        case 'toggle-rule':
            return {
                ...state,
                rules: state.rules.map((rule) => (rule.id === action.id ? { ...rule, enabled: !rule.enabled } : rule)),
            };
        case 'set-ratio':
            return {
                ...state,
                rules: state.rules.map((rule) => rule.id === action.id ? { ...rule, ratioDivisor: action.ratioDivisor } : rule),
            };
        case 'set-rules':
            return { ...state, rules: action.rules };
        case 'add-user':
            return { ...state, users: [...state.users, action.user] };
        case 'toggle-user':
            return {
                ...state,
                users: state.users.map((user) => (user.id === action.id ? { ...user, active: !user.active } : user)),
            };
        case 'add-category':
            return { ...state, categories: [...state.categories, action.category] };
        case 'remove-category':
            return { ...state, categories: state.categories.filter((item) => item.id !== action.id) };
        case 'inbox':
            return { ...state, inbox: [action.message, ...state.inbox] };
        case 'audit':
            return { ...state, audit: [action.event, ...state.audit].slice(0, 80) };
        default:
            return state;
    }
}
export function PortalProvider({ children }) {
    const { user } = useSession();
    const [state, dispatch] = useReducer(reducer, undefined, loadState);
    const files = useRef(new Map());
    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);
    const actor = user?.name ?? 'Demonstration visitor';
    const value = useMemo(() => {
        const log = (action) => {
            dispatch({
                type: 'audit',
                event: { id: createId('aud'), at: new Date().toISOString(), actor, action },
            });
        };
        return {
            ...state,
            upsert: (application) => dispatch({ type: 'upsert', application }),
            patch: (id, patch) => dispatch({ type: 'patch', id, patch }),
            addDocument: (applicationId, document, file) => {
                if (file) {
                    const url = URL.createObjectURL(file);
                    files.current.set(document.id, { file, url });
                }
                dispatch({ type: 'add-document', applicationId, document });
            },
            patchDocument: (applicationId, documentId, patch) => dispatch({ type: 'patch-document', applicationId, documentId, patch }),
            removeDocument: (applicationId, documentId) => {
                const stored = files.current.get(documentId);
                if (stored) {
                    URL.revokeObjectURL(stored.url);
                    files.current.delete(documentId);
                }
                dispatch({ type: 'remove-document', applicationId, documentId });
                log(`Removed a document from application ${applicationId}.`);
            },
            fileFor: (documentId) => files.current.get(documentId)?.file,
            urlFor: (documentId) => files.current.get(documentId)?.url,
            setChecks: (applicationId, checks, origin) => {
                dispatch({ type: 'set-checks', applicationId, checks, origin });
                log(`Recorded ${origin === 'api' ? 'service' : 'demonstration'} validation for ${applicationId}.`);
            },
            decide: (applicationId, checkId, decision) => {
                dispatch({ type: 'decide', applicationId, checkId, decision });
                log(`${decision === 'accepted' ? 'Accepted' : 'Rejected'} finding ${checkId} on ${applicationId}. This does not verify a document with an issuing authority.`);
            },
            submit: (applicationId) => {
                const at = new Date().toISOString();
                dispatch({ type: 'submit', applicationId, at });
                log(`Recorded a demonstration submission for ${applicationId}. No government system was contacted.`);
            },
            saveNotes: (applicationId, notes) => {
                dispatch({ type: 'notes', applicationId, notes });
                log(`Saved officer notes on ${applicationId} in this browser session.`);
            },
            setPriority: (applicationId, priority) => {
                dispatch({ type: 'priority', applicationId, priority });
                log(`Set ${applicationId} to ${priority}.`);
            },
            addClarification: (applicationId, author, message) => {
                const item = {
                    id: createId('clr'),
                    applicationId,
                    author,
                    message,
                    createdAt: new Date().toISOString(),
                };
                dispatch({
                    type: 'clarification',
                    item,
                    lifecycle: author === 'officer' ? 'clarification' : 'under-review',
                });
                log(`${author === 'officer' ? 'Requested clarification on' : 'Responded to clarification for'} ${applicationId}.`);
            },
            toggleRule: (id) => {
                dispatch({ type: 'toggle-rule', id });
                log(`Toggled demonstration rule ${id}.`);
            },
            setRatio: (id, ratioDivisor) => {
                dispatch({ type: 'set-ratio', id, ratioDivisor });
                log(`Set the demonstration divisor on ${id} to ${ratioDivisor}.`);
            },
            replaceRules: (rules) => dispatch({ type: 'set-rules', rules }),
            addUser: (userDraft) => {
                dispatch({ type: 'add-user', user: { ...userDraft, id: createId('user'), active: true } });
                log(`Added demonstration user ${userDraft.email}.`);
            },
            toggleUser: (id) => {
                dispatch({ type: 'toggle-user', id });
                log(`Toggled demonstration user ${id}.`);
            },
            addCategory: (label) => {
                const id = label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '') || createId('cat');
                dispatch({ type: 'add-category', category: { id, label } });
                log(`Added document category “${label}”.`);
            },
            removeCategory: (id) => {
                dispatch({ type: 'remove-category', id });
                log(`Removed document category ${id}.`);
            },
            sendInbox: (message) => {
                dispatch({
                    type: 'inbox',
                    message: { ...message, id: createId('msg'), at: new Date().toISOString() },
                });
                log('Stored a prototype support message in this browser session.');
            },
            restoreDemo: () => {
                files.current.forEach((item) => URL.revokeObjectURL(item.url));
                files.current.clear();
                const next = seedState();
                dispatch({ type: 'replace', state: next });
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            },
        };
    }, [actor, state]);
    return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}
export function usePortal() {
    const value = useContext(PortalContext);
    if (!value)
        throw new Error('usePortal must be used within PortalProvider');
    return value;
}
