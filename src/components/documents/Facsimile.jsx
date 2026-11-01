export function EvidenceScene({ scene }) {
    const title = scene === 'workshop' ? 'Workshop bay' : scene === 'library' ? 'Library hall' : 'Laboratory block';
    return (<svg viewBox="0 0 640 420" className="h-auto w-full bg-[#e7eef5]" role="img" aria-label={`${title} demonstration image placeholder`}>
      <rect width="640" height="420" fill="#e7eef5"/>
      <rect x="70" y="250" width="500" height="120" fill="#d5e0ea"/>
      <rect x="110" y="150" width="180" height="180" fill="#f7fafc" stroke="#123B63"/>
      <rect x="300" y="180" width="210" height="150" fill="#f7fafc" stroke="#123B63"/>
      <path d="M110 150 L200 90 L290 150" fill="#123B63"/>
      <rect x="150" y="210" width="40" height="70" fill="#1B5E91"/>
      <rect x="340" y="220" width="130" height="12" fill="#D9E2EC"/>
      <rect x="340" y="246" width="100" height="12" fill="#D9E2EC"/>
      <text x="70" y="40" fill="#123B63" fontSize="18" fontFamily="Inter, sans-serif">
        Demonstration image placeholder
      </text>
      <text x="70" y="66" fill="#64748B" fontSize="14" fontFamily="Inter, sans-serif">
        {title} — not a photograph of a real campus
      </text>
    </svg>);
}
export function Facsimile({ document, application, page, activeKey, }) {
    const facts = document.sampleFacts;
    const highlight = (key) => (activeKey === key ? 'bg-[#fff4e2] outline outline-2 outline-[#E89B3C]' : '');
    return (<article className="relative min-h-[520px] border border-line bg-white p-6 text-ink shadow-sm">
      <p className="pointer-events-none absolute top-24 right-6 left-6 -rotate-12 text-center text-3xl font-semibold tracking-wide text-[#b42332]/15">
        DEMONSTRATION ONLY
      </p>
      <p className="text-xs font-semibold tracking-wide text-danger">SAMPLE DOCUMENT — NOT AN OFFICIAL CERTIFICATE</p>
      <h3 className="mt-3 text-lg font-semibold text-navy">
        {document.category === 'faculty'
            ? 'Sample faculty list'
            : document.category === 'accreditation'
                ? 'Sample accreditation page'
                : document.category === 'land-building'
                    ? 'Sample land extract'
                    : 'Sample approval letter'}
      </h3>
      <p className="mt-1 text-xs text-muted">Page {page + 1}. Prepared for the SIH prototype. It confers no approval.</p>
      {page === 0 ? (<dl className="mt-6 space-y-3 text-sm">
          <div className={highlight('institution')}>
            <dt className="text-xs text-muted">Institution named on this sample</dt>
            <dd>{facts?.institutionName ?? application.institution.name}</dd>
          </div>
          <div className={highlight('number')}>
            <dt className="text-xs text-muted">Sample reference</dt>
            <dd>{facts?.certificateNumber ?? 'Not printed'}</dd>
          </div>
          <div className={highlight('issuer')}>
            <dt className="text-xs text-muted">Printed issuer</dt>
            <dd>{facts?.issuer ?? 'Demonstration desk — not an issuing authority'}</dd>
          </div>
          <div className={highlight('issued')}>
            <dt className="text-xs text-muted">Issue date</dt>
            <dd>{facts?.issueDate ?? 'Not printed'}</dd>
          </div>
          <div className={highlight('expiry')}>
            <dt className="text-xs text-muted">End date</dt>
            <dd>{facts?.expiryDate ?? 'Not printed'}</dd>
          </div>
          <div className={highlight('pid')}>
            <dt className="text-xs text-muted">Identifier</dt>
            <dd>{facts?.permanentId ?? application.institution.permanentId}</dd>
          </div>
          {facts?.intake !== undefined ? (<div className={highlight('intake')}>
              <dt className="text-xs text-muted">Sanctioned intake printed on the sample</dt>
              <dd>{facts.intake}</dd>
            </div>) : null}
          {facts?.facultyCount !== undefined ? (<div className={highlight('faculty')}>
              <dt className="text-xs text-muted">Faculty rows printed on the sample</dt>
              <dd>{facts.facultyCount} placeholder rows (name and designation only)</dd>
            </div>) : null}
          {facts?.note ? (<div className={highlight('note')}>
              <dt className="text-xs text-muted">Note printed on the sample</dt>
              <dd>{facts.note}</dd>
            </div>) : null}
        </dl>) : (<div className="mt-6 space-y-3 text-sm leading-6">
          <p className="font-semibold text-navy">Sample conditions page</p>
          <p>This second page exists so page navigation can be demonstrated. It is not a set of approval conditions.</p>
          <p>Any real condition would have to be read from an authorised order. None is reproduced here.</p>
        </div>)}
    </article>);
}
