import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Banner, EmptyState, PageHeader, StatusBadge } from '../components/feedback/Feedback.jsx';
import { Container } from '../components/layout/Chrome.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { usePortal } from '../context/PortalContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { buttonClass, formatWhen, inputClass } from '../utils/format.js';
import { lifecycleLabel, typeLabel } from '../utils/labels.js';
const EXAMPLES = ['PRA/EOA/2026/MH/00421', 'PRA/NEW/2026/KA/11802', 'PRA/FAC/2026/RJ/33091'];
export function TrackApplication() {
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
        return (item.institution.referenceNumber.toLowerCase() === needle ||
            item.id.toLowerCase() === needle);
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
    return (<Container className="py-8">
      <PageHeader title={hi ? 'आवेदन की स्थिति' : 'Track Application'} lede={hi ? 'संदर्भ संख्या से इस ब्राउज़र सत्र की स्थिति देखें। यह आधिकारिक स्थिति नहीं है।' : 'Look up a reference recorded in this browser session. The status is not an official AICTE status.'} crumbs={[{ label: hi ? 'मुख्य पृष्ठ' : 'Home', to: '/' }, { label: hi ? 'आवेदन की स्थिति' : 'Track Application' }]}/>
      <form className="flex flex-wrap items-end gap-3 border border-line bg-white p-4" onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(query);
        }}>
        <div className="min-w-72 flex-1">
          <label htmlFor="track-ref" className="mb-1 block text-sm font-semibold">Application reference number</label>
          <input id="track-ref" className={inputClass} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="PRA/EOA/2026/MH/00421"/>
        </div>
        <button type="submit" className={buttonClass('primary')}>Track Status</button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (<button key={example} type="button" className={buttonClass('secondary')} onClick={() => { setQuery(example); setSubmitted(example); }}>
            {example}
          </button>))}
      </div>
      <div className="mt-6">
        {!submitted ? (<EmptyState title="Enter a reference number" text="Try one of the prepared demonstration references above, or the reference you entered in the verification workflow."/>) : !match ? (<EmptyState title="No matching application" text="That reference is not in this browser session. Demonstration data is not an official register."/>) : (<div className="space-y-4">
            <Banner>
              {match.institution.name}. {typeLabel(match.type, lang)}. Current label: {lifecycleLabel(match.lifecycle, lang)}. This timeline does not show an official approval.
            </Banner>
            <ol className="space-y-3">
              {steps.map((step, index) => (<li key={step.label} className="grid grid-cols-[2rem_1fr] gap-3 border border-line bg-white p-4">
                  <span className="font-semibold text-navy">{index + 1}</span>
                  <div>
                    <h2 className="font-semibold text-navy">{step.label}</h2>
                    <p className="mt-1 text-sm text-muted">{step.done ? step.detail : `Not yet — ${step.detail}`}</p>
                  </div>
                </li>))}
            </ol>
            <div>
              <h2 className="mb-2 text-lg font-semibold text-navy">Outstanding items</h2>
              <ul className="space-y-2">
                {match.checks.filter((item) => item.result !== 'verified').slice(0, 6).map((item) => (<li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border border-line bg-white px-3 py-2 text-sm">
                    <span>{item.document}</span>
                    <StatusBadge status={item.result}/>
                  </li>))}
              </ul>
            </div>
            <Link className={buttonClass('secondary')} to={`/verify?application=${match.id}`}>Open application</Link>
          </div>)}
      </div>
    </Container>);
}
