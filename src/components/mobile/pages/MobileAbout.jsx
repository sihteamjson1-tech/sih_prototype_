import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { Screen } from '../MobileUi.jsx';

export function MobileAbout() {
    const { lang } = useLanguage();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'पोर्टल के बारे में' : 'About the Portal');
    return (<Screen title={hi ? 'पोर्टल के बारे में' : 'About the Portal'} lede={hi ? 'प्रमाण एक एसआईएच 2026 प्रोटोटाइप है। यह एआईसीटीई या भारत सरकार की आधिकारिक सेवा नहीं है।' : 'Pramaan is an SIH 2026 prototype for reviewing technical-institution applications. It is not an official AICTE or Government of India service.'}>
      <section id="pramaan" className="m-card">
        <h2>{hi ? 'प्रमाण के बारे में' : 'About Pramaan'}</h2>
        <p className="m-muted">
          {hi
            ? 'प्रमाण अधिकारी को आवेदन की पूर्णता, दस्तावेज़ों की उपलब्धता और चेकलिस्ट की कमियाँ एक ही स्थान पर दिखाने के लिए बनाया गया है। निष्कर्ष सलाहकारी हैं। अनुमोदन यहीं से जारी नहीं होता।'
            : 'Pramaan helps an authorised reviewer see whether an application is complete, which documents are present, and which checklist items still need a person. Findings are advisory. This screen does not grant approval.'}
        </p>
      </section>
      <section id="aicte" className="m-card">
        <h2>{hi ? 'एआईसीटीई के बारे में' : 'About AICTE'}</h2>
        <p className="m-muted">
          {hi
            ? 'अखिल भारतीय तकनीकी शिक्षा परिषद, शिक्षा मंत्रालय के अंतर्गत तकनीकी शिक्षा का वैधानिक निकाय है। इस प्रोटोटाइप का उस परिषद के सिस्टम से कोई आधिकारिक संयोजन नहीं है।'
            : 'The All India Council for Technical Education is the statutory body for technical education under the Ministry of Education. This prototype is not connected to the Council’s systems and does not speak for it.'}
        </p>
        <a className="m-btn m-btn-secondary" style={{ marginTop: '0.8rem' }} href="https://www.aicte-india.org/" target="_blank" rel="noreferrer">
          {hi ? 'एआईसीटीई की सार्वजनिक वेबसाइट' : 'AICTE public website'}
        </a>
      </section>
      <section id="project" className="m-card">
        <h2>{hi ? 'परियोजना के बारे में' : 'About the Project'}</h2>
        <p className="m-muted">
          {hi
            ? 'यह स्मार्ट इंडिया हैकथॉन 2026 के लिए आवेदन सत्यापन, दस्तावेज़ प्रमाणीकरण और अनुपालन समीक्षा का फ्रंटएंड प्रोटोटाइप है। प्रदर्शन मोड में फ़ाइलें और परिणाम इसी ब्राउज़र सत्र में रहते हैं। जब लाइव सेवा कॉन्फ़िगर न हो, सत्यापन “Demo Verification” या “Source Unavailable” रहता है।'
            : 'This is the Smart India Hackathon 2026 frontend prototype for application validation, document authentication, and compliance review. In demonstration mode, files and results stay in this browser session. Where a live issuing authority is not configured, verification stays on Demo Verification or Source Unavailable.'}
        </p>
      </section>
    </Screen>);
}
