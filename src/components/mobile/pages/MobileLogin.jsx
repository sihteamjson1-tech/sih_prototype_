import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field } from '../../forms/Field.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { DEMO_ACCOUNTS, ROLE_PATH, useSession } from '../../../context/SessionContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { DEMO_PASSWORD } from '../../../services/demoData.js';
import { roleLabel } from '../../../utils/labels.js';
import { Notice, Screen } from '../MobileUi.jsx';

export function MobileLogin() {
    const { lang } = useLanguage();
    const { login } = useSession();
    const navigate = useNavigate();
    const hi = lang === 'hi';
    usePageTitle(hi ? 'लॉगिन' : 'Login');
    const [role, setRole] = useState('applicant');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    return (<Screen title={hi ? 'लॉगिन / साइन इन' : 'Login / Sign In'} lede={hi ? 'यह प्रदर्शन प्रवेश है। यह सरकारी खाता प्रमाणित नहीं करता।' : 'This is a demonstration sign-in. It does not authenticate a government account.'}>
      <form className="m-card m-form m-stack" style={{ marginTop: 0 }} onSubmit={(event) => {
            event.preventDefault();
            const message = login(role, password);
            if (message) {
                setError(message);
                return;
            }
            navigate(ROLE_PATH[role]);
        }}>
        <Notice tone="warning">Demonstration role selection only. A production portal must enforce permissions on the server, not in the browser.</Notice>
        <Field id="mobile-role" label="Demonstration role">
          <select id="mobile-role" className="m-input" value={role} onChange={(event) => setRole(event.target.value)}>
            {Object.keys(DEMO_ACCOUNTS).map((item) => (<option key={item} value={item}>{roleLabel(item, lang)}</option>))}
          </select>
        </Field>
        <Field id="mobile-password" label="Password" error={error} hint={`Demonstration password: ${DEMO_PASSWORD}`}>
          <input id="mobile-password" className="m-input" type="password" autoComplete="current-password" value={password} aria-invalid={Boolean(error)} aria-describedby={error ? 'mobile-password-error mobile-password-hint' : 'mobile-password-hint'} onChange={(event) => setPassword(event.target.value)}/>
        </Field>
        <button type="submit" className="m-btn m-btn-primary">{hi ? 'साइन इन' : 'Sign in'}</button>
      </form>
      <section className="m-card">
        <h2>{hi ? 'प्रदर्शन डेस्क' : 'Demonstration desks'}</h2>
        <ul className="m-plain m-stack">
          {Object.keys(DEMO_ACCOUNTS).map((item) => (<li key={item}>
              <p className="m-row-title">{roleLabel(item, lang)}</p>
              <p className="m-muted m-break">{DEMO_ACCOUNTS[item].email}</p>
            </li>))}
        </ul>
        <p className="m-muted">No official credentials are used. The password is the same for every demonstration role.</p>
      </section>
    </Screen>);
}
