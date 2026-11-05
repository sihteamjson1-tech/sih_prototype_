import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { lifecycleLabel, typeLabel } from '../../../utils/labels.js';
import { BtnLink, DeskGate, FindingCards, Notice, Screen } from '../MobileUi.jsx';

function matches(application, filter) {
    if (filter === 'priority')
        return application.priority === 'priority';
    if (filter === 'pending')
        return application.lifecycle === 'under-review' || application.lifecycle === 'submitted' || application.lifecycle === 'validated';
    if (filter === 'clarification')
        return application.lifecycle === 'clarification';
    return application.lifecycle !== 'draft';
}

export function MobileOfficer() {
    const { lang } = useLanguage();
    const portal = usePortal();
    usePageTitle('Reviewing officer');
    const [filter, setFilter] = useState('pending');
    const queue = portal.applications.filter((item) => matches(item, filter));
    const [selectedId, setSelectedId] = useState(queue[0]?.id ?? portal.applications[0]?.id ?? '');
    const selected = portal.applications.find((item) => item.id === selectedId) ?? queue[0];
    const [notes, setNotes] = useState(selected?.officerNotes ?? '');
    const [ask, setAsk] = useState(false);
    const [message, setMessage] = useState('');
    const [saved, setSaved] = useState('');
    const [askError, setAskError] = useState('');
    const filters = [
        { id: 'all', label: 'All' },
        { id: 'priority', label: 'Priority' },
        { id: 'pending', label: 'Pending' },
        { id: 'clarification', label: 'Clarification' },
    ];
    return (<Screen kicker="Demonstration desk" title="Reviewing Officer" lede="Review the demonstration queue, read the evidence for each finding, and record a note. Nothing here is an official order.">
      <DeskGate role="officer"/>
      <div className="m-chips" role="group" aria-label="Queue filters">
        {filters.map((item) => (<button key={item.id} type="button" className="m-chip" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>))}
      </div>
      {queue.length === 0 ? <p className="m-muted">No applications in this filter.</p> : (<div className="m-hscroll" aria-label="Queue">
          {queue.map((item) => (<button key={item.id} type="button" className={selected?.id === item.id ? 'm-pick is-on m-break' : 'm-pick m-break'} onClick={() => { setSelectedId(item.id); setNotes(item.officerNotes ?? ''); setSaved(''); }}>
              <strong>{item.institution.referenceNumber || item.id}</strong>
              <small>{item.institution.name}</small>
              <small>{lifecycleLabel(item.lifecycle, lang)} · {item.priority === 'priority' ? 'Priority' : 'Routine'}</small>
            </button>))}
        </div>)}
      {selected ? (<>
          <section className="m-card">
            <h2 className="m-break">{selected.institution.name}</h2>
            <p className="m-muted">{typeLabel(selected.type, lang)} · {selected.institution.permanentId}</p>
            <div className="m-actions" style={{ marginTop: '0.75rem' }}>
              <button type="button" className="m-btn m-btn-secondary" onClick={() => portal.setPriority(selected.id, selected.priority === 'priority' ? 'routine' : 'priority')}>
                {selected.priority === 'priority' ? 'Mark routine' : 'Mark as priority'}
              </button>
              <BtnLink to={`/documents?application=${selected.id}`} variant="secondary">Document-level review</BtnLink>
              <button type="button" className="m-btn m-btn-secondary" onClick={() => setAsk(true)}>Request clarification</button>
            </div>
          </section>
          <p className="m-muted">Accept keeps the finding on the review record. Reject marks it as not accepted by the officer. Neither action verifies a document with an issuing authority.</p>
          <FindingCards checks={selected.checks} onDecide={(checkId, decision) => portal.decide(selected.id, checkId, decision)}/>
          <section className="m-card m-form">
            <label className="m-label" htmlFor="mobile-officer-notes">Final review notes</label>
            <textarea id="mobile-officer-notes" className="m-input" rows={4} value={notes} onChange={(event) => setNotes(event.target.value)}/>
            <button type="button" className="m-btn m-btn-primary" onClick={() => { portal.saveNotes(selected.id, notes); setSaved('Notes saved in this browser session only. This is not an official order.'); }}>
              Record review notes
            </button>
            {saved ? <Notice tone="success">{saved}</Notice> : null}
          </section>
        </>) : null}
      {ask && selected ? (<section className="m-card m-form">
          <h2>Request clarification</h2>
          <p className="m-muted">The message stays in this demonstration and appears on the applicant desk. It is not sent to an official mailbox.</p>
          <label className="m-label" htmlFor="mobile-clarification">Clarification message</label>
          <textarea id="mobile-clarification" className="m-input" rows={4} value={message} onChange={(event) => setMessage(event.target.value)}/>
          {askError ? <p className="m-error" role="alert">{askError}</p> : null}
          <div className="m-actions">
            <button type="button" className="m-btn m-btn-primary" onClick={() => {
                if (message.trim().length < 8) {
                    setAskError('Enter at least 8 characters so the institution knows what to provide.');
                    return;
                }
                portal.addClarification(selected.id, 'officer', message.trim());
                setMessage('');
                setAskError('');
                setAsk(false);
                setSaved('Clarification recorded in this browser session.');
            }}>Record request</button>
            <button type="button" className="m-btn m-btn-secondary" onClick={() => { setAsk(false); setAskError(''); }}>Cancel</button>
          </div>
        </section>) : null}
    </Screen>);
}
