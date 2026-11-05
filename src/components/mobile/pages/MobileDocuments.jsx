import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DocumentWorkspace } from '../../documents/DocumentWorkspace.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { BtnLink, Notice, Screen } from '../MobileUi.jsx';

export function MobileDocuments() {
    const { lang } = useLanguage();
    const portal = usePortal();
    const [params, setParams] = useSearchParams();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'दस्तावेज़ सत्यापन' : 'Document Verification');
    const applicationId = params.get('application');
    const application = useMemo(() => {
        return portal.applications.find((item) => item.id === applicationId)
            ?? portal.applications.find((item) => item.scenario)
            ?? portal.applications[0];
    }, [applicationId, portal.applications]);
    return (<Screen title={hi ? 'दस्तावेज़ सत्यापन' : 'Document Verification'} lede={hi ? 'दस्तावेज़ और निकाले गए फ़ील्ड साथ-साथ देखें। लाइव स्रोत न होने पर सफल सत्यापन नहीं दिखाया जाता।' : 'Review a document beside the fields available for it. A successful authenticity result is not shown when no live source was checked.'}>
      <div className="m-field">
        <label className="m-label" htmlFor="mobile-doc-app">Application</label>
        <select id="mobile-doc-app" className="m-input" value={application?.id ?? ''} onChange={(event) => setParams({ application: event.target.value })}>
          {portal.applications.map((item) => (<option key={item.id} value={item.id}>
              {item.institution.referenceNumber || item.id} — {item.institution.name || 'Untitled'}
            </option>))}
        </select>
      </div>
      <BtnLink to={`/verify?application=${application?.id ?? ''}`} variant="secondary">Open in verification</BtnLink>
      <Notice>
        {application?.scenario
            ? 'Showing the prepared demonstration case. Extracted fields come from the sample document on screen, not from an issuing authority.'
            : 'Demonstration review. OCR was not run on files you added, so those fields stay “Not extracted”.'}
      </Notice>
      {application && application.documents.length > 0 ? (<div className="m-docs">
          <DocumentWorkspace application={application} documents={application.documents} urlFor={portal.urlFor}/>
        </div>) : (<div className="m-card">
          <h2>No documents on this application</h2>
          <p className="m-muted">Add documents in the verification workflow. Uploading a file records it for review and does not mark it authentic.</p>
          <div style={{ marginTop: '0.8rem' }}><BtnLink to="/verify">Validate now</BtnLink></div>
        </div>)}
    </Screen>);
}
