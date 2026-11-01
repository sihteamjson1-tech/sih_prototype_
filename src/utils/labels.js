export const TYPE_OPTIONS = [
    {
        id: 'eoa',
        en: 'Extension of Approval (EoA)',
        hi: 'अनुमोदन का विस्तार (EoA)',
        blurb: 'Continue an existing approval for the selected academic year.',
    },
    {
        id: 'new-institution',
        en: 'New Institution',
        hi: 'नया संस्थान',
        blurb: 'A first application for a technical institution.',
    },
    {
        id: 'details-update',
        en: 'Institution Details Update',
        hi: 'संस्थान विवरण अद्यतन',
        blurb: 'Change name, address, or other recorded particulars.',
    },
    {
        id: 'faculty-infrastructure',
        en: 'Faculty / Infrastructure Update',
        hi: 'संकाय / अवसंरचना अद्यतन',
        blurb: 'Submit faculty or infrastructure evidence for review.',
    },
    {
        id: 'other',
        en: 'Other Application',
        hi: 'अन्य आवेदन',
        blurb: 'Another approval-related application covered by this prototype.',
    },
];
export function typeLabel(id, lang) {
    const found = TYPE_OPTIONS.find((item) => item.id === id);
    if (!found)
        return id;
    return lang === 'hi' ? found.hi : found.en;
}
export function lifecycleLabel(lifecycle, lang) {
    const labels = {
        draft: { en: 'Draft', hi: 'प्रारूप' },
        validated: { en: 'Validation recorded', hi: 'सत्यापन दर्ज' },
        submitted: { en: 'Submitted in this demo', hi: 'इस डेमो में जमा' },
        'under-review': { en: 'Pending officer review', hi: 'अधिकारी समीक्षा लंबित' },
        clarification: { en: 'Clarification requested', hi: 'स्पष्टीकरण माँगा गया' },
    };
    return labels[lifecycle][lang];
}
export function roleLabel(role, lang) {
    const labels = {
        applicant: { en: 'Institution Applicant', hi: 'संस्थान आवेदक' },
        officer: { en: 'AICTE Reviewing Officer', hi: 'समीक्षा अधिकारी' },
        compliance: { en: 'Compliance Officer', hi: 'अनुपालन अधिकारी' },
        admin: { en: 'Administrator', hi: 'प्रशासक' },
    };
    return labels[role][lang];
}
