import { Link } from 'react-router-dom';
import { cn } from '../../utils/format.js';
export function StatusBadge({ status }) {
    const tone = tones[status] ?? tones['manual-review'];
    return (<span className={cn('inline-flex items-center gap-1.5 border px-2 py-1 text-xs font-semibold', tone.className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} aria-hidden="true"/>
      {tone.label}
    </span>);
}
const tones = {
    verified: { label: 'Verified', className: 'border-[#23834B] bg-[#E7F5EC] text-[#145C32]', dot: 'bg-success' },
    mismatch: { label: 'Mismatch Detected', className: 'border-danger bg-[#FDECEE] text-[#7F1824]', dot: 'bg-danger' },
    missing: { label: 'Missing Information', className: 'border-warning bg-[#FBF6EA] text-[#6B4E00]', dot: 'bg-warning' },
    expired: { label: 'Expired', className: 'border-danger bg-[#FDECEE] text-[#7F1824]', dot: 'bg-danger' },
    pending: { label: 'Pending Verification', className: 'border-blue bg-[#E8F1F8] text-navy', dot: 'bg-blue' },
    'source-unavailable': {
        label: 'Source Unavailable',
        className: 'border-[#64748B] bg-canvas text-ink',
        dot: 'bg-muted',
    },
    'manual-review': {
        label: 'Manual Review Required',
        className: 'border-saffron bg-[#FBF3E8] text-[#6A4510]',
        dot: 'bg-saffron',
    },
};
export function Banner({ children, tone = 'info', }) {
    const border = tone === 'success' ? 'border-success' : tone === 'danger' ? 'border-danger' : tone === 'warning' ? 'border-saffron' : 'border-blue';
    return <div className={cn('border border-line border-l-4 bg-white px-4 py-3 text-sm text-ink', border)}>{children}</div>;
}
export function EmptyState({ title, text, action }) {
    return (<div className="border border-dashed border-line bg-white px-4 py-8 text-sm">
      <h2 className="text-base font-semibold text-navy">{title}</h2>
      <p className="mt-2 max-w-2xl text-muted">{text}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>);
}
export function LoadingState({ label }) {
    return (<div role="status" className="flex items-center gap-3 border border-line bg-white px-4 py-5 text-sm text-ink">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent motion-safe:animate-spin"/>
      {label}
    </div>);
}
export function PageHeader({ title, lede, crumbs, }) {
    return (<header className="mb-6">
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {crumbs.map((crumb, index) => (<li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {crumb.to ? (<Link className="text-blue hover:underline" to={crumb.to}>
                  {crumb.label}
                </Link>) : (<span aria-current="page">{crumb.label}</span>)}
            </li>))}
        </ol>
      </nav>
      <h1 className="text-2xl font-semibold text-navy sm:text-3xl">{title}</h1>
      {lede ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted sm:text-base">{lede}</p> : null}
    </header>);
}
