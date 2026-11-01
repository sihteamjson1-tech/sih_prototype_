import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banner, PageHeader } from '../components/feedback/Feedback.jsx';
import { Container } from '../components/layout/Chrome.jsx';
import { FindingsTable } from '../components/tables/FindingsTable.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { usePortal } from '../context/PortalContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { complianceRows, matchesFilter } from '../services/complianceService.js';
import { buttonClass, cn } from '../utils/format.js';
const FILTERS = [
    { id: 'all', label: 'All requirements' },
    { id: 'compliant', label: 'Compliant' },
    { id: 'non-compliant', label: 'Non-compliant' },
    { id: 'missing', label: 'Missing evidence' },
    { id: 'manual', label: 'Manual review' },
];
export function ComplianceChecker() {
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
    return (<Container className="py-8">
      <PageHeader title={hi ? 'अनुपालन जाँच' : 'Compliance Checker'} lede={hi ? 'यह चेकलिस्ट प्रदर्शन डेटा है, जब तक कि इसे अधिकृत स्रोत से न लाया जाए।' : 'The requirements below are demonstration data unless a verified regulatory source has been loaded.'} crumbs={[{ label: hi ? 'मुख्य पृष्ठ' : 'Home', to: '/' }, { label: hi ? 'अनुपालन जाँच' : 'Compliance Checker' }]}/>
      <Banner tone="warning">
        Requirement IDs beginning with DEMO- are prototype checklist items. They are not official AICTE norms. Manual review includes pending verification and source-unavailable results.
      </Banner>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <label htmlFor="compliance-app" className="mb-1 block text-sm font-semibold">Application</label>
          <select id="compliance-app" className="min-w-72 rounded-sm border border-line bg-white px-3 py-2 text-sm" value={application?.id ?? ''} onChange={(event) => setApplicationId(event.target.value)}>
            {portal.applications.map((item) => (<option key={item.id} value={item.id}>{item.institution.referenceNumber || item.id}</option>))}
          </select>
        </div>
        <Link className={buttonClass('secondary')} to="/dashboard/admin">Configure demonstration rules</Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Requirement filters">
        {FILTERS.map((item) => (<button key={item.id} type="button" aria-pressed={filter === item.id} className={cn(filter === item.id ? buttonClass('primary') : buttonClass('secondary'))} onClick={() => setFilter(item.id)}>
            {item.label}
            <span className="font-medium">
              {item.id === 'all' ? rows.length : rows.filter((row) => matchesFilter(row.result, item.id)).length}
            </span>
          </button>))}
      </div>
      {disabled > 0 ? <p className="mt-3 text-sm text-muted">{disabled} disabled demonstration rule{disabled === 1 ? '' : 's'} hidden. An administrator can turn them back on in this prototype.</p> : null}
      <div className="mt-4">
        {application ? (<FindingsTable checks={visible}/>) : (<p className="text-sm text-muted">No application is available.</p>)}
      </div>
    </Container>);
}
