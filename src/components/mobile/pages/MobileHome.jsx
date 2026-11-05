import { Building2, ClipboardCheck, FileSearch, ScanSearch, ScrollText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { ROLE_PATH, useSession } from '../../../context/SessionContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { roleLabel } from '../../../utils/labels.js';
import { BtnLink, Notice, RowLink, StatGrid } from '../MobileUi.jsx';

const SERVICES = [
    { title: 'Validate Application', text: 'Check required fields, completeness, and consistency.', to: '/verify', icon: ClipboardCheck, hiTitle: 'आवेदन जाँचें', hiText: 'आवश्यक फ़ील्ड, पूर्णता और संगति देखें।' },
    { title: 'Authenticate Documents', text: 'Review certificates, signatures, QR codes, and available verification evidence.', to: '/documents', icon: FileSearch, hiTitle: 'दस्तावेज़ प्रमाणित करें', hiText: 'प्रमाणपत्र, हस्ताक्षर, क्यूआर कोड और उपलब्ध साक्ष्य की समीक्षा करें।' },
    { title: 'Check Regulatory Compliance', text: 'Compare application data against configurable regulatory checklists.', to: '/compliance', icon: ShieldCheck, hiTitle: 'नियामक अनुपालन जाँचें', hiText: 'आवेदन डेटा की तुलना विन्यास योग्य चेकलिस्ट से करें।' },
    { title: 'Track Application Status', text: 'View application progress, outstanding requirements, and review status.', to: '/track', icon: ScanSearch, hiTitle: 'आवेदन की स्थिति देखें', hiText: 'प्रगति, शेष आवश्यकताएँ और समीक्षा की स्थिति देखें।' },
    { title: 'Infrastructure Evidence Review', text: 'Review uploaded photographs and supporting infrastructure evidence.', to: '/infrastructure', icon: Building2, hiTitle: 'अवसंरचना साक्ष्य समीक्षा', hiText: 'अपलोड की गई तस्वीरें और सहायक साक्ष्य देखें।' },
    { title: 'Reports & Audit Trail', text: 'View validation reports, findings, and recorded review actions.', to: '/reports', icon: ScrollText, hiTitle: 'रिपोर्ट और ऑडिट ट्रेल', hiText: 'सत्यापन रिपोर्ट, निष्कर्ष और दर्ज समीक्षा कार्रवाइयाँ देखें।' },
];

export function MobileHome() {
    const { lang, messages } = useLanguage();
    const { user } = useSession();
    const portal = usePortal();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'मुख्य पृष्ठ' : 'Home');
    const copy = hi
        ? {
            eyebrow: 'डिजिटल शिक्षा शासन',
            title: 'पारदर्शी. सुरक्षित. बुद्धिमान.',
            lede: 'संस्थागत आवेदनों की जाँच, दस्तावेज़ों के प्रमाणीकरण और नियामक अनुपालन समीक्षा में सहायता के लिए एक एआई-सहायता प्राप्त मंच।',
            start: 'आवेदन सत्यापन शुरू करें',
            track: 'मौजूदा आवेदन ट्रैक करें',
            trust: ['सुरक्षित दस्तावेज़ प्रबंधन', 'समझाए जा सकने वाले एआई-सहायता प्राप्त परीक्षण', 'मानव समीक्षा के साथ निर्णय'],
            advisory: 'एआई से बने निष्कर्ष सलाहकारी हैं। अंतिम अनुमोदन अधिकृत अधिकारियों के पास रहता है।',
            scenario: 'तैयार प्रदर्शन मामला खोलें',
            processTitle: 'समीक्षा कैसे आगे बढ़ती है',
            steps: [
                ['आवेदन प्रकार', 'विस्तार, नया संस्थान, विवरण या संकाय अद्यतन चुनें।'],
                ['विवरण और दस्तावेज़', 'संस्थान विवरण दर्ज करें और फ़ाइलें इसी ब्राउज़र सत्र में रखें।'],
                ['स्थानीय जाँच', 'पूर्णता, प्रारूप और प्रदर्शन चेकलिस्ट चलाएँ। स्रोत उपलब्ध न हो तो वही कहा जाता है।'],
                ['अधिकारी समीक्षा', 'निष्कर्ष स्वीकार करें, स्पष्टीकरण माँगें, और नोट दर्ज करें।'],
            ],
            deskTitle: 'इस प्रदर्शन के डेस्क',
            deskNote: 'भूमिका चयन केवल एसआईएच डेमो के लिए है। उत्पादन में अनुमति सर्वर पर लागू होनी चाहिए।',
        }
        : {
            eyebrow: 'Digital education governance',
            title: 'Transparent. Secure. Intelligent.',
            lede: 'An AI-assisted platform for validating institutional applications, authenticating documents, and supporting regulatory compliance reviews.',
            start: 'Start application verification',
            track: 'Track an application',
            trust: ['Secure document handling', 'Explainable AI-assisted checks', 'Human-in-the-loop review'],
            advisory: 'AI-generated findings are advisory. Final approval decisions remain with authorized officials.',
            scenario: 'Open the prepared demonstration case',
            processTitle: 'How a review proceeds',
            steps: [
                ['Application type', 'Choose extension, new institution, details, or a faculty update.'],
                ['Details and documents', 'Enter the institution record and keep files in this browser session.'],
                ['Local checks', 'Run completeness, format, and demonstration checklist rules. Unavailable sources stay labelled.'],
                ['Officer review', 'Accept findings, ask for clarification, and record notes.'],
            ],
            deskTitle: 'Desks in this demonstration',
            deskNote: 'Role selection is a demonstration feature. In production, enforce permissions on the server.',
        };
    const documents = portal.applications.reduce((sum, item) => sum + item.documents.length, 0);
    const findings = portal.applications.reduce((sum, item) => sum + item.checks.length, 0);
    return (<div className="m-stack" style={{ marginTop: 0 }}>
      <Notice>
        This website is optimized for both mobile and desktop devices. You can access it seamlessly from either.
      </Notice>
      <section className="m-hero">
        <p className="m-kicker">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.lede}</p>
        <div className="m-hero-actions">
          <BtnLink to="/verify">{copy.start}</BtnLink>
          <BtnLink to="/track" variant="secondary">{copy.track}</BtnLink>
        </div>
        <Link className="m-btn m-btn-ghost" style={{ color: '#fff', marginTop: '0.2rem' }} to="/verify?application=demo-eoa-00421">{copy.scenario}</Link>
      </section>
      {user ? (<Link className="m-row" to={ROLE_PATH[user.role]}>
          <span className="m-row-icon" aria-hidden="true">{user.name.slice(0, 1)}</span>
          <span>
            <span className="m-row-title">{user.name}</span>
            <span className="m-row-text">{roleLabel(user.role, lang)} · {messages.desk}</span>
          </span>
        </Link>) : null}
      <Notice tone="warning">{copy.advisory}</Notice>
      <StatGrid items={[
            { label: hi ? 'आवेदन' : 'Applications', value: portal.applications.length, note: hi ? 'इस सत्र में' : 'In this browser session' },
            { label: hi ? 'दस्तावेज़' : 'Documents', value: documents, note: hi ? 'दर्ज फ़ाइलें' : 'Files recorded' },
            { label: hi ? 'निष्कर्ष' : 'Findings', value: findings, note: hi ? 'दर्ज जाँचें' : 'Checks recorded' },
            { label: hi ? 'संदेश' : 'Messages', value: portal.inbox.length, note: hi ? 'सहायता इनबॉक्स' : 'Support inbox' },
        ]}/>
      <section aria-labelledby="mobile-services">
        <h2 id="mobile-services" className="m-section-title">{messages.servicesTitle}</h2>
        <div className="m-stack">
          {SERVICES.map((service) => (<RowLink key={service.to} to={service.to} icon={service.icon} title={hi ? service.hiTitle : service.title} text={hi ? service.hiText : service.text}/>))}
        </div>
      </section>
      <section className="m-card" aria-labelledby="mobile-process">
        <h2 id="mobile-process">{copy.processTitle}</h2>
        <ol className="m-plain m-stack">
          {copy.steps.map(([title, text], index) => (<li key={title} className="m-split">
              <span className="m-avatar" aria-hidden="true">{index + 1}</span>
              <span>
                <strong className="m-row-title">{title}</strong>
                <span className="m-row-text">{text}</span>
              </span>
            </li>))}
        </ol>
      </section>
      <section className="m-card">
        <h2>{copy.deskTitle}</h2>
        <p className="m-muted">{copy.deskNote}</p>
        <ul className="m-plain">
          {copy.trust.map((item) => (<li key={item} className="m-check" style={{ marginTop: '0.55rem' }}><i aria-hidden="true">✓</i>{item}</li>))}
        </ul>
        <div className="m-stack">
          <RowLink to="/dashboard/applicant" icon={ClipboardCheck} title={roleLabel('applicant', lang)} text={hi ? 'आवेदन और स्पष्टीकरण' : 'Applications and clarifications'}/>
          <RowLink to="/dashboard/officer" icon={ScanSearch} title={roleLabel('officer', lang)} text={hi ? 'कतार और नोट' : 'Queue, findings, and notes'}/>
          <RowLink to="/dashboard/compliance" icon={ShieldCheck} title={roleLabel('compliance', lang)} text={hi ? 'खुली चेकलिस्ट' : 'Open checklist items'}/>
          <RowLink to="/dashboard/admin" icon={ScrollText} title={roleLabel('admin', lang)} text={hi ? 'नियम, उपयोगकर्ता, ऑडिट' : 'Rules, users, and audit'}/>
        </div>
      </section>
    </div>);
}
