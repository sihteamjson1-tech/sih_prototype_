import { useState } from 'react';
import { StatusBadge } from '../../feedback/Feedback.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { formatWhen } from '../../../utils/format.js';
import { lifecycleLabel, typeLabel } from '../../../utils/labels.js';
import { BtnLink, Notice, Screen } from '../MobileUi.jsx';

const EXAMPLES = ['PRA/EOA/2026/MH/00421', 'PRA/NEW/2026/KA/11802', 'PRA/FAC/2026/RJ/33091'];

export function MobileTrack() {
    const { lang } = useLanguage();
    const portal = usePortal();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'आवेदन की स्थिति' : 'Track Application');
    const [query, setQuery] = useState('');
    const [submitted, setSubmitted] = useState('');
    const match = portal.applications.find((item) => {
        const needle = submitted.trim().toLowerCase();
        if (!needle)
            return false;
        return item.institution.referenceNumber.toLowerCase() === needle || item.id.toLowerCase() === needle;
    });
    const steps = match
        ? [
            { label: 'Application opened', done: true, detail: formatWhen(match.createdAt, lang) },
            { label: 'Documents recorded', done: match.documents.length > 0, detail: `${match.documents.length} file(s) in this session` },
            { label: 'Validation recorded', done: match.checks.length > 0, detail: match.checks.length ? `${match.checks.length} checks` : 'Not run' },
            { label: 'Demonstration submission', done: Boolean(match.submittedAt), detail: match.submittedAt ? formatWhen(match.submittedAt, lang) : 'Not recorded' },
            { label: 'Officer review', done: match.lifecycle === 'under-review' || match.lifecycle === 'clarification', detail: lifecycleLabel(match.lifecycle, lang) },
        ]
        : [];
    const outstanding = match?.checks.filter((item) => item.result !== 'verified').slice(0, 6) ?? [];
    return (<Screen title={hi ? 'आवेदन की स्थिति' : 'Track Application'} lede={hi ? 'संदर्भ संख्या से इस ब्राउज़र सत्र की स्थिति देखें। यह आधिकारिक स्थिति नहीं है।' : 'Look up a reference recorded in this browser session. The status is not an official AICTE status.'}>
      <form className="m-card m-stack" style={{ marginTop: 0 }} onSubmit={(event) => { event.preventDefault(); setSubmitted(query); }}>
        <label className="m-label" htmlFor="mobile-track-ref">Application reference number</label>
        <input id="mobile-track-ref" className="m-input" value={query} placeholder="PRA/EOA/2026/MH/00421" onChange={(event) => setQuery(event.target.value)}/>
        <button type="submit" className="m-btn m-btn-primary">{hi ? 'स्थिति देखें' : 'Track status'}</button>
      </form>
      <div className="m-actions">
        {EXAMPLES.map((example) => (<button key={example} type="button" className="m-btn m-btn-secondary m-break" onClick={() => { setQuery(example); setSubmitted(example); }}>
            {example}
          </button>))}
      </div>
      {!submitted ? (<div className="m-card">
          <h2>Enter a reference number</h2>
          <p className="m-muted">Try one of the prepared demonstration references above, or the reference you entered in the verification workflow.</p>
        </div>) : !match ? (<div className="m-card">
          <h2>No matching application</h2>
          <p className="m-muted">That reference is not in this browser session. Demonstration data is not an official register.</p>
        </div>) : (<>
          <Notice>
            {match.institution.name}. {typeLabel(match.type, lang)}. Current label: {lifecycleLabel(match.lifecycle, lang)}. This timeline does not show an official approval.
          </Notice>
          <ol className="m-timeline">
            {steps.map((step, index) => (<li key={step.label}>
                <div className="m-rail" aria-hidden="true">
                  <i className={step.done ? 'is-done' : undefined}/>
                  {index < steps.length - 1 ? <b /> : null}
                </div>
                <div className="m-card" style={{ marginBottom: '0.65rem' }}>
                  <h2>{step.label}</h2>
                  <p className="m-muted">{step.done ? step.detail : `Not yet — ${step.detail}`}</p>
                </div>
              </li>))}
          </ol>
          <section className="m-card">
            <h2>Outstanding items</h2>
            {outstanding.length === 0 ? <p className="m-muted">No outstanding findings on this application.</p> : (<ul className="m-plain m-stack">
                {outstanding.map((item) => (<li key={item.id} className="m-split">
                    <span className="m-break">{item.document}</span>
                    <StatusBadge status={item.result}/>
                  </li>))}
              </ul>)}
          </section>
          <BtnLink to={`/verify?application=${match.id}`} variant="secondary">Open application</BtnLink>
        </>)}
    </Screen>);
}
