import { cn } from '../../utils/format.js';
export function Container({ children, className }) {
    return <div className={cn('mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}
export function Emblem({ className = 'h-14 w-14' }) {
    return (<svg viewBox="0 0 64 64" className={className} role="img" aria-label="Institutional emblem placeholder">
      <circle cx="32" cy="32" r="30" fill="#ffffff" stroke="#123B63" strokeWidth="2"/>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#1B5E91" strokeWidth="1"/>
      <path d="M18 40h28M22 40V30h6v10M30 40V26h6v14M38 40V28h6v12" fill="none" stroke="#123B63" strokeWidth="1.6"/>
      <path d="M20 30h8l-4-4-4 4zM28 26h8l-4-4-4 4zM36 28h8l-4-4-4 4z" fill="#E89B3C"/>
    </svg>);
}
export function TricolourMark() {
    return (<span className="inline-flex h-3.5 w-5 shrink-0 overflow-hidden border border-white/40" aria-hidden="true">
      <span className="h-full w-1/3 bg-[#FF9933]"/>
      <span className="h-full w-1/3 bg-white"/>
      <span className="h-full w-1/3 bg-[#138808]"/>
    </span>);
}
