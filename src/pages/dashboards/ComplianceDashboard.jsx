import { Link } from 'react-router-dom';
import { DeskFrame } from '../../components/dashboards/DeskFrame.jsx';
import { StatusBadge } from '../../components/feedback/Feedback.jsx';
import { usePortal } from '../../context/PortalContext.jsx';
import { usePageTitle } from '../../hooks/usePageTitle.js';
import { complianceRows } from '../../services/complianceService.js';
import { buttonClass } from '../../utils/format.js';
export function ComplianceDashboard() {
    const portal = usePortal();
    usePageTitle('Compliance desk');
    const evaluated = portal.applications.map((application) => ({
        application,
        rows: complianceRows(application, portal.rules),
    }));
    const nonCompliant = evaluated.flatMap((item) => item.rows
        .filter((row) => row.result === 'mismatch' || row.result === 'expired' || row.result === 'missing')
        .map((row) => ({ ...row, reference: item.application.institution.referenceNumber || item.application.id, applicationId: item.application.id })));
    return (<DeskFrame role="compliance" title="Compliance Officer" lede="Review the demonstration checklist, missing or expired evidence, and cross-record inconsistencies.">
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <article className="border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">Enabled rules</h2>
          <p className="mt-2 text-3xl font-semibold">{portal.rules.filter((rule) => rule.enabled).length}</p>
        </article>
        <article className="border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">Open checklist items</h2>
          <p className="mt-2 text-3xl font-semibold">{nonCompliant.length}</p>
        </article>
        <article className="border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">Infrastructure files</h2>
          <p className="mt-2 text-3xl font-semibold">{portal.applications.reduce((sum, item) => sum + item.documents.filter((document) => document.category === 'infrastructure').length, 0)}</p>
        </article>
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <Link className={buttonClass('primary')} to="/compliance">Open compliance checker</Link>
        <Link className={buttonClass('secondary')} to="/infrastructure">Infrastructure evidence review</Link>
        <Link className={buttonClass('secondary')} to="/reports">Compliance summary reports</Link>
      </div>
      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Open compliance items</caption>
          <thead className="bg-[#e8eef4] text-navy">
            <tr>
              <th scope="col" className="px-3 py-2">Requirement</th>
              <th scope="col" className="px-3 py-2">Application</th>
              <th scope="col" className="px-3 py-2">Status</th>
              <th scope="col" className="px-3 py-2">Explanation</th>
            </tr>
          </thead>
          <tbody>
            {nonCompliant.map((row) => (<tr key={`${row.applicationId}-${row.id}`} className="border-t border-line align-top">
                <th scope="row" className="px-3 py-3">{row.ruleId ?? row.document}</th>
                <td className="px-3 py-3">{row.reference}</td>
                <td className="px-3 py-3"><StatusBadge status={row.result}/></td>
                <td className="px-3 py-3 leading-6">{row.evidence}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </DeskFrame>);
}
