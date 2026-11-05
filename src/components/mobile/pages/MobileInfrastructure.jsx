import { EvidenceScene } from '../../documents/Facsimile.jsx';
import { StatusBadge } from '../../feedback/Feedback.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { BtnLink, Notice, Screen } from '../MobileUi.jsx';

export function MobileInfrastructure() {
    const { lang } = useLanguage();
    const portal = usePortal();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'अवसंरचना साक्ष्य' : 'Infrastructure Evidence');
    const items = portal.applications.flatMap((application) => application.documents
        .filter((document) => document.category === 'infrastructure' || document.preview === 'scene')
        .map((document) => ({ application, document })));
    return (<Screen title={hi ? 'अवसंरचना साक्ष्य समीक्षा' : 'Infrastructure Evidence Review'} lede={hi ? 'तस्वीरें स्थान दिखा सकती हैं। वे क्षेत्र, सुरक्षा या उपकरण सिद्ध नहीं करतीं।' : 'Photographs can show a space. They do not establish area, safety, or equipment.'}>
      <Notice tone="warning">Every image here needs Manual Review. This prototype does not confirm a building from a picture.</Notice>
      {items.length === 0 ? (<div className="m-card">
          <h2>No infrastructure evidence</h2>
          <p className="m-muted">Upload a photograph under Infrastructure Evidence in the verification workflow.</p>
          <div style={{ marginTop: '0.8rem' }}><BtnLink to="/verify">Validate now</BtnLink></div>
        </div>) : items.map(({ application, document }) => {
            const url = portal.urlFor(document.id);
            return (<article key={document.id} className="m-card">
              {url && document.mimeType.startsWith('image/') ? (<img className="m-photo" src={url} alt={document.name} style={{ width: '100%', maxHeight: '16rem', objectFit: 'contain', borderRadius: '12px', background: '#f4f7fa' }}/>) : (<EvidenceScene scene={document.scene}/>)}
              <h2 className="m-break" style={{ marginTop: '0.75rem' }}>{document.name}</h2>
              <p className="m-muted">{application.institution.name}</p>
              <StatusBadge status="manual-review"/>
              <p className="m-muted">The image is held for an officer to view. Occupancy, area, and equipment were not confirmed. Manual Review Required.</p>
              <BtnLink to={`/documents?application=${application.id}`} variant="secondary">Open document review</BtnLink>
            </article>);
        })}
    </Screen>);
}
