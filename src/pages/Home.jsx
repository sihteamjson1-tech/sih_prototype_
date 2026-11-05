import { Building, ClipboardCheck, FileSearch, ScanSearch, ScrollText, ShieldCheck, } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Chrome.jsx';
import { HeroPreview } from '../components/home/HeroPreview.jsx';
import { Banner } from '../components/feedback/Feedback.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { buttonClass } from '../utils/format.js';
const services = [
    {
        title: 'Validate Application',
        text: 'Check required fields, completeness, and consistency.',
        action: 'Validate Now',
        to: '/verify',
        icon: ClipboardCheck,
    },
    {
        title: 'Authenticate Documents',
        text: 'Review certificates, signatures, QR codes, and available verification evidence.',
        action: 'Verify Documents',
        to: '/documents',
        icon: FileSearch,
    },
    {
        title: 'Check Regulatory Compliance',
        text: 'Compare application data against configurable regulatory checklists.',
        action: 'Check Compliance',
        to: '/compliance',
        icon: ShieldCheck,
    },
    {
        title: 'Track Application Status',
        text: 'View application progress, outstanding requirements, and review status.',
        action: 'Track Status',
        to: '/track',
        icon: ScanSearch,
    },
    {
        title: 'Infrastructure Evidence Review',
        text: 'Review uploaded photographs and supporting infrastructure evidence.',
        action: 'Review Evidence',
        to: '/infrastructure',
        icon: Building,
    },
    {
        title: 'Reports & Audit Trail',
        text: 'View validation reports, findings, and recorded review actions.',
        action: 'View Reports',
        to: '/reports',
        icon: ScrollText,
    },
];
export function Home() {
    const { lang, messages } = useLanguage();
    usePageTitle(lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home');
    const copy = lang === 'hi'
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
            eyebrow: 'DIGITAL EDUCATION GOVERNANCE',
            title: 'Transparent. Secure. Intelligent.',
            lede: 'An AI-assisted platform for validating institutional applications, authenticating documents, and supporting regulatory compliance reviews.',
            start: 'Start Application Verification',
            track: 'Track Existing Application',
            trust: ['Secure Document Handling', 'Explainable AI-Assisted Checks', 'Human-in-the-Loop Review'],
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
    return (<div>
      <div className="device-note border-b border-black">
        <Container className="py-3 text-sm leading-6">
          This website is optimized for both mobile and desktop devices. You can access it seamlessly from either.
        </Container>
      </div>
      <section className="page-hero border-b border-line">
        <Container className="grid items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-blue">{copy.eyebrow}</p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold text-navy sm:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink">{copy.lede}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className={buttonClass('primary')} to="/verify">
                {copy.start}
              </Link>
              <Link className={buttonClass('secondary')} to="/track">
                {copy.track}
              </Link>
            </div>
            <Link className="mt-3 inline-block text-sm font-semibold text-blue hover:underline" to="/verify?application=demo-eoa-00421">
              {copy.scenario}
            </Link>
            <ul className="mt-6 grid gap-2 text-sm text-ink sm:grid-cols-3">
              {copy.trust.map((item) => (<li key={item} className="border border-line bg-white px-3 py-2">
                  {item}
                </li>))}
            </ul>
          </div>
          <HeroPreview />
        </Container>
      </section>
      <Container className="py-6">
        <Banner tone="warning">{copy.advisory}</Banner>
        <section className="mt-10" aria-labelledby="services-heading">
          <h2 id="services-heading" className="text-2xl font-semibold text-navy">
            {messages.servicesTitle}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
            const Icon = service.icon;
            const hindi = {
                'Validate Application': {
                    title: 'आवेदन जाँचें',
                    text: 'आवश्यक फ़ील्ड, पूर्णता और संगति देखें।',
                    action: 'अभी जाँचें',
                },
                'Authenticate Documents': {
                    title: 'दस्तावेज़ प्रमाणित करें',
                    text: 'प्रमाणपत्र, हस्ताक्षर, क्यूआर कोड और उपलब्ध साक्ष्य की समीक्षा करें।',
                    action: 'दस्तावेज़ देखें',
                },
                'Check Regulatory Compliance': {
                    title: 'नियामक अनुपालन जाँचें',
                    text: 'आवेदन डेटा की तुलना विन्यास योग्य चेकलिस्ट से करें।',
                    action: 'अनुपालन जाँचें',
                },
                'Track Application Status': {
                    title: 'आवेदन की स्थिति देखें',
                    text: 'प्रगति, शेष आवश्यकताएँ और समीक्षा की स्थिति देखें।',
                    action: 'स्थिति ट्रैक करें',
                },
                'Infrastructure Evidence Review': {
                    title: 'अवसंरचना साक्ष्य समीक्षा',
                    text: 'अपलोड की गई तस्वीरें और सहायक साक्ष्य देखें।',
                    action: 'साक्ष्य देखें',
                },
                'Reports & Audit Trail': {
                    title: 'रिपोर्ट और ऑडिट ट्रेल',
                    text: 'सत्यापन रिपोर्ट, निष्कर्ष और दर्ज समीक्षा कार्रवाइयाँ देखें।',
                    action: 'रिपोर्ट देखें',
                },
            };
            const view = lang === 'hi' ? hindi[service.title] : undefined;
            return (<li key={service.title} className="flex">
                  <article className="flex h-full w-full flex-col border border-line bg-white p-5 shadow-[0_1px_2px_rgba(18,59,99,0.05)]">
                    <span className="flex h-10 w-10 items-center justify-center border border-line bg-canvas text-navy">
                      <Icon className="h-5 w-5" aria-hidden="true"/>
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-navy">{view?.title ?? service.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted">{view?.text ?? service.text}</p>
                    <Link className={`${buttonClass('secondary')} mt-5`} to={service.to}>
                      {view?.action ?? service.action}
                    </Link>
                  </article>
                </li>);
        })}
          </ul>
        </section>
        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold text-navy">{copy.processTitle}</h2>
            <ol className="mt-4 space-y-3">
              {copy.steps.map(([title, text], index) => (<li key={title} className="grid grid-cols-[2.5rem_1fr] gap-3 border border-line bg-white p-4">
                  <span className="flex h-8 w-8 items-center justify-center bg-navy text-sm font-semibold text-white">{index + 1}</span>
                  <div>
                    <h3 className="font-semibold text-navy">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                  </div>
                </li>))}
            </ol>
          </div>
          <aside className="border border-line bg-white p-5">
            <h2 className="text-xl font-semibold text-navy">{copy.deskTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{copy.deskNote}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link className="font-semibold text-blue hover:underline" to="/dashboard/applicant">Institution Applicant</Link></li>
              <li><Link className="font-semibold text-blue hover:underline" to="/dashboard/officer">Reviewing Officer</Link></li>
              <li><Link className="font-semibold text-blue hover:underline" to="/dashboard/compliance">Compliance Officer</Link></li>
              <li><Link className="font-semibold text-blue hover:underline" to="/dashboard/admin">Administrator</Link></li>
            </ul>
          </aside>
        </section>
      </Container>
    </div>);
}
