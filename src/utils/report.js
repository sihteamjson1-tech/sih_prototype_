import { formatBytes, formatWhen } from './format.js';
export function buildReport(application, lang) {
    const lines = [
        'PRAMAAN — VALIDATION REPORT',
        'SIH 2026 Prototype | Not an official government portal',
        '',
        'AI-assisted findings in this file are advisory. Final approval decisions remain with authorized officials.',
        'This demonstration is not an official Government of India or AICTE portal.',
        'A result of Verified means a local completeness or format check passed. It does not authenticate a document.',
        lang === 'hi' ? 'इस प्रोटोटाइप में निष्कर्षों का विवरण अंग्रेज़ी में है।' : 'Findings are written in English in this prototype.',
        '',
        `Application ID: ${application.id}`,
        `Reference: ${application.institution.referenceNumber || '—'}`,
        `Institution: ${application.institution.name || '—'}`,
        `Identifier: ${application.institution.permanentId || '—'}`,
        `State / District: ${application.institution.state || '—'} / ${application.institution.district || '—'}`,
        `Academic year: ${application.institution.academicYear || '—'}`,
        `Data origin: ${application.origin === 'api' ? 'Configured service' : 'Demonstration'}`,
        `Generated: ${formatWhen(new Date().toISOString(), lang)}`,
        '',
        'DOCUMENTS',
    ];
    if (application.documents.length === 0) {
        lines.push('None recorded.');
    }
    else {
        for (const document of application.documents) {
            lines.push(`- ${document.name} | ${document.category} | ${formatBytes(document.size)} | ${document.status}`);
        }
    }
    lines.push('', 'FINDINGS');
    if (application.checks.length === 0) {
        lines.push('Validation has not been run.');
    }
    else {
        application.checks.forEach((check, index) => {
            lines.push('', `${index + 1}. ${check.document}`, `Check: ${check.check}`, `Result: ${check.result}`, `Evidence / reason: ${check.evidence}`, `Recommended action: ${check.action}`, `Reviewer decision: ${check.reviewerDecision ?? 'Not recorded'}`);
        });
    }
    if (application.officerNotes) {
        lines.push('', 'OFFICER NOTES (DEMONSTRATION SESSION)', application.officerNotes);
    }
    lines.push('', 'No issuing-authority register was confirmed by this file unless a connected service explicitly returned that evidence.');
    return lines.join('\n');
}
export function downloadText(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
