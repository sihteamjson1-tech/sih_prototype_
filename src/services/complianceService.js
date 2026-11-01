import { apiRequest, isDemoMode } from './api.js';
import { evaluateRules } from './validationEngine.js';
const STATUSES = [
    'verified',
    'mismatch',
    'missing',
    'expired',
    'pending',
    'source-unavailable',
    'manual-review',
];
export function complianceRows(application, rules) {
    return evaluateRules(application, rules);
}
export async function loadServiceRules() {
    if (isDemoMode())
        return null;
    const payload = await apiRequest('/api/compliance/rules');
    const rows = Array.isArray(payload) ? payload : payload.rules;
    return rows.map((rule, index) => ({
        id: rule.id || `API-${index + 1}`,
        description: rule.description || 'The service did not describe this requirement.',
        applicable: 'all',
        evidence: rule.evidence || 'Not stated by the service',
        kind: 'manual',
        enabled: true,
        ratioDivisor: 15,
        origin: 'api',
    }));
}
export function serviceStatus(value) {
    const found = STATUSES.find((item) => item === value);
    return found ?? 'manual-review';
}
export function matchesFilter(result, filter) {
    if (filter === 'all')
        return true;
    if (filter === 'compliant')
        return result === 'verified';
    if (filter === 'non-compliant')
        return result === 'mismatch' || result === 'expired';
    if (filter === 'missing')
        return result === 'missing';
    return result === 'manual-review' || result === 'pending' || result === 'source-unavailable';
}
