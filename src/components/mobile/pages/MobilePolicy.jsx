import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { Screen } from '../MobileUi.jsx';

const PAGES = {
    privacy: {
        enTitle: 'Privacy Policy',
        hiTitle: 'गोपनीयता नीति',
        en: [
            'This prototype stores what you type, and files you add, in your browser session. Demonstration mode does not send them to AICTE or another external service.',
            'If demonstration mode is turned off, files are sent only to the API address configured in VITE_API_BASE_URL, and only when you run validation.',
            'Do not upload genuine identity documents, financial records, or other sensitive institutional files unless you are authorised to process them in this prototype.',
            'Clear the site data for this page to remove the session. No separate government account is created.',
        ],
        hi: [
            'यह प्रोटोटाइप आपके लिखे विवरण और जोड़ी गई फ़ाइलें इसी ब्राउज़र सत्र में रखता है। प्रदर्शन मोड उन्हें एआईसीटीई या किसी बाहरी सेवा को नहीं भेजता।',
            'यदि प्रदर्शन मोड बंद हो, तो फ़ाइलें केवल VITE_API_BASE_URL पर दी गई सेवा को जाती हैं, और केवल जब आप सत्यापन चलाते हैं।',
            'संवेदनशील आधिकारिक दस्तावेज़ तब तक न जोड़ें जब तक आपको इस प्रोटोटाइप में उन्हें संसाधित करने की अनुमति न हो।',
        ],
    },
    terms: {
        enTitle: 'Terms of Use',
        hiTitle: 'उपयोग की शर्तें',
        en: [
            'Pramaan is a Smart India Hackathon 2026 prototype for demonstration and evaluation.',
            'You may use it to walk through the review workflow. You may not present its screens as an official government decision.',
            'The demonstration password and role switcher are not an access-control system.',
        ],
        hi: [
            'प्रमाण स्मार्ट इंडिया हैकथॉन 2026 का प्रदर्शन प्रोटोटाइप है।',
            'इसका उपयोग समीक्षा प्रक्रिया दिखाने के लिए करें। इसकी स्क्रीन को आधिकारिक सरकारी निर्णय न बताएं।',
            'प्रदर्शन पासवर्ड और भूमिका चयन अभिगम नियंत्रण नहीं है।',
        ],
    },
    disclaimer: {
        enTitle: 'Disclaimer',
        hiTitle: 'अस्वीकरण',
        en: [
            'This demonstration is not an official Government of India or AICTE portal.',
            'AI-assisted findings are advisory. Final approval decisions remain with authorized officials.',
            'Checklist items, sample institutions, and sample documents were prepared for the prototype. They are not live regulatory records.',
            'No government contact details, certifications, or authorisations are claimed.',
        ],
        hi: [
            'यह प्रदर्शन भारत सरकार या एआईसीटीई का आधिकारिक पोर्टल नहीं है।',
            'एआई-सहायता प्राप्त निष्कर्ष सलाहकारी हैं। अंतिम निर्णय अधिकृत अधिकारियों के पास रहता है।',
            'नमूना संस्थान, दस्तावेज़ और चेकलिस्ट इस प्रोटोटाइप के लिए बनाए गए हैं।',
        ],
    },
    security: {
        enTitle: 'Security Guidelines',
        hiTitle: 'सुरक्षा दिशानिर्देश',
        en: [
            'Do not place API secrets in frontend code or in the Vite environment files.',
            'Treat the role selector as a demonstration. Enforce authorisation on the server in any real deployment.',
            'Uploaded files are shown as images or PDF frames, not as unsanitised HTML.',
            'A local format check is not authentication. Do not rely on this prototype for a production approval.',
        ],
        hi: [
            'एपीआई रहस्य फ्रंटएंड कोड या एनवायरनमेंट फ़ाइल में न रखें।',
            'भूमिका चयन केवल प्रदर्शन है। वास्तविक प्रणाली में अनुमति सर्वर पर लागू करें।',
            'अपलोड की गई फ़ाइलें छवि या पीडीएफ के रूप में दिखाई जाती हैं, असुरक्षित एचटीएमएल के रूप में नहीं।',
        ],
    },
};

export function MobilePolicy({ kind }) {
    const { lang } = useLanguage();
    const page = PAGES[kind];
    const hi = lang === 'hi';
    const title = hi ? page.hiTitle : page.enTitle;
    usePageTitle(title);
    const paragraphs = hi ? page.hi : page.en;
    return (<Screen title={title} lede={hi ? 'यह प्रोटोटाइप नीति है, सरकारी राजपत्र नहीं।' : 'Prototype policy text. It is not a government notification.'}>
      <article className="m-card m-stack" style={{ marginTop: 0 }}>
        {paragraphs.map((paragraph) => (<p key={paragraph} className="m-muted" style={{ margin: 0 }}>{paragraph}</p>))}
      </article>
    </Screen>);
}
