export function categoryLabel(categories, id) {
    return categories.find((item) => item.id === id)?.label ?? id;
}
export function extractionFor(document, application) {
    const facts = document.sampleFacts;
    if (!facts) {
        return [
            field('institution', 'Extracted institution name', 'Not extracted', 'No OCR service ran against this file.'),
            field('number', 'Certificate number', 'Not extracted', 'No number was read from the file.'),
            field('issuer', 'Issuing authority', 'Not extracted', 'The issuer was not identified.'),
            field('issued', 'Issue date', 'Not extracted', 'No issue date was read.'),
            field('expiry', 'Expiry date', 'Not extracted', 'No expiry date was read. An expiry has not been assumed.'),
            field('pid', 'Institution identifier', 'Not extracted', 'The identifier printed on the file was not read.'),
        ];
    }
    return [
        field('institution', 'Extracted institution name', facts.institutionName ?? application.institution.name, 'Taken from the demonstration document model, not from an external OCR service.'),
        field('number', 'Certificate number', facts.certificateNumber ?? 'Not printed on this sample', 'Demonstration field.'),
        field('issuer', 'Issuing authority', facts.issuer ?? 'Not printed', 'The sample names a demonstration desk, not a real authority.'),
        field('issued', 'Issue date', facts.issueDate ?? 'Not printed', 'Demonstration field.'),
        field('expiry', 'Expiry date', facts.expiryDate ?? 'Not printed on this sample', 'Shown only when the sample document prints a date.'),
        field('pid', 'Institution identifier', facts.permanentId ?? application.institution.permanentId, 'Demonstration field.'),
        ...(facts.intake !== undefined
            ? [field('intake', 'Sanctioned intake (sample)', String(facts.intake), 'Printed on the demonstration faculty page.')]
            : []),
        ...(facts.facultyCount !== undefined
            ? [field('faculty', 'Faculty entries (sample)', String(facts.facultyCount), 'Counted from the demonstration table, which has eight placeholder rows.')]
            : []),
        ...(facts.note ? [field('note', 'Other extracted note', facts.note, 'Printed on the demonstration document.')] : []),
    ];
}
function field(key, label, value, note) {
    return { key, label, value, note };
}
export function evidenceFor(document, application) {
    const related = application.checks.find((item) => item.document === document.name);
    return {
        sourceChecked: 'None — no issuing-authority integration is configured',
        method: document.sampleFacts ? 'Demo Verification' : 'Source Unavailable',
        timestamp: document.uploadedAt,
        result: related?.result ?? 'source-unavailable',
        reason: document.sampleFacts
            ? 'Fields on the right are copied from the demonstration document shown here. They were not confirmed with the body named on a real certificate.'
            : 'The file is stored in this browser session only. Its contents were not sent to an issuing authority, so authenticity is Source Unavailable.',
        reference: related?.ruleId ?? 'DEMO-SRC-01',
        mode: document.sampleFacts ? 'Demo Verification' : 'Source Unavailable',
    };
}
export function ocrStatus(document) {
    if (document.sampleFacts)
        return 'Demonstration fields';
    if (document.preview === 'scene')
        return 'Not performed — image held for officer review';
    return 'Not performed';
}
export function runUploadProgress(onProgress, isCancelled) {
    return new Promise((resolve) => {
        let value = 0;
        const timer = window.setInterval(() => {
            if (isCancelled()) {
                window.clearInterval(timer);
                resolve();
                return;
            }
            value = Math.min(100, value + 25);
            onProgress(value);
            if (value >= 100) {
                window.clearInterval(timer);
                resolve();
            }
        }, 90);
    });
}
