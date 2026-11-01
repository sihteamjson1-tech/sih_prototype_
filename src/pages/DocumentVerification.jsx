import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DocumentWorkspace } from '../components/documents/DocumentWorkspace.jsx';
import { Banner, EmptyState, PageHeader } from '../components/feedback/Feedback.jsx';
import { Container } from '../components/layout/Chrome.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { usePortal } from '../context/PortalContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { buttonClass } from '../utils/format.js';
export function DocumentVerification() {
    const { lang } = useLanguage();
    const portal = usePortal();
    const [params, setParams] = useSearchParams();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'दस्तावेज़ सत्यापन' : 'Document Verification');
    const applicationId = params.get('application');
    const application = useMemo(() => {
        return (portal.applications.find((item) => item.id === applicationId) ??
            portal.applications.find((item) => item.scenario) ??
            portal.applications[0]);
    }, [applicationId, portal.applications]);
    return (<Container className="py-8">
      <PageHeader title={hi ? 'दस्तावेज़ सत्यापन' : 'Document Verification'} lede={hi ? 'दस्तावेज़ और निकाले गए फ़ील्ड साथ-साथ देखें। लाइव स्रोत न होने पर सफल सत्यापन नहीं दिखाया जाता।' : 'Review a document beside the fields available for it. A successful authenticity result is not shown when no live source was checked.'} crumbs={[{ label: hi ? 'मुख्य पृष्ठ' : 'Home', to: '/' }, { label: hi ? 'दस्तावेज़ सत्यापन' : 'Document Verification' }]}/>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="doc-app" className="mb-1 block text-sm font-semibold">Application</label>
          <select id="doc-app" className="min-w-72 rounded-sm border border-line bg-white px-3 py-2 text-sm" value={application?.id ?? ''} onChange={(event) => setParams({ application: event.target.value })}>
            {portal.applications.map((item) => (<option key={item.id} value={item.id}>
                {item.institution.referenceNumber || item.id} — {item.institution.name || 'Untitled'}
              </option>))}
          </select>
        </div>
        <Link className={buttonClass('secondary')} to={`/verify?application=${application?.id ?? ''}`}>Open in verification</Link>
      </div>
      <Banner>
        {application?.scenario
            ? 'Showing the prepared demonstration case. Extracted fields come from the sample document on screen, not from an issuing authority.'
            : 'Demonstration review. OCR was not run on files you added, so those fields stay “Not extracted”.'}
      </Banner>
      <div className="mt-4">
        {application && application.documents.length > 0 ? (<DocumentWorkspace application={application} documents={application.documents} urlFor={portal.urlFor}/>) : (<EmptyState title="No documents on this application" text="Add documents in the verification workflow. Uploading a file records it for review and does not mark it authentic." action={<Link className={buttonClass('primary')} to="/verify">Validate Now</Link>}/>)}
      </div>
    </Container>);
}
