import { Container } from '../components/layout/Chrome.jsx';
import { PageHeader } from '../components/feedback/Feedback.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
export function About() {
    const { lang } = useLanguage();
    usePageTitle(lang === 'hi' ? 'पोर्टल के बारे में' : 'About the Portal');
    const hi = lang === 'hi';
    return (<Container className="py-8">
      <PageHeader title={hi ? 'पोर्टल के बारे में' : 'About the Portal'} lede={hi ? 'प्रमाण एक एसआईएच 2026 प्रोटोटाइप है। यह एआईसीटीई या भारत सरकार की आधिकारिक सेवा नहीं है।' : 'Pramaan is an SIH 2026 prototype for reviewing technical-institution applications. It is not an official AICTE or Government of India service.'} crumbs={[{ label: hi ? 'मुख्य पृष्ठ' : 'Home', to: '/' }, { label: hi ? 'पोर्टल के बारे में' : 'About the Portal' }]}/>
      <div className="grid gap-4">
        <section id="pramaan" className="border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-navy">{hi ? 'प्रमाण के बारे में' : 'About Pramaan'}</h2>
          <p className="mt-3 text-sm leading-7 text-ink">
            {hi
            ? 'प्रमाण अधिकारी को आवेदन की पूर्णता, दस्तावेज़ों की उपलब्धता और चेकलिस्ट की कमियाँ एक ही स्थान पर दिखाने के लिए बनाया गया है। निष्कर्ष सलाहकारी हैं। अनुमोदन यहीं से जारी नहीं होता।'
            : 'Pramaan helps an authorised reviewer see whether an application is complete, which documents are present, and which checklist items still need a person. Findings are advisory. This screen does not grant approval.'}
          </p>
        </section>
        <section id="aicte" className="border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-navy">{hi ? 'एआईसीटीई के बारे में' : 'About AICTE'}</h2>
          <p className="mt-3 text-sm leading-7 text-ink">
            {hi
            ? 'अखिल भारतीय तकनीकी शिक्षा परिषद, शिक्षा मंत्रालय के अंतर्गत तकनीकी शिक्षा का वैधानिक निकाय है। इस प्रोटोटाइप का उस परिषद के सिस्टम से कोई आधिकारिक संयोजन नहीं है।'
            : 'The All India Council for Technical Education is the statutory body for technical education under the Ministry of Education. This prototype is not connected to the Council’s systems and does not speak for it.'}
          </p>
          <p className="mt-3 text-sm">
            <a className="font-semibold text-blue hover:underline" href="https://www.aicte-india.org/" target="_blank" rel="noreferrer">
              {hi ? 'एआईसीटीई की सार्वजनिक वेबसाइट (बाहरी लिंक)' : 'AICTE public website (external)'}
            </a>
          </p>
        </section>
        <section id="project" className="border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-navy">{hi ? 'परियोजना के बारे में' : 'About the Project'}</h2>
          <p className="mt-3 text-sm leading-7 text-ink">
            {hi
            ? 'यह स्मार्ट इंडिया हैकथॉन 2026 के लिए आवेदन सत्यापन, दस्तावेज़ प्रमाणीकरण और अनुपालन समीक्षा का फ्रंटएंड प्रोटोटाइप है। प्रदर्शन मोड में फ़ाइलें और परिणाम इसी ब्राउज़र सत्र में रहते हैं। जब लाइव सेवा कॉन्फ़िगर न हो, सत्यापन “Demo Verification” या “Source Unavailable” रहता है।'
            : 'This is the Smart India Hackathon 2026 frontend prototype for application validation, document authentication, and compliance review. In demonstration mode, files and results stay in this browser session. Where a live issuing authority is not configured, verification stays on Demo Verification or Source Unavailable.'}
          </p>
        </section>
      </div>
    </Container>);
}
