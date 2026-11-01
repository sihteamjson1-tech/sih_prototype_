import { apiRequest, checksFromApi, isDemoMode } from './api.js';
import { buildValidation } from './validationEngine.js';
export async function runValidation(application, rules, files) {
    if (isDemoMode()) {
        return { checks: buildValidation(application, rules), origin: 'demonstration' };
    }
    const created = await apiRequest('/api/applications', {
        method: 'POST',
        body: JSON.stringify({
            type: application.type,
            institution: application.institution,
        }),
    });
    for (const document of application.documents) {
        const file = files.get(document.id);
        if (!file)
            continue;
        const body = new FormData();
        body.append('file', file);
        body.append('category', document.category);
        await apiRequest(`/api/applications/${created.id}/documents`, { method: 'POST', body });
    }
    await apiRequest(`/api/applications/${created.id}/validate`, { method: 'POST' });
    const results = await apiRequest(`/api/applications/${created.id}/results`);
    return { checks: checksFromApi(results), origin: 'api', serviceId: created.id };
}
export async function fetchRemoteReport(serviceId) {
    const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
    const response = await fetch(`${base}/api/applications/${serviceId}/report`);
    if (!response.ok) {
        throw new Error(`The report endpoint returned ${response.status}.`);
    }
    return response.blob();
}
export function localChecks(application, rules) {
    return buildValidation(application, rules);
}
