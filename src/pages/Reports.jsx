import { Link, useParams } from 'react-router-dom';
import { Banner, EmptyState, PageHeader } from '../components/feedback/Feedback.jsx';
import { Container } from '../components/layout/Chrome.jsx';
import { FindingsTable, SummaryCards } from '../components/tables/FindingsTable.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { usePortal } from '../context/PortalContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { buttonClass, formatWhen, safeFileName } from '../utils/format.js';
import { buildReport, downloadText } from '../utils/report.js';
export function Reports() {
    const { applicationId } = useParams();
    const { lang } = useLanguage();
    const portal = usePortal();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'रिपोर्ट' : 'Reports');
    const withChecks = portal.applications.filter((item) => item.checks.length > 0);
    const selected = portal.applications.find((item) => item.id === applicationId);
    return (<Container className="py-8">
      <PageHeader title={hi ? 'रिपोर्ट और ऑडिट ट्रेल' : 'Reports & Audit Trail'} lede={hi ? 'सत्यापन रिपोर्ट और इस सत्र में दर्ज कार्रवाइयाँ।' : 'Validation reports and actions recorded in this browser session.'} crumbs={[
            { label: hi ? 'मुख्य पृष्ठ' : 'Home', to: '/' },
            { label: hi ? 'रिपोर्ट' : 'Reports', to: '/reports' },
            ...(selected ? [{ label: selected.institution.referenceNumber || selected.id }] : []),
        ]}/>
      {!selected ? (<div className="space-y-6">
          {withChecks.length === 0 ? (<EmptyState title="No validation reports yet" text="Run validation on an application to create a report in this session." action={<Link className={buttonClass('primary')} to="/verify">Validate Now</Link>}/>) : (<div className="overflow-x-auto border border-line bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <caption className="sr-only">Validation reports</caption>
                <thead className="bg-[#e8eef4] text-navy">
                  <tr>
                    <th scope="col" className="px-3 py-2">Reference</th>
                    <th scope="col" className="px-3 py-2">Institution</th>
                    <th scope="col" className="px-3 py-2">Updated</th>
                    <th scope="col" className="px-3 py-2">Origin</th>
                    <th scope="col" className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {withChecks.map((item) => (<tr key={item.id} className="border-t border-line">
                      <th scope="row" className="px-3 py-3 font-semibold">{item.institution.referenceNumber || item.id}</th>
                      <td className="px-3 py-3">{item.institution.name}</td>
                      <td className="px-3 py-3">{formatWhen(item.updatedAt, lang)}</td>
                      <td className="px-3 py-3">{item.origin === 'api' ? 'Configured service' : 'Demonstration'}</td>
                      <td className="px-3 py-3"><Link className="font-semibold text-blue hover:underline" to={`/reports/${item.id}`}>View report</Link></td>
                    </tr>))}
                </tbody>
              </table>
            </div>)}
          <section>
            <h2 className="text-xl font-semibold text-navy">Audit trail</h2>
            <ul className="mt-3 divide-y divide-line border border-line bg-white">
              {portal.audit.map((event) => (<li key={event.id} className="px-4 py-3 text-sm">
                  <p className="font-semibold text-ink">{event.action}</p>
                  <p className="text-muted">{event.actor} · {formatWhen(event.at, lang)}</p>
                </li>))}
            </ul>
          </section>
        </div>) : (<div className="space-y-5">
          <Banner>
            {selected.origin === 'api' ? 'Report content returned through the local view of the service response.' : 'Demonstration report. It is not an official order.'} {selected.institution.name}.
          </Banner>
          <SummaryCards documents={selected.documents.length} passed={selected.checks.filter((item) => item.result === 'verified').length} issues={selected.checks.filter((item) => item.result === 'mismatch' || item.result === 'missing' || item.result === 'expired').length} manual={selected.checks.filter((item) => item.result === 'manual-review' || item.result === 'pending' || item.result === 'source-unavailable').length}/>
          <FindingsTable checks={selected.checks}/>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={buttonClass('primary')} onClick={() => downloadText(`Pramaan-${safeFileName(selected.institution.referenceNumber || selected.id)}.txt`, buildReport(selected, lang))}>
              Download Validation Report
            </button>
            <Link className={buttonClass('secondary')} to={`/documents?application=${selected.id}`}>View Detailed Findings</Link>
            <Link className={buttonClass('secondary')} to="/reports">All reports</Link>
          </div>
        </div>)}
    </Container>);
}
