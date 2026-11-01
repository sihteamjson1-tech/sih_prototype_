import { Link } from 'react-router-dom';
import { EvidenceScene } from '../components/documents/Facsimile.jsx';
import { Banner, EmptyState, PageHeader, StatusBadge } from '../components/feedback/Feedback.jsx';
import { Container } from '../components/layout/Chrome.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { usePortal } from '../context/PortalContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { buttonClass } from '../utils/format.js';
export function InfrastructureReview() {
    const { lang } = useLanguage();
    const portal = usePortal();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'अवसंरचना साक्ष्य' : 'Infrastructure Evidence');
    const items = portal.applications.flatMap((application) => application.documents
        .filter((document) => document.category === 'infrastructure' || document.preview === 'scene')
        .map((document) => ({ application, document })));
    return (<Container className="py-8">
      <PageHeader title={hi ? 'अवसंरचना साक्ष्य समीक्षा' : 'Infrastructure Evidence Review'} lede={hi ? 'तस्वीरें स्थान दिखा सकती हैं। वे क्षेत्र, सुरक्षा या उपकरण सिद्ध नहीं करतीं।' : 'Photographs can show a space. They do not establish area, safety, or equipment.'} crumbs={[{ label: hi ? 'मुख्य पृष्ठ' : 'Home', to: '/' }, { label: hi ? 'अवसंरचना साक्ष्य' : 'Infrastructure Evidence' }]}/>
      <Banner tone="warning">Every image here needs Manual Review. This prototype does not confirm a building from a picture.</Banner>
      {items.length === 0 ? (<div className="mt-4">
          <EmptyState title="No infrastructure evidence" text="Upload a photograph under Infrastructure Evidence in the verification workflow." action={<Link className={buttonClass('primary')} to="/verify">Validate Now</Link>}/>
        </div>) : (<ul className="mt-4 grid gap-4 lg:grid-cols-2">
          {items.map(({ application, document }) => {
                const url = portal.urlFor(document.id);
                return (<li key={document.id} className="border border-line bg-white">
                {url && document.mimeType.startsWith('image/') ? (<img src={url} alt={document.name} className="max-h-72 w-full object-contain bg-canvas"/>) : (<EvidenceScene scene={document.scene}/>)}
                <div className="space-y-2 p-4 text-sm">
                  <h2 className="font-semibold text-navy">{document.name}</h2>
                  <p className="text-muted">{application.institution.name}</p>
                  <StatusBadge status="manual-review"/>
                  <p className="leading-6">The image is held for an officer to view. Occupancy, area, and equipment were not confirmed. Manual Review Required.</p>
                  <Link className="font-semibold text-blue hover:underline" to={`/documents?application=${application.id}`}>Open document review</Link>
                </div>
              </li>);
            })}
        </ul>)}
    </Container>);
}
