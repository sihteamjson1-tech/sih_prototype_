import { StatusBadge } from '../feedback/Feedback.jsx';
import { buttonClass } from '../../utils/format.js';
export function FindingsTable({ checks, onDecide, }) {
    return (<div className="overflow-x-auto border border-line bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <caption className="sr-only">Validation findings</caption>
        <thead className="bg-[#e8eef4] text-navy">
          <tr>
            <th scope="col" className="px-3 py-3 font-semibold">Document / Requirement</th>
            <th scope="col" className="px-3 py-3 font-semibold">Check Performed</th>
            <th scope="col" className="px-3 py-3 font-semibold">Result</th>
            <th scope="col" className="px-3 py-3 font-semibold">Evidence / Reason</th>
            <th scope="col" className="px-3 py-3 font-semibold">Recommended Action</th>
            {onDecide ? <th scope="col" className="px-3 py-3 font-semibold">Officer record</th> : null}
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (<tr key={check.id} className="border-t border-line align-top">
              <th scope="row" className="px-3 py-3 font-semibold text-ink">{check.document}</th>
              <td className="px-3 py-3 text-ink">{check.check}</td>
              <td className="px-3 py-3"><StatusBadge status={check.result}/></td>
              <td className="px-3 py-3 leading-6 text-ink">{check.evidence}</td>
              <td className="px-3 py-3 leading-6 text-ink">{check.action}</td>
              {onDecide ? (<td className="px-3 py-3">
                  <p className="mb-2 text-xs text-muted">
                    {check.reviewerDecision === 'accepted'
                    ? 'Accepted on the review record.'
                    : check.reviewerDecision === 'rejected'
                        ? 'Rejected on the review record.'
                        : 'No officer decision yet.'}
                  </p>
                  <div className="flex flex-col gap-2">
                    <button type="button" className={buttonClass('secondary')} onClick={() => onDecide(check.id, 'accepted')}>
                      Accept finding
                    </button>
                    <button type="button" className={buttonClass('danger')} onClick={() => onDecide(check.id, 'rejected')}>
                      Reject finding
                    </button>
                  </div>
                </td>) : null}
            </tr>))}
        </tbody>
      </table>
    </div>);
}
export function SummaryCards({ documents, passed, issues, manual, }) {
    const cards = [
        ['Documents Submitted', documents, 'Files recorded on this application.'],
        ['Checks Passed', passed, 'Completeness or format checks only. Not authenticity.'],
        ['Issues Identified', issues, 'Mismatch, missing information, or expired dates.'],
        ['Manual Review Required', manual, 'Includes pending checks and unavailable sources.'],
    ];
    return (<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, note]) => (<article key={label} className="border border-line bg-white p-4">
          <p className="text-sm font-semibold text-navy">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
          <p className="mt-2 text-xs leading-5 text-muted">{note}</p>
        </article>))}
    </div>);
}
