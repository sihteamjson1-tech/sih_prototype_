import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../feedback/Feedback.jsx';
import { DEMO_PASSWORD } from '../../services/demoData.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import { roleLabel } from '../../utils/labels.js';

export function Screen({ kicker, title, lede, children }) {
    return (<section>
      <header className="m-screen-head">
        {kicker ? <p className="m-kicker">{kicker}</p> : null}
        <h1>{title}</h1>
        {lede ? <p>{lede}</p> : null}
      </header>
      <div className="m-stack">{children}</div>
    </section>);
}

export function Notice({ tone = 'info', children }) {
    return <div className={`m-notice m-notice-${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>{children}</div>;
}

export function BtnLink({ to, variant = 'primary', children }) {
    return <Link className={`m-btn m-btn-${variant}`} to={to}>{children}</Link>;
}

export function RowLink({ to, icon: Icon, title, text }) {
    return (<Link className="m-row" to={to}>
      <span className="m-row-icon" aria-hidden="true"><Icon size={18}/></span>
      <span>
        <span className="m-row-title">{title}</span>
        {text ? <span className="m-row-text">{text}</span> : null}
      </span>
      <ChevronRight size={18} aria-hidden="true"/>
    </Link>);
}

export function StatGrid({ items }) {
    return (<div className="m-stats">
      {items.map((item) => (<article key={item.label} className="m-stat">
          <p className="m-stat-value">{item.value}</p>
          <p className="m-stat-label">{item.label}</p>
          {item.note ? <p className="m-stat-note">{item.note}</p> : null}
        </article>))}
    </div>);
}

export function FindingCards({ checks, onDecide }) {
    if (!checks.length) {
        return <p className="m-muted">No findings recorded for this view.</p>;
    }
    return (<ul className="m-plain m-stack" style={{ marginTop: 0 }}>
      {checks.map((check) => (<li key={check.id} className="m-card">
          <div className="m-split">
            <h3 className="m-break" style={{ margin: 0, fontSize: '0.98rem' }}>{check.document}</h3>
            <StatusBadge status={check.result}/>
          </div>
          <p className="m-muted" style={{ marginTop: '0.45rem' }}>{check.check}</p>
          <p style={{ margin: '0.45rem 0 0', fontSize: '0.9rem', lineHeight: 1.5 }}>{check.evidence}</p>
          <p className="m-muted" style={{ marginTop: '0.4rem' }}>{check.action}</p>
          {onDecide ? (<div className="m-actions" style={{ marginTop: '0.75rem' }}>
              <p className="m-muted">
                {check.reviewerDecision === 'accepted'
                    ? 'Accepted on the review record.'
                    : check.reviewerDecision === 'rejected'
                        ? 'Rejected on the review record.'
                        : 'No officer decision yet.'}
              </p>
              <button type="button" className="m-btn m-btn-secondary" onClick={() => onDecide(check.id, 'accepted')}>Accept finding</button>
              <button type="button" className="m-btn m-btn-danger" onClick={() => onDecide(check.id, 'rejected')}>Reject finding</button>
            </div>) : null}
        </li>))}
    </ul>);
}

export function DeskGate({ role }) {
    const { lang } = useLanguage();
    const { user, login } = useSession();
    return (<>
      <Notice tone="warning">
        Demonstration desk for the {roleLabel(role, lang)}. Role selection in this SIH prototype is not access control. In production, enforce permissions on the server.
      </Notice>
      {user?.role !== role ? (<button type="button" className="m-btn m-btn-secondary" onClick={() => login(role, DEMO_PASSWORD)}>
          Enter this demonstration desk
        </button>) : (<p className="m-muted">Signed in as {user.name}.</p>)}
    </>);
}

export function summaryStats(application) {
    const checks = application?.checks ?? [];
    return [
        { label: 'Documents', value: application?.documents.length ?? 0, note: 'Files recorded on this application.' },
        { label: 'Checks passed', value: checks.filter((item) => item.result === 'verified').length, note: 'Format or completeness only.' },
        { label: 'Issues', value: checks.filter((item) => item.result === 'mismatch' || item.result === 'missing' || item.result === 'expired').length, note: 'Mismatch, missing, or expired.' },
        { label: 'Manual review', value: checks.filter((item) => item.result === 'manual-review' || item.result === 'pending' || item.result === 'source-unavailable').length, note: 'Pending or unavailable sources.' },
    ];
}
