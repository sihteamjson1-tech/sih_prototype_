import { useState } from 'react';
import { StatusBadge } from '../../feedback/Feedback.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { lifecycleLabel } from '../../../utils/labels.js';
import { BtnLink, DeskGate, Notice, Screen } from '../MobileUi.jsx';

export function MobileApplicant() {
    const { lang } = useLanguage();
    const portal = usePortal();
    usePageTitle('Applicant desk');
    const [applicationId, setApplicationId] = useState(portal.clarifications[0]?.applicationId ?? portal.applications[0]?.id ?? '');
    const [reply, setReply] = useState('');
    const [note, setNote] = useState('');
    const application = portal.applications.find((item) => item.id === applicationId);
    const messages = portal.clarifications.filter((item) => item.applicationId === applicationId);
    const missing = application?.checks.filter((item) => item.result === 'missing' || item.result === 'expired' || item.result === 'mismatch') ?? [];
    return (<Screen kicker="Demonstration desk" title="Institution Applicant" lede="Create an application, see what is still missing, and respond to clarification requests in this demonstration.">
      <DeskGate role="applicant"/>
      <div className="m-actions">
        <BtnLink to="/verify">Create application</BtnLink>
        <BtnLink to="/track" variant="secondary">Track application status</BtnLink>
      </div>
      <div className="m-field">
        <label className="m-label" htmlFor="mobile-applicant-app">Application</label>
        <select id="mobile-applicant-app" className="m-input" value={applicationId} onChange={(event) => setApplicationId(event.target.value)}>
          {portal.applications.map((item) => (<option key={item.id} value={item.id}>{item.institution.referenceNumber || item.id} — {lifecycleLabel(item.lifecycle, lang)}</option>))}
        </select>
      </div>
      {application ? (<>
          <section className="m-card">
            <h2>Missing requirements</h2>
            {missing.length === 0 ? <p className="m-muted">No mismatch, expiry, or missing-information findings on this application.</p> : (<ul className="m-plain m-stack">
                {missing.map((item) => (<li key={item.id}>
                    <div className="m-split">
                      <p className="m-row-title m-break" style={{ margin: 0 }}>{item.document}</p>
                      <StatusBadge status={item.result}/>
                    </div>
                    <p className="m-muted">{item.evidence}</p>
                  </li>))}
              </ul>)}
            <div style={{ marginTop: '0.8rem' }}>
              <BtnLink to={`/verify?application=${application.id}`} variant="secondary">Review validation findings</BtnLink>
            </div>
          </section>
          <section className="m-card m-form">
            <h2>Clarification requests</h2>
            {messages.length === 0 ? <p className="m-muted">No clarification requests.</p> : (<ul className="m-plain m-stack">
                {messages.map((item) => (<li key={item.id}>
                    <p className="m-muted">{item.author === 'officer' ? 'Reviewing officer' : 'Applicant'}</p>
                    <p style={{ margin: '0.2rem 0 0' }}>{item.message}</p>
                  </li>))}
              </ul>)}
            <label className="m-label" htmlFor="mobile-reply">Response</label>
            <textarea id="mobile-reply" className="m-input" rows={4} value={reply} onChange={(event) => setReply(event.target.value)}/>
            <button type="button" className="m-btn m-btn-primary" onClick={() => {
                if (reply.trim().length < 8)
                    return;
                portal.addClarification(application.id, 'applicant', reply.trim());
                setReply('');
                setNote('Response recorded in this browser session.');
            }}>Send response</button>
            {note ? <Notice tone="success">{note}</Notice> : null}
          </section>
        </>) : null}
    </Screen>);
}
