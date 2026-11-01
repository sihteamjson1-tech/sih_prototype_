import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banner, PageHeader } from '../components/feedback/Feedback.jsx';
import { Field } from '../components/forms/Field.jsx';
import { Container } from '../components/layout/Chrome.jsx';
import { DEMO_ACCOUNTS, ROLE_PATH, useSession } from '../context/SessionContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { DEMO_PASSWORD } from '../services/demoData.js';
import { buttonClass, inputClass, selectClass } from '../utils/format.js';
import { roleLabel } from '../utils/labels.js';
export function Login() {
    const { lang } = useLanguage();
    const { login } = useSession();
    const navigate = useNavigate();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'लॉगिन' : 'Login');
    const [role, setRole] = useState('applicant');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    return (<Container className="py-8">
      <PageHeader title={hi ? 'लॉगिन / साइन इन' : 'Login / Sign In'} lede={hi ? 'यह प्रदर्शन प्रवेश है। यह सरकारी खाता प्रमाणित नहीं करता।' : 'This is a demonstration sign-in. It does not authenticate a government account.'} crumbs={[{ label: hi ? 'मुख्य पृष्ठ' : 'Home', to: '/' }, { label: hi ? 'लॉगिन' : 'Login' }]}/>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,28rem)_1fr]">
        <form className="border border-line border-t-4 border-t-navy bg-white p-5" onSubmit={(event) => {
            event.preventDefault();
            const message = login(role, password);
            if (message) {
                setError(message);
                return;
            }
            navigate(ROLE_PATH[role]);
        }}>
          <Banner tone="warning">Demonstration role selection only. A production portal must enforce permissions on the server, not in the browser.</Banner>
          <div className="mt-4 space-y-4">
            <Field id="role" label="Demonstration role">
              <select id="role" className={selectClass} value={role} onChange={(event) => setRole(event.target.value)}>
                {Object.keys(DEMO_ACCOUNTS).map((item) => (<option key={item} value={item}>{roleLabel(item, lang)}</option>))}
              </select>
            </Field>
            <Field id="password" label="Password" error={error} hint={`Demonstration password: ${DEMO_PASSWORD}`}>
              <input id="password" type="password" autoComplete="current-password" className={inputClass} value={password} aria-invalid={Boolean(error)} aria-describedby={error ? 'password-error password-hint' : 'password-hint'} onChange={(event) => setPassword(event.target.value)}/>
            </Field>
          </div>
          <button type="submit" className={`${buttonClass('primary')} mt-5`}>Sign in</button>
        </form>
        <aside className="border border-line bg-white p-5 text-sm leading-6">
          <h2 className="text-lg font-semibold text-navy">Demonstration desks</h2>
          <ul className="mt-3 space-y-3">
            {Object.keys(DEMO_ACCOUNTS).map((item) => (<li key={item}>
                <p className="font-semibold text-ink">{roleLabel(item, lang)}</p>
                <p className="text-muted">{DEMO_ACCOUNTS[item].email}</p>
              </li>))}
          </ul>
          <p className="mt-4 text-muted">No official credentials are used. The password is the same for every demonstration role.</p>
        </aside>
      </div>
    </Container>);
}
