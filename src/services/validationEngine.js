import { createId, pidPatternOk } from '../utils/format.js';
const TYPE_LABEL = {
    eoa: 'Extension of Approval (EoA)',
    'new-institution': 'New Institution',
    'details-update': 'Institution Details Update',
    'faculty-infrastructure': 'Faculty / Infrastructure Update',
    other: 'Other Application',
};
function applies(rule, type) {
    return rule.applicable === 'all' || rule.applicable.includes(type);
}
function categoryDocs(application, category) {
    if (!category)
        return application.documents.filter((item) => item.status === 'uploaded');
    return application.documents.filter((item) => item.status === 'uploaded' && item.category === category);
}
function factOn(documents, key) {
    return documents.find((item) => item.sampleFacts?.[key] !== undefined)?.sampleFacts;
}
function check(partial) {
    return {
        id: createId('chk'),
        origin: partial.origin ?? 'demonstration',
        document: partial.document,
        check: partial.check,
        result: partial.result,
        evidence: partial.evidence,
        action: partial.action,
        ruleId: partial.ruleId,
    };
}
export function evaluateRules(application, rules) {
    return rules
        .filter((rule) => rule.enabled && applies(rule, application.type))
        .map((rule) => evaluateRule(application, rule));
}
function evaluateRule(application, rule) {
    const docs = categoryDocs(application, rule.evidenceCategory);
    const present = rule.evidenceCategory ? docs.length > 0 : true;
    const year = application.institution.academicYear || 'the selected academic year';
    if (rule.kind === 'presence') {
        if (present) {
            return check({
                ruleId: rule.id,
                document: rule.evidence,
                check: rule.description,
                result: 'verified',
                evidence: `Passed as a completeness check only. A file is recorded under “${rule.evidence}”. The file was not authenticated with an issuing authority. Requirement ${rule.id} is demonstration checklist data.`,
                action: 'Open the file and confirm that it is the document the category claims to be.',
            });
        }
        return check({
            ruleId: rule.id,
            document: rule.evidence,
            check: rule.description,
            result: 'missing',
            evidence: `No file is recorded under “${rule.evidence}” for this ${TYPE_LABEL[application.type]} case. Requirement ${rule.id} belongs to the demonstration checklist, not an official AICTE schedule.`,
            action: 'Upload a legible PDF or image in that category, then run validation again.',
        });
    }
    if (rule.kind === 'source') {
        return check({
            ruleId: rule.id,
            document: rule.evidence,
            check: rule.description,
            result: 'source-unavailable',
            evidence: 'Demo Verification. No authorised approval register, accreditation body, or land-record service was contacted. A successful authenticity result has not been produced.',
            action: 'Confirm the document through the issuing authority’s own channel before relying on it.',
        });
    }
    if (rule.kind === 'pending-source') {
        if (!present) {
            return check({
                ruleId: rule.id,
                document: rule.evidence,
                check: rule.description,
                result: 'missing',
                evidence: `No land or building file is on this application. ${rule.id} is a demonstration requirement.`,
                action: 'Upload the land or building evidence the institution intends to rely on.',
            });
        }
        return check({
            ruleId: rule.id,
            document: docs[0]?.name ?? rule.evidence,
            check: rule.description,
            result: 'pending',
            evidence: 'The file is present, but ownership was not confirmed. Source Unavailable for a conclusive land-record result, so the check stays Pending Verification. Demo Verification only.',
            action: 'An officer should compare the file with the competent land record outside this prototype.',
        });
    }
    if (rule.kind === 'manual') {
        if (!present) {
            return check({
                ruleId: rule.id,
                document: rule.evidence,
                check: rule.description,
                result: 'missing',
                evidence: `No file is recorded under “${rule.evidence}”. ${rule.id} is demonstration checklist data, not an official schedule.`,
                action: 'Upload the evidence an officer would need to read. Upload alone does not establish compliance.',
            });
        }
        const infra = rule.evidenceCategory === 'infrastructure';
        return check({
            ruleId: rule.id,
            document: docs[0]?.name ?? rule.evidence,
            check: rule.description,
            result: 'manual-review',
            evidence: infra
                ? 'A photograph or drawing can show a space, but it cannot establish built-up area, safety, or equipment. Manual Review Required. No site visit was conducted.'
                : `The file under “${rule.evidence}” is stored for an officer to read. Its figures were not reconciled with a bank, auditor, or other external source. Manual Review Required.`,
            action: infra
                ? 'Review the original files and request a clearer photograph or an inspection if the image is insufficient.'
                : 'Read the file and record what still needs an external confirmation.',
        });
    }
    if (rule.kind === 'particulars') {
        if (!present) {
            return check({
                ruleId: rule.id,
                document: rule.evidence,
                check: rule.description,
                result: 'missing',
                evidence: `No faculty file is recorded, so designation, qualification, and appointment type cannot be reviewed. ${rule.id} is demonstration data.`,
                action: 'Upload a faculty list that states designation, qualification, and appointment type.',
            });
        }
        const facts = factOn(docs, 'note');
        if (application.scenario && facts?.note) {
            return check({
                ruleId: rule.id,
                document: docs[0]?.name ?? rule.evidence,
                check: rule.description,
                result: 'missing',
                evidence: `Missing Information. The demonstration faculty document states: “${facts.note}”. Qualification and appointment type are not on that sample page. This was not read from a live institutional file.`,
                action: 'Ask the institution for a list with designation, qualification, and appointment type for each person.',
            });
        }
        return check({
            ruleId: rule.id,
            document: docs[0]?.name ?? rule.evidence,
            check: rule.description,
            result: 'manual-review',
            evidence: 'The faculty file was stored, but this prototype did not extract designation, qualification, or appointment type from it. Manual Review Required. Nothing has been marked missing inside the file itself.',
            action: 'Read the file and record whether the required columns are present.',
        });
    }
    if (rule.kind === 'expiry') {
        if (!present) {
            return check({
                ruleId: rule.id,
                document: rule.evidence,
                check: rule.description,
                result: 'missing',
                evidence: `No accreditation or approval-validity file is recorded for academic year ${year}. ${rule.id} is demonstration checklist data.`,
                action: 'Upload the certificate the institution relies on, if this case requires one.',
            });
        }
        const facts = factOn(docs, 'expiryDate');
        if (facts?.expiryDate) {
            const expiry = new Date(facts.expiryDate);
            const startYear = Number(year.slice(0, 4));
            const yearStart = Number.isFinite(startYear) ? new Date(startYear, 5, 1) : null;
            if (yearStart && expiry < yearStart) {
                return check({
                    ruleId: rule.id,
                    document: docs[0]?.name ?? rule.evidence,
                    check: rule.description,
                    result: 'expired',
                    evidence: `Expired against the date printed on the demonstration document: ${facts.expiryDate.slice(0, 10)}. That date is before 1 June ${startYear}, the comparison date this prototype uses for academic year ${year}. The date was not confirmed with an accreditation body.`,
                    action: 'Check the original certificate. If the date is correct, ask for a current certificate or record why the earlier one is being submitted.',
                });
            }
            return check({
                ruleId: rule.id,
                document: docs[0]?.name ?? rule.evidence,
                check: rule.description,
                result: 'manual-review',
                evidence: `The demonstration document shows an end date of ${facts.expiryDate.slice(0, 10)}, which is not before the comparison date for ${year}. This is not a registry confirmation.`,
                action: 'Still confirm the certificate with the issuing body. Demo Verification cannot mark it authentic.',
            });
        }
        return check({
            ruleId: rule.id,
            document: docs[0]?.name ?? rule.evidence,
            check: rule.description,
            result: 'manual-review',
            evidence: 'The file is present, but no expiry date was available as structured data. An expiry finding has not been inferred. Manual Review Required.',
            action: 'Read the validity dates on the original document.',
        });
    }
    const facultyFacts = factOn(categoryDocs(application, 'faculty'), 'facultyCount');
    const intake = facultyFacts?.intake;
    const facultyCount = facultyFacts?.facultyCount;
    if (intake === undefined || facultyCount === undefined) {
        return check({
            ruleId: rule.id,
            document: 'Faculty and intake',
            check: rule.description,
            result: 'manual-review',
            evidence: 'Sanctioned intake and faculty-entry count were not both available as structured fields, so no comparison was made. Manual Review Required. This prototype does not apply an official staffing norm.',
            action: 'Enter or extract both figures from the source documents before treating any ratio as a finding.',
        });
    }
    const needed = Math.ceil(intake / Math.max(rule.ratioDivisor, 1));
    if (facultyCount < needed) {
        return check({
            ruleId: rule.id,
            document: 'Faculty list and intake note',
            check: rule.description,
            result: 'mismatch',
            evidence: `Mismatch Detected using a demonstration threshold only. The sample faculty document shows ${facultyCount} faculty entries and a sanctioned intake of ${intake}. The configurable divisor is ${rule.ratioDivisor} seats per entry, which would expect at least ${needed} entries. This is not an official AICTE norm and was not calculated from a live file.`,
            action: 'Compare the original intake approval and faculty list. Change the demonstration divisor under Administrator if you want to show how a configurable rule behaves.',
        });
    }
    return check({
        ruleId: rule.id,
        document: 'Faculty list and intake note',
        check: rule.description,
        result: 'verified',
        evidence: `The sample figures (${facultyCount} entries, intake ${intake}) do not cross the demonstration threshold of 1 entry per ${rule.ratioDivisor} seats. Passed only against that prototype setting, not against an official norm.`,
        action: 'Do not treat this as regulatory clearance.',
    });
}
export function buildValidation(application, rules) {
    const checks = [];
    const name = application.institution.name.trim();
    const pid = application.institution.permanentId.trim();
    const email = application.institution.email.trim();
    checks.push(check({
        document: 'Institution name',
        check: 'Field completeness',
        result: name.length >= 3 ? 'verified' : 'missing',
        evidence: name.length >= 3
            ? `The application records the name “${name}”. Passed as a completeness check only. The name was not confirmed with an institution register.`
            : 'The institution name is missing, so later name comparisons cannot run.',
        action: name.length >= 3 ? 'Correct the spelling if it does not match the documents.' : 'Enter the institution name.',
    }));
    checks.push(check({
        document: 'Institution identifier',
        check: 'Identifier format',
        result: pidPatternOk(pid) ? 'verified' : 'mismatch',
        evidence: pidPatternOk(pid)
            ? `“${pid}” matches the common permanent-ID pattern of a digit, a hyphen, and 6 to 12 digits. Format match is not a registry confirmation.`
            : `“${pid || 'Blank'}” does not match the common pattern such as 1-3456789012. This is a format observation only. The identifier was not looked up.`,
        action: 'Confirm the identifier with an authorised source before relying on it.',
    }));
    checks.push(check({
        document: 'Contact email',
        check: 'Email format',
        result: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'verified' : 'mismatch',
        evidence: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ? `“${email}” is syntactically valid. The address was not verified by sending a message.`
            : 'The contact email is missing or not a valid address.',
        action: 'Use an official institutional address in any real submission.',
    }));
    const uploaded = application.documents.filter((item) => item.status === 'uploaded');
    if (uploaded.length === 0) {
        checks.push(check({
            document: 'Document set',
            check: 'At least one supporting file',
            result: 'missing',
            evidence: 'No file has been recorded on this application, so document checks cannot go further.',
            action: 'Upload the documents the institution wants reviewed.',
        }));
    }
    for (const document of uploaded) {
        checks.push(check({
            document: document.name,
            check: 'Local file acceptance',
            result: 'verified',
            evidence: `${document.name} (${document.mimeType || 'unknown type'}) was accepted by the browser-side type and size checks and stored in this session under the applicant-selected category “${document.category}”. Contents were not authenticated.`,
            action: 'Open the preview and confirm the file is legible and in the right category.',
        }));
    }
    checks.push(...evaluateRules(application, rules));
    return checks;
}
export const PIPELINE_STAGES = [
    { id: 'classify', en: 'Document Classification', hi: 'दस्तावेज़ वर्गीकरण' },
    { id: 'ocr', en: 'OCR & Data Extraction', hi: 'ओसीआर और डेटा निष्कर्षण' },
    { id: 'completeness', en: 'Completeness Validation', hi: 'पूर्णता की जाँच' },
    { id: 'consistency', en: 'Cross-Document Consistency', hi: 'दस्तावेज़ों के बीच संगति' },
    { id: 'source', en: 'Available Source Verification', hi: 'उपलब्ध स्रोत से सत्यापन' },
    { id: 'compliance', en: 'Regulatory Compliance Checks', hi: 'नियामक अनुपालन जाँच' },
    { id: 'report', en: 'Report Generation', hi: 'रिपोर्ट निर्माण' },
];
