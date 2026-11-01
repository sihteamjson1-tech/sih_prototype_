import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeskFrame } from '../../components/dashboards/DeskFrame.jsx';
import { Banner } from '../../components/feedback/Feedback.jsx';
import { FindingsTable } from '../../components/tables/FindingsTable.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { usePortal } from '../../context/PortalContext.jsx';
import { usePageTitle } from '../../hooks/usePageTitle.js';
import { buttonClass, cn, inputClass } from '../../utils/format.js';
import { lifecycleLabel, typeLabel } from '../../utils/labels.js';
function matches(application, filter) {
    if (filter === 'priority')
        return application.priority === 'priority';
    if (filter === 'pending')
        return application.lifecycle === 'under-review' || application.lifecycle === 'submitted' || application.lifecycle === 'validated';
    if (filter === 'clarification')
        return application.lifecycle === 'clarification';
    return application.lifecycle !== 'draft';
}
export function OfficerDashboard() {
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
        { id: 'all', label: 'All in queue' },
        { id: 'priority', label: 'Priority' },
        { id: 'pending', label: 'Pending review' },
        { id: 'clarification', label: 'Clarification' },
    ];
    return (<DeskFrame role="officer" title="AICTE Reviewing Officer" lede="Review the demonstration queue, read the evidence for each finding, and record a note. Nothing here is an official order.">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Queue filters">
        {filters.map((item) => (<button key={item.id} type="button" aria-pressed={filter === item.id} className={filter === item.id ? buttonClass('primary') : buttonClass('secondary')} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <ul className="border border-line bg-white">
          {queue.length === 0 ? <li className="p-4 text-sm text-muted">No applications in this filter.</li> : queue.map((item) => (<li key={item.id}>
              <button type="button" className={cn('w-full border-b border-line px-3 py-3 text-left text-sm', selected?.id === item.id && 'bg-[#e8f1f8]')} onClick={() => { setSelectedId(item.id); setNotes(item.officerNotes ?? ''); setSaved(''); }}>
                <span className="block font-semibold text-navy">{item.institution.referenceNumber || item.id}</span>
                <span className="mt-1 block text-muted">{item.institution.name}</span>
                <span className="mt-1 block text-xs">{lifecycleLabel(item.lifecycle, lang)} · {item.priority === 'priority' ? 'Priority' : 'Routine'}</span>
              </button>
            </li>))}
        </ul>
        {selected ? (<div className="space-y-4">
            <section className="border border-line bg-white p-4">
              <h2 className="text-lg font-semibold text-navy">{selected.institution.name}</h2>
              <p className="mt-1 text-sm text-muted">{typeLabel(selected.type, lang)} · {selected.institution.permanentId}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className={buttonClass('secondary')} onClick={() => portal.setPriority(selected.id, selected.priority === 'priority' ? 'routine' : 'priority')}>
                  {selected.priority === 'priority' ? 'Mark routine' : 'Mark as priority'}
                </button>
                <Link className={buttonClass('secondary')} to={`/documents?application=${selected.id}`}>Document-level review</Link>
                <button type="button" className={buttonClass('secondary')} onClick={() => setAsk(true)}>Request clarification</button>
              </div>
            </section>
            <p className="text-sm text-muted">Accept keeps the finding on the review record. Reject marks it as not accepted by the officer. Neither action verifies a document with an issuing authority.</p>
            <FindingsTable checks={selected.checks} onDecide={(checkId, decision) => portal.decide(selected.id, checkId, decision)}/>
            <section className="border border-line bg-white p-4">
              <label htmlFor="officer-notes" className="mb-1 block text-sm font-semibold">Final review notes</label>
              <textarea id="officer-notes" className={inputClass} rows={4} value={notes} onChange={(event) => setNotes(event.target.value)}/>
              <button type="button" className={`${buttonClass('primary')} mt-3`} onClick={() => { portal.saveNotes(selected.id, notes); setSaved('Notes saved in this browser session only. This is not an official order.'); }}>
                Record review notes
              </button>
              {saved ? <div className="mt-3"><Banner tone="success">{saved}</Banner></div> : null}
            </section>
          </div>) : null}
      </div>
      {ask && selected ? (<section className="mt-4 border border-line bg-white p-4">
          <h2 className="text-lg font-semibold text-navy">Request clarification</h2>
          <p className="mt-1 text-sm text-muted">The message stays in this demonstration and appears on the applicant desk. It is not sent to an official mailbox.</p>
          <label htmlFor="clarification" className="mt-3 mb-1 block text-sm font-semibold">Clarification message</label>
          <textarea id="clarification" className={inputClass} rows={4} value={message} onChange={(event) => setMessage(event.target.value)}/>
          {askError ? <p className="mt-2 text-sm text-danger" role="alert">{askError}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" className={buttonClass('primary')} onClick={() => {
                if (message.trim().length < 8) {
                    setAskError('Enter at least 8 characters so the institution knows what to provide.');
                    return;
                }
                portal.addClarification(selected.id, 'officer', message.trim());
                setMessage('');
                setAskError('');
                setAsk(false);
                setSaved('Clarification recorded in this browser session.');
            }}>
              Record request
            </button>
            <button type="button" className={buttonClass('secondary')} onClick={() => { setAsk(false); setAskError(''); }}>
              Cancel
            </button>
          </div>
        </section>) : null}
    </DeskFrame>);
}
