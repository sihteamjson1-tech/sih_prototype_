export function cn(...parts) {
    return parts.filter(Boolean).join(' ');
}
export const inputClass = 'w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:border-blue';
export const selectClass = inputClass;
export function buttonClass(variant = 'primary') {
    const base = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60';
    if (variant === 'secondary') {
        return cn(base, 'border border-navy bg-white text-navy hover:bg-[#e8f1f8]');
    }
    if (variant === 'quiet') {
        return cn(base, 'min-h-0 px-0 py-0 text-navy underline-offset-2 hover:underline');
    }
    if (variant === 'danger') {
        return cn(base, 'border border-danger bg-white text-danger hover:bg-[#fdecee]');
    }
    return cn(base, 'bg-navy text-white hover:bg-navy-deep');
}
export function formatBytes(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export function formatWhen(iso, lang) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime()))
        return iso;
    return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
    }).format(date);
}
export function formatDay(iso, lang) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime()))
        return iso;
    return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
    }).format(date);
}
export function createId(prefix) {
    const rand = crypto.randomUUID().replaceAll('-', '').slice(0, 10);
    return `${prefix}-${rand}`;
}
export function safeFileName(value) {
    const cleaned = value.replaceAll(/[^a-zA-Z0-9._-]+/g, '-').replaceAll(/-+/g, '-');
    return cleaned.slice(0, 80) || 'report';
}
export const INDIAN_STATES = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
];
export const INSTITUTION_TYPES = [
    'State Government',
    'Central Government',
    'Government Aided',
    'Private / Self-financing',
    'Deemed to be University',
    'University Department',
    'Other',
];
export const ACADEMIC_YEARS = ['2024-25', '2025-26', '2026-27', '2027-28'];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
const EXTENSIONS = new Set(['pdf', 'jpg', 'jpeg', 'png']);
const MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']);
export function fileError(file) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!EXTENSIONS.has(extension)) {
        return 'Use a PDF, JPG, JPEG, or PNG file.';
    }
    if (file.type && !MIME_TYPES.has(file.type)) {
        return 'The file type is not accepted.';
    }
    if (file.size <= 0)
        return 'The file is empty.';
    if (file.size > MAX_FILE_BYTES)
        return 'The file is larger than 10 MB.';
    return null;
}
export function emptyInstitution() {
    return {
        name: '',
        permanentId: '',
        state: '',
        district: '',
        institutionType: '',
        referenceNumber: '',
        academicYear: '2026-27',
        email: '',
    };
}
export function validateInstitution(details) {
    const errors = {};
    if (details.name.trim().length < 3) {
        errors.name = 'Enter the institution name (at least 3 characters).';
    }
    if (!/^[A-Za-z0-9][A-Za-z0-9/-]{3,40}$/.test(details.permanentId.trim())) {
        errors.permanentId = 'Enter an institution identifier using letters, numbers, or hyphens.';
    }
    if (!details.state)
        errors.state = 'Select a state or Union Territory.';
    if (details.district.trim().length < 2)
        errors.district = 'Enter the district.';
    if (!details.institutionType)
        errors.institutionType = 'Select an institution type.';
    if (details.referenceNumber.trim().length < 6) {
        errors.referenceNumber = 'Enter the application reference number (at least 6 characters).';
    }
    if (!details.academicYear)
        errors.academicYear = 'Select the academic year.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
        errors.email = 'Enter a valid contact email address.';
    }
    return errors;
}
export function pidPatternOk(value) {
    return /^\d-\d{6,12}$/.test(value.trim());
}
