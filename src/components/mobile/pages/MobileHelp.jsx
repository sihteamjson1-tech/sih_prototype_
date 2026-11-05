import { useState } from 'react';
import { Field } from '../../forms/Field.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { Notice, Screen } from '../MobileUi.jsx';

const FAQS = [
    ['What is Pramaan?', 'A Smart India Hackathon 2026 prototype that helps review technical-institution applications. It is not an official AICTE portal.'],
    ['Does a green “Verified” label mean the document is genuine?', 'No. Verified means a local completeness or format check passed. Authenticity is shown only as Demo Verification or Source Unavailable unless a configured service returns evidence.'],
    ['Where do my files go?', 'In demonstration mode they stay in this browser session. They are not sent to an external service.'],
    ['Who takes the final decision?', 'Authorised officials. The prototype only prepares advisory findings.'],
    ['Can I change the checklist?', 'Yes, on the administrator desk in this demonstration. Those rules are still prototype rules.'],
    ['Why is Hindi only on part of the screen?', 'Navigation, header, footer, and key pages switch language. Prepared findings remain in English so the evidence text stays exact.'],
];

export function MobileHelp() {
    const { lang } = useLanguage();
    const portal = usePortal();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'सहायता' : 'Help & Support');
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', topic: 'Using the prototype', message: '' });
    const [error, setError] = useState('');
    return (<Screen title={hi ? 'सहायता' : 'Help & Support'} lede={hi ? 'प्रोटोटाइप के उपयोग, पहुँच और संपर्क का विवरण। संदेश एआईसीटीई को नहीं भेजे जाते।' : 'Guidance for this prototype. Messages are not delivered to AICTE.'}>
      <section id="faqs" className="m-card">
        <h2>{hi ? 'सामान्य प्रश्न' : 'FAQs'}</h2>
        <div className="m-stack">
          {FAQS.map(([question, answer]) => (<details key={question} className="m-faq">
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>))}
        </div>
      </section>
      <section id="guide" className="m-card">
        <h2>{hi ? 'उपयोगकर्ता मार्गदर्शिका' : 'User Guide'}</h2>
        <ol className="m-guide">
          <li>Choose an application type and enter the institution details. Required fields are marked by an error if you continue without them.</li>
          <li>Read the privacy notice before adding PDF or image files. The size limit is 10 MB each.</li>
          <li>Run validation. Wait until the stages finish. In demonstration mode they run locally.</li>
          <li>Read every finding. A failed check names what was checked and why.</li>
          <li>Open document review for the sample pages, or track a reference such as PRA/EOA/2026/MH/00421.</li>
          <li>Sign in with the demonstration password to open a role desk. Accepting a finding does not verify it with an issuing authority.</li>
        </ol>
      </section>
      <section id="contact" className="m-card">
        <h2>{hi ? 'संपर्क / सहायता' : 'Contact / Support'}</h2>
        <p className="m-muted">No official address or telephone number is published here, because this is not a government portal. The form stores a message only in this browser session.</p>
        {sent ? <div style={{ marginTop: '0.7rem' }}><Notice tone="success">Message stored in this demonstration session. It was not sent to AICTE or any external mailbox.</Notice></div> : null}
        <form className="m-form m-stack" onSubmit={(event) => {
            event.preventDefault();
            if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || form.message.trim().length < 8) {
                setError('Enter your name, a valid email, and a message of at least 8 characters.');
                return;
            }
            portal.sendInbox(form);
            setError('');
            setSent(true);
            setForm({ name: '', email: '', topic: 'Using the prototype', message: '' });
        }}>
          <Field id="mobile-support-name" label="Name">
            <input id="mobile-support-name" className="m-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/>
          </Field>
          <Field id="mobile-support-email" label="Email">
            <input id="mobile-support-email" className="m-input" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })}/>
          </Field>
          <Field id="mobile-support-topic" label="Topic">
            <select id="mobile-support-topic" className="m-input" value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>
              <option>Using the prototype</option>
              <option>Accessibility</option>
              <option>Demonstration data</option>
            </select>
          </Field>
          <Field id="mobile-support-message" label="Message" error={error}>
            <textarea id="mobile-support-message" className="m-input" rows={4} value={form.message} aria-invalid={Boolean(error)} aria-describedby={error ? 'mobile-support-message-error' : undefined} onChange={(event) => setForm({ ...form, message: event.target.value })}/>
          </Field>
          <button type="submit" className="m-btn m-btn-primary">Store message</button>
        </form>
      </section>
      <section id="accessibility" className="m-card">
        <h2>{hi ? 'सुगम्यता' : 'Accessibility'}</h2>
        <ul className="m-guide">
          <li>Use Skip to Main Content to jump past the header.</li>
          <li>Reading-size controls in More change the base size for the page.</li>
          <li>Status labels always include text and a marker, not colour alone.</li>
          <li>Form fields have visible labels. Errors are announced as alerts.</li>
          <li>The menu, dialogs, and verification steps can be used from the keyboard. Escape closes a dialog or the menu.</li>
          <li>Motion is limited when the browser asks for reduced motion.</li>
        </ul>
      </section>
    </Screen>);
}
