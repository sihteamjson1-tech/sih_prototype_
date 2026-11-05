import { StatusBadge } from '../../feedback/Feedback.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { complianceRows } from '../../../services/complianceService.js';
import { BtnLink, DeskGate, Screen, StatGrid } from '../MobileUi.jsx';

export function MobileComplianceDesk() {
    const portal = usePortal();
    usePageTitle('Compliance desk');
    const evaluated = portal.applications.map((application) => ({
        application,
        rows: complianceRows(application, portal.rules),
    }));
    const nonCompliant = evaluated.flatMap((item) => item.rows
        .filter((row) => row.result === 'mismatch' || row.result === 'expired' || row.result === 'missing')
        .map((row) => ({ ...row, reference: item.application.institution.referenceNumber || item.application.id, applicationId: item.application.id })));
    const infrastructure = portal.applications.reduce((sum, item) => sum + item.documents.filter((document) => document.category === 'infrastructure').length, 0);
    return (<Screen kicker="Demonstration desk" title="Compliance Officer" lede="Review the demonstration checklist, missing or expired evidence, and cross-record inconsistencies.">
      <DeskGate role="compliance"/>
      <StatGrid items={[
            { label: 'Enabled rules', value: portal.rules.filter((rule) => rule.enabled).length, note: 'Active demonstration checks' },
            { label: 'Open items', value: nonCompliant.length, note: 'Missing, expired, or mismatch' },
            { label: 'Infrastructure', value: infrastructure, note: 'Files held for review' },
            { label: 'Applications', value: portal.applications.length, note: 'Records in this session' },
        ]}/>
      <div className="m-actions">
        <BtnLink to="/compliance">Open compliance checker</BtnLink>
        <BtnLink to="/infrastructure" variant="secondary">Infrastructure evidence</BtnLink>
        <BtnLink to="/reports" variant="secondary">Compliance summary reports</BtnLink>
      </div>
      <ul className="m-plain m-stack" style={{ marginTop: 0 }}>
        {nonCompliant.map((row) => (<li key={`${row.applicationId}-${row.id}`} className="m-card">
            <div className="m-split">
              <h2 className="m-break">{row.ruleId ?? row.document}</h2>
              <StatusBadge status={row.result}/>
            </div>
            <p className="m-muted">{row.reference}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', lineHeight: 1.5 }}>{row.evidence}</p>
          </li>))}
      </ul>
    </Screen>);
}
