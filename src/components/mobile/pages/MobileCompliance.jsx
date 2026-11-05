import { useMemo, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { complianceRows, matchesFilter } from '../../../services/complianceService.js';
import { BtnLink, FindingCards, Notice, Screen } from '../MobileUi.jsx';

const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'compliant', label: 'Compliant' },
    { id: 'non-compliant', label: 'Non-compliant' },
    { id: 'missing', label: 'Missing' },
    { id: 'manual', label: 'Manual' },
];

export function MobileCompliance() {
    const { lang } = useLanguage();
    const portal = usePortal();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'अनुपालन जाँच' : 'Compliance Checker');
    const [applicationId, setApplicationId] = useState(portal.applications.find((item) => item.scenario)?.id ?? portal.applications[0]?.id ?? '');
    const [filter, setFilter] = useState('all');
    const application = portal.applications.find((item) => item.id === applicationId) ?? portal.applications[0];
    const rows = useMemo(() => (application ? complianceRows(application, portal.rules) : []), [application, portal.rules]);
    const visible = rows.filter((row) => matchesFilter(row.result, filter));
    const disabled = portal.rules.filter((rule) => !rule.enabled).length;
    return (<Screen title={hi ? 'अनुपालन जाँच' : 'Compliance Checker'} lede={hi ? 'यह चेकलिस्ट प्रदर्शन डेटा है, जब तक कि इसे अधिकृत स्रोत से न लाया जाए।' : 'The requirements below are demonstration data unless a verified regulatory source has been loaded.'}>
      <Notice tone="warning">
        Requirement IDs beginning with DEMO- are prototype checklist items. They are not official AICTE norms. Manual review includes pending verification and source-unavailable results.
      </Notice>
      <div className="m-field">
        <label className="m-label" htmlFor="mobile-compliance-app">Application</label>
        <select id="mobile-compliance-app" className="m-input" value={application?.id ?? ''} onChange={(event) => setApplicationId(event.target.value)}>
          {portal.applications.map((item) => (<option key={item.id} value={item.id}>{item.institution.referenceNumber || item.id}</option>))}
        </select>
      </div>
      <div className="m-chips" role="group" aria-label="Requirement filters">
        {FILTERS.map((item) => (<button key={item.id} type="button" className="m-chip" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label} {item.id === 'all' ? rows.length : rows.filter((row) => matchesFilter(row.result, item.id)).length}
          </button>))}
      </div>
      {disabled > 0 ? <p className="m-muted">{disabled} disabled demonstration rule{disabled === 1 ? '' : 's'} hidden. An administrator can turn them back on in this prototype.</p> : null}
      {application ? <FindingCards checks={visible}/> : <p className="m-muted">No application is available.</p>}
      <BtnLink to="/dashboard/admin" variant="secondary">Configure demonstration rules</BtnLink>
    </Screen>);
}
