const DEFAULT_TIMEOUT_MS = 15_000;
export class ApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}
export function apiBaseUrl() {
    return (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
}
export function isDemoMode() {
    return import.meta.env.VITE_DEMO_MODE !== 'false';
}
export async function apiRequest(path, options = {}) {
    const base = apiBaseUrl();
    if (!base) {
        throw new ApiError('VITE_API_BASE_URL is not configured.', 0);
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    const isForm = options.body instanceof FormData;
    try {
        const response = await fetch(`${base}${path}`, {
            ...options,
            headers: {
                Accept: 'application/json',
                ...(isForm ? {} : { 'Content-Type': 'application/json' }),
                ...options.headers,
            },
            signal: controller.signal,
        });
        if (!response.ok) {
            throw new ApiError(`The service returned ${response.status}.`, response.status);
        }
        if (response.status === 204)
            return undefined;
        return (await response.json());
    }
    catch (error) {
        if (error instanceof ApiError)
            throw error;
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new ApiError('The request timed out.', 0);
        }
        throw new ApiError('The validation service could not be reached.', 0);
    }
    finally {
        window.clearTimeout(timeout);
    }
}
export async function testApiConnection() {
    if (!apiBaseUrl()) {
        return {
            ok: false,
            message: 'VITE_API_BASE_URL is empty. Demonstration mode does not call a service.',
        };
    }
    try {
        await apiRequest('/api/compliance/rules');
        return { ok: true, message: 'The configured service responded to GET /api/compliance/rules.' };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Connection failed.';
        return { ok: false, message };
    }
}
export function checksFromApi(payload) {
    const rows = payload.checks ?? payload.results ?? [];
    return rows.map((row, index) => ({
        id: row.id || `api-${index + 1}`,
        document: row.document || 'Service response',
        check: row.check || 'Validation service result',
        result: normaliseStatus(row.result),
        evidence: row.evidence || 'The service did not explain this result.',
        action: row.action || 'Review the service response before acting on it.',
        origin: 'api',
    }));
}
function normaliseStatus(value) {
    const known = [
        'verified',
        'mismatch',
        'missing',
        'expired',
        'pending',
        'source-unavailable',
        'manual-review',
    ];
    const found = known.find((item) => item === value);
    return found ?? 'manual-review';
}
