import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { formatWhen, safeFileName } from '../../../utils/format.js';
import { buildReport, downloadText } from '../../../utils/report.js';
import { BtnLink, FindingCards, Notice, Screen, StatGrid, summaryStats } from '../MobileUi.jsx';

export function MobileReports() {
    const { applicationId } = useParams();
    const { lang } = useLanguage();
    const portal = usePortal();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'रिपोर्ट' : 'Reports');
    const withChecks = portal.applications.filter((item) => item.checks.length > 0);
    const selected = portal.applications.find((item) => item.id === applicationId);
    return (<Screen title={hi ? 'रिपोर्ट और ऑडिट ट्रेल' : 'Reports & Audit Trail'} lede={hi ? 'सत्यापन रिपोर्ट और इस सत्र में दर्ज कार्रवाइयाँ।' : 'Validation reports and actions recorded in this browser session.'}>
      {!selected ? (<>
          {withChecks.length === 0 ? (<div className="m-card">
              <h2>No validation reports yet</h2>
              <p className="m-muted">Run validation on an application to create a report in this session.</p>
              <div style={{ marginTop: '0.8rem' }}><BtnLink to="/verify">Validate now</BtnLink></div>
            </div>) : (<ul className="m-plain m-stack" style={{ marginTop: 0 }}>
              {withChecks.map((item) => (<li key={item.id}>
                  <Link className="m-card" style={{ display: 'block', textDecoration: 'none' }} to={`/reports/${item.id}`}>
                    <span className="m-row-title m-break">{item.institution.referenceNumber || item.id}</span>
                    <span className="m-row-text">{item.institution.name}</span>
                    <span className="m-row-text">{formatWhen(item.updatedAt, lang)} · {item.origin === 'api' ? 'Configured service' : 'Demonstration'}</span>
                  </Link>
                </li>))}
            </ul>)}
          <section className="m-card">
            <h2>Audit trail</h2>
            <ul className="m-plain m-stack">
              {portal.audit.map((event) => (<li key={event.id}>
                  <p style={{ margin: 0 }}>{event.action}</p>
                  <p className="m-muted">{event.actor} · {formatWhen(event.at, lang)}</p>
                </li>))}
            </ul>
          </section>
        </>) : (<>
          <Notice>
            {selected.origin === 'api' ? 'Report content returned through the local view of the service response.' : 'Demonstration report. It is not an official order.'} {selected.institution.name}.
          </Notice>
          <StatGrid items={summaryStats(selected)}/>
          <FindingCards checks={selected.checks}/>
          <div className="m-actions">
            <button type="button" className="m-btn m-btn-primary" onClick={() => downloadText(`Pramaan-${safeFileName(selected.institution.referenceNumber || selected.id)}.txt`, buildReport(selected, lang))}>
              Download validation report
            </button>
            <BtnLink to={`/documents?application=${selected.id}`} variant="secondary">View detailed findings</BtnLink>
            <BtnLink to="/reports" variant="secondary">All reports</BtnLink>
          </div>
        </>)}
    </Screen>);
}
