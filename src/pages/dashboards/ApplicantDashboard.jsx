import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeskFrame } from '../../components/dashboards/DeskFrame.jsx';
import { Banner, StatusBadge } from '../../components/feedback/Feedback.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { usePortal } from '../../context/PortalContext.jsx';
import { usePageTitle } from '../../hooks/usePageTitle.js';
import { buttonClass, inputClass } from '../../utils/format.js';
import { lifecycleLabel } from '../../utils/labels.js';
export function ApplicantDashboard() {
    const { lang } = useLanguage();
    const portal = usePortal();
    usePageTitle('Applicant desk');
    const [applicationId, setApplicationId] = useState(portal.clarifications[0]?.applicationId ?? portal.applications[0]?.id ?? '');
    const [reply, setReply] = useState('');
    const [note, setNote] = useState('');
    const application = portal.applications.find((item) => item.id === applicationId);
    const messages = portal.clarifications.filter((item) => item.applicationId === applicationId);
    const missing = application?.checks.filter((item) => item.result === 'missing' || item.result === 'expired' || item.result === 'mismatch') ?? [];
    return (<DeskFrame role="applicant" title="Institution Applicant" lede="Create an application, see what is still missing, and respond to clarification requests in this demonstration.">
      <div className="mb-4 flex flex-wrap gap-3">
        <Link className={buttonClass('primary')} to="/verify">Create application</Link>
        <Link className={buttonClass('secondary')} to="/track">Track application status</Link>
      </div>
      <label htmlFor="applicant-app" className="mb-1 block text-sm font-semibold">Application</label>
      <select id="applicant-app" className="mb-4 min-w-72 rounded-sm border border-line bg-white px-3 py-2 text-sm" value={applicationId} onChange={(event) => setApplicationId(event.target.value)}>
        {portal.applications.map((item) => (<option key={item.id} value={item.id}>{item.institution.referenceNumber || item.id} — {lifecycleLabel(item.lifecycle, lang)}</option>))}
      </select>
      {application ? (<div className="grid gap-4 lg:grid-cols-2">
          <section className="border border-line bg-white p-4">
            <h2 className="text-lg font-semibold text-navy">Missing requirements</h2>
            {missing.length === 0 ? <p className="mt-2 text-sm text-muted">No mismatch, expiry, or missing-information findings on this application.</p> : (<ul className="mt-3 space-y-3">
                {missing.map((item) => (<li key={item.id} className="border border-line p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{item.document}</p>
                      <StatusBadge status={item.result}/>
                    </div>
                    <p className="mt-2 leading-6">{item.evidence}</p>
                  </li>))}
              </ul>)}
            <Link className="mt-4 inline-block text-sm font-semibold text-blue hover:underline" to={`/verify?application=${application.id}`}>Review validation findings</Link>
          </section>
          <section className="border border-line bg-white p-4">
            <h2 className="text-lg font-semibold text-navy">Clarification requests</h2>
            {messages.length === 0 ? <p className="mt-2 text-sm text-muted">No clarification requests.</p> : (<ul className="mt-3 space-y-3">
                {messages.map((item) => (<li key={item.id} className="border border-line p-3 text-sm">
                    <p className="text-xs font-semibold text-muted">{item.author === 'officer' ? 'Reviewing officer' : 'Applicant'}</p>
                    <p className="mt-1 leading-6">{item.message}</p>
                  </li>))}
              </ul>)}
            <label htmlFor="reply" className="mt-4 mb-1 block text-sm font-semibold">Response</label>
            <textarea id="reply" className={inputClass} rows={4} value={reply} onChange={(event) => setReply(event.target.value)}/>
            <button type="button" className={`${buttonClass('primary')} mt-3`} onClick={() => {
                if (reply.trim().length < 8)
                    return;
                portal.addClarification(application.id, 'applicant', reply.trim());
                setReply('');
                setNote('Response recorded in this browser session.');
            }}>
              Send response
            </button>
            {note ? <div className="mt-3"><Banner tone="success">{note}</Banner></div> : null}
          </section>
        </div>) : null}
    </DeskFrame>);
}
