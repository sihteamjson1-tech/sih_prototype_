import { ACADEMIC_YEARS, INDIAN_STATES, INSTITUTION_TYPES, inputClass, selectClass } from '../../utils/format.js';
import { Field } from './Field.jsx';
export function InstitutionForm({ value, errors, onChange, }) {
    const set = (key, fieldValue) => onChange({ ...value, [key]: fieldValue });
    const described = (id) => (errors[id] ? `${id}-error` : undefined);
    return (<div className="grid gap-4 md:grid-cols-2">
      <Field id="name" label="Institution name" error={errors.name}>
        <input id="name" className={inputClass} autoComplete="organization" value={value.name} aria-invalid={Boolean(errors.name)} aria-describedby={described('name')} onChange={(event) => set('name', event.target.value)}/>
      </Field>
      <Field id="permanentId" label="AICTE Permanent ID or institution identifier" error={errors.permanentId} hint="A common permanent ID looks like 1-3456789012. Other identifiers are accepted; the format check will say if the common pattern does not match.">
        <input id="permanentId" className={inputClass} value={value.permanentId} aria-invalid={Boolean(errors.permanentId)} aria-describedby={errors.permanentId ? 'permanentId-error permanentId-hint' : 'permanentId-hint'} onChange={(event) => set('permanentId', event.target.value)}/>
      </Field>
      <Field id="state" label="State" error={errors.state}>
        <select id="state" className={selectClass} value={value.state} aria-invalid={Boolean(errors.state)} aria-describedby={described('state')} onChange={(event) => set('state', event.target.value)}>
          <option value="">Select state or Union Territory</option>
          {INDIAN_STATES.map((state) => (<option key={state} value={state}>{state}</option>))}
        </select>
      </Field>
      <Field id="district" label="District" error={errors.district}>
        <input id="district" className={inputClass} value={value.district} aria-invalid={Boolean(errors.district)} aria-describedby={described('district')} onChange={(event) => set('district', event.target.value)}/>
      </Field>
      <Field id="institutionType" label="Institution type" error={errors.institutionType} hint="Demonstration list, not an official classification.">
        <select id="institutionType" className={selectClass} value={value.institutionType} aria-invalid={Boolean(errors.institutionType)} aria-describedby={errors.institutionType ? 'institutionType-error institutionType-hint' : 'institutionType-hint'} onChange={(event) => set('institutionType', event.target.value)}>
          <option value="">Select type</option>
          {INSTITUTION_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
        </select>
      </Field>
      <Field id="referenceNumber" label="Application reference number" error={errors.referenceNumber}>
        <input id="referenceNumber" className={inputClass} value={value.referenceNumber} aria-invalid={Boolean(errors.referenceNumber)} aria-describedby={described('referenceNumber')} onChange={(event) => set('referenceNumber', event.target.value)}/>
      </Field>
      <Field id="academicYear" label="Academic year" error={errors.academicYear}>
        <select id="academicYear" className={selectClass} value={value.academicYear} aria-invalid={Boolean(errors.academicYear)} aria-describedby={described('academicYear')} onChange={(event) => set('academicYear', event.target.value)}>
          {ACADEMIC_YEARS.map((year) => (<option key={year} value={year}>{year}</option>))}
        </select>
      </Field>
      <Field id="email" label="Contact email" error={errors.email}>
        <input id="email" type="email" autoComplete="email" className={inputClass} value={value.email} aria-invalid={Boolean(errors.email)} aria-describedby={described('email')} onChange={(event) => set('email', event.target.value)}/>
      </Field>
    </div>);
}
