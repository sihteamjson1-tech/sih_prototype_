export function HeroPreview() {
    const rows = [
        ['Institution name', 'Present'],
        ['Identifier format', 'Format only'],
        ['Accreditation date', 'Needs review'],
        ['Issuing source', 'Unavailable'],
    ];
    return (<div className="border border-line bg-white shadow-[0_1px_2px_rgba(18,59,99,0.06)]" aria-hidden="true">
      <div className="flex items-center justify-between border-b border-line bg-[#e8eef4] px-4 py-2 text-xs font-semibold text-navy">
        <span>Verification preview</span>
        <span className="border border-line bg-white px-2 py-0.5 font-medium text-muted">Demonstration</span>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="relative border border-line bg-canvas p-4">
          <span className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-navy"/>
          <span className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-navy"/>
          <span className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-navy"/>
          <span className="absolute right-2 bottom-2 h-4 w-4 border-r-2 border-b-2 border-navy"/>
          <p className="text-[10px] font-semibold tracking-wide text-muted">SAMPLE DOCUMENT</p>
          <p className="mt-3 text-sm font-semibold text-navy">Approval letter</p>
          <div className="mt-3 space-y-2">
            <div className="h-2 w-11/12 bg-[#d9e2ec]"/>
            <div className="h-2 w-9/12 bg-[#d9e2ec]"/>
            <div className="h-2 w-10/12 bg-[#d9e2ec]"/>
            <div className="mt-3 border border-saffron/70 bg-[#fff8ef] px-2 py-1 text-[11px] text-ink">
              Identifier extracted for review
            </div>
            <div className="h-2 w-8/12 bg-[#d9e2ec]"/>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted">COMPLIANCE SNAPSHOT</p>
          <ul className="mt-3 divide-y divide-line border border-line">
            {rows.map(([label, value]) => (<li key={label} className="flex items-center justify-between gap-3 px-2 py-2 text-xs">
                <span className="text-ink">{label}</span>
                <span className="font-semibold text-navy">{value}</span>
              </li>))}
          </ul>
          <p className="mt-3 text-[11px] leading-5 text-muted">
            Preview only. Findings stay advisory until an authorised officer reviews them.
          </p>
        </div>
      </div>
    </div>);
}
