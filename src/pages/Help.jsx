import { useState } from 'react';
import { Banner, PageHeader } from '../components/feedback/Feedback.jsx';
import { Field } from '../components/forms/Field.jsx';
import { Container } from '../components/layout/Chrome.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { usePortal } from '../context/PortalContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { buttonClass, inputClass } from '../utils/format.js';
const FAQS = [
    ['What is Pramaan?', 'A Smart India Hackathon 2026 prototype that helps review technical-institution applications. It is not an official AICTE portal.'],
    ['Does a green “Verified” label mean the document is genuine?', 'No. Verified means a local completeness or format check passed. Authenticity is shown only as Demo Verification or Source Unavailable unless a configured service returns evidence.'],
    ['Where do my files go?', 'In demonstration mode they stay in this browser session. They are not sent to an external service.'],
    ['Who takes the final decision?', 'Authorised officials. The prototype only prepares advisory findings.'],
    ['Can I change the checklist?', 'Yes, on the administrator desk in this demonstration. Those rules are still prototype rules.'],
    ['Why is Hindi only on part of the screen?', 'Navigation, header, footer, and key pages switch language. Prepared findings remain in English so the evidence text stays exact.'],
];
export function Help() {
    const { lang } = useLanguage();
    const portal = usePortal();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'सहायता' : 'Help & Support');
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', topic: 'Using the prototype', message: '' });
    const [error, setError] = useState('');
    return (<Container className="py-8">
      <PageHeader title={hi ? 'सहायता' : 'Help & Support'} lede={hi ? 'प्रोटोटाइप के उपयोग, पहुँच और संपर्क का विवरण। संदेश एआईसीटीई को नहीं भेजे जाते।' : 'Guidance for this prototype. Messages are not delivered to AICTE.'} crumbs={[{ label: hi ? 'मुख्य पृष्ठ' : 'Home', to: '/' }, { label: hi ? 'सहायता' : 'Help & Support' }]}/>
      <div className="space-y-8">
        <section id="faqs">
          <h2 className="text-xl font-semibold text-navy">{hi ? 'सामान्य प्रश्न' : 'FAQs'}</h2>
          <div className="mt-3 divide-y divide-line border border-line bg-white">
            {FAQS.map(([question, answer]) => (<details key={question} className="px-4 py-3">
                <summary className="cursor-pointer font-semibold text-navy">{question}</summary>
                <p className="mt-2 text-sm leading-6 text-ink">{answer}</p>
              </details>))}
          </div>
        </section>
        <section id="guide">
          <h2 className="text-xl font-semibold text-navy">{hi ? 'उपयोगकर्ता मार्गदर्शिका' : 'User Guide'}</h2>
          <ol className="mt-3 list-decimal space-y-2 border border-line bg-white p-5 pl-10 text-sm leading-6">
            <li>Choose an application type and enter the institution details. Required fields are marked by an error if you continue without them.</li>
            <li>Read the privacy notice before adding PDF or image files. The size limit is 10 MB each.</li>
            <li>Run validation. Wait until the stages finish. In demonstration mode they run locally.</li>
            <li>Read every finding. A failed check names what was checked and why.</li>
            <li>Open document review for the sample pages, or track a reference such as PRA/EOA/2026/MH/00421.</li>
            <li>Sign in with the demonstration password to open a role desk. Accepting a finding does not verify it with an issuing authority.</li>
          </ol>
        </section>
        <section id="contact">
          <h2 className="text-xl font-semibold text-navy">{hi ? 'संपर्क / सहायता' : 'Contact / Support'}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">No official address or telephone number is published here, because this is not a government portal. The form stores a message only in this browser session.</p>
          {sent ? <div className="mt-3"><Banner tone="success">Message stored in this demonstration session. It was not sent to AICTE or any external mailbox.</Banner></div> : null}
          <form className="mt-3 grid gap-4 border border-line bg-white p-4 md:grid-cols-2" onSubmit={(event) => {
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
            <Field id="support-name" label="Name">
              <input id="support-name" className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/>
            </Field>
            <Field id="support-email" label="Email">
              <input id="support-email" type="email" className={inputClass} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })}/>
            </Field>
            <Field id="support-topic" label="Topic">
              <select id="support-topic" className={inputClass} value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>
                <option>Using the prototype</option>
                <option>Accessibility</option>
                <option>Demonstration data</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field id="support-message" label="Message" error={error}>
                <textarea id="support-message" className={inputClass} rows={4} value={form.message} aria-invalid={Boolean(error)} aria-describedby={error ? 'support-message-error' : undefined} onChange={(event) => setForm({ ...form, message: event.target.value })}/>
              </Field>
            </div>
            <button type="submit" className={buttonClass('primary')}>Store message</button>
          </form>
        </section>
        <section id="accessibility">
          <h2 className="text-xl font-semibold text-navy">{hi ? 'सुगम्यता' : 'Accessibility'}</h2>
          <ul className="mt-3 list-disc space-y-2 border border-line bg-white p-5 pl-10 text-sm leading-6">
            <li>Use Skip to Main Content on the government strip to jump past the header.</li>
            <li>Font-size controls on that strip change the base size for the page.</li>
            <li>Status labels always include text and a marker, not colour alone.</li>
            <li>Form fields have visible labels. Errors are announced as alerts.</li>
            <li>Menus, dialogs, and the step list can be used from the keyboard. Escape closes a dialog or the services menu.</li>
            <li>Motion is limited when the browser asks for reduced motion.</li>
          </ul>
        </section>
      </div>
    </Container>);
}
