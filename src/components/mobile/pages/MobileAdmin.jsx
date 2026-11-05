import { useState } from 'react';
import { ConfirmDialog } from '../../feedback/ConfirmDialog.jsx';
import { Field } from '../../forms/Field.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { apiBaseUrl, isDemoMode, testApiConnection } from '../../../services/api.js';
import { formatWhen } from '../../../utils/format.js';
import { roleLabel } from '../../../utils/labels.js';
import { DeskGate, Notice, Screen } from '../MobileUi.jsx';

const PROTECTED = new Set(['approval-letter', 'accreditation', 'faculty', 'infrastructure', 'land-building', 'financial', 'other']);

export function MobileAdmin() {
    const portal = usePortal();
    const { lang } = useLanguage();
    usePageTitle('Administrator');
    const [tab, setTab] = useState('users');
    const [userForm, setUserForm] = useState({ name: '', email: '', role: 'applicant', organisation: '' });
    const [category, setCategory] = useState('');
    const [health, setHealth] = useState('');
    const [checking, setChecking] = useState(false);
    const [reset, setReset] = useState(false);
    const tabs = [
        { id: 'users', label: 'Users' },
        { id: 'rules', label: 'Rules' },
        { id: 'categories', label: 'Categories' },
        { id: 'audit', label: 'Audit' },
        { id: 'health', label: 'Health' },
    ];
    return (<Screen kicker="Demonstration desk" title="Administrator" lede="Manage demonstration users, checklist rules, and categories on this device. These controls do not change a government system.">
      <DeskGate role="admin"/>
      <div className="m-chips" role="tablist">
        {tabs.map((item) => (<button key={item.id} type="button" role="tab" className="m-chip" aria-selected={tab === item.id} onClick={() => setTab(item.id)}>
            {item.label}
          </button>))}
      </div>
      <div role="tabpanel">
        {tab === 'users' ? (<div className="m-stack">
            <form className="m-card m-form m-stack" style={{ marginTop: 0 }} onSubmit={(event) => {
                event.preventDefault();
                if (!userForm.name.trim() || !userForm.email.includes('@'))
                    return;
                portal.addUser(userForm);
                setUserForm({ name: '', email: '', role: 'applicant', organisation: '' });
            }}>
              <Field id="mobile-user-name" label="Name"><input id="mobile-user-name" className="m-input" value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })}/></Field>
              <Field id="mobile-user-email" label="Email"><input id="mobile-user-email" className="m-input" type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}/></Field>
              <Field id="mobile-user-role" label="Role">
                <select id="mobile-user-role" className="m-input" value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}>
                  {['applicant', 'officer', 'compliance', 'admin'].map((role) => <option key={role} value={role}>{roleLabel(role, lang)}</option>)}
                </select>
              </Field>
              <Field id="mobile-user-org" label="Organisation"><input id="mobile-user-org" className="m-input" value={userForm.organisation} onChange={(event) => setUserForm({ ...userForm, organisation: event.target.value })}/></Field>
              <button type="submit" className="m-btn m-btn-primary">Add demonstration user</button>
            </form>
            <ul className="m-plain m-stack" style={{ marginTop: 0 }}>
              {portal.users.map((user) => (<li key={user.id} className="m-card">
                  <p className="m-row-title">{user.name}</p>
                  <p className="m-muted m-break">{user.email} · {roleLabel(user.role, lang)} · {user.active ? 'Active' : 'Inactive'}</p>
                  <button type="button" className="m-btn m-btn-secondary" style={{ marginTop: '0.7rem' }} onClick={() => portal.toggleUser(user.id)}>{user.active ? 'Deactivate' : 'Activate'}</button>
                </li>))}
            </ul>
          </div>) : null}
        {tab === 'rules' ? (<ul className="m-plain m-stack" style={{ marginTop: 0 }}>
            {portal.rules.map((rule) => (<li key={rule.id} className="m-card">
                <p className="m-row-title">{rule.id}</p>
                <p className="m-muted">{rule.description}</p>
                <p className="m-muted">Evidence: {rule.evidence}. Origin: {rule.origin}.</p>
                <button type="button" className="m-btn m-btn-secondary" style={{ marginTop: '0.7rem' }} aria-pressed={rule.enabled} onClick={() => portal.toggleRule(rule.id)}>
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </button>
                {rule.kind === 'ratio' ? (<label className="m-field" style={{ marginTop: '0.75rem' }}>
                    <span className="m-label">Demonstration seats per faculty entry</span>
                    <input type="number" min={1} max={100} className="m-input" value={rule.ratioDivisor} onChange={(event) => portal.setRatio(rule.id, Number(event.target.value) || 1)}/>
                  </label>) : null}
              </li>))}
            <li><p className="m-muted">Re-run validation after changing a rule. The threshold is a prototype setting, not an official norm.</p></li>
          </ul>) : null}
        {tab === 'categories' ? (<div className="m-stack">
            <form className="m-card m-stack" style={{ marginTop: 0 }} onSubmit={(event) => {
                event.preventDefault();
                if (category.trim().length < 3)
                    return;
                portal.addCategory(category.trim());
                setCategory('');
            }}>
              <label className="m-label" htmlFor="mobile-new-category">New category</label>
              <input id="mobile-new-category" className="m-input" value={category} onChange={(event) => setCategory(event.target.value)}/>
              <button type="submit" className="m-btn m-btn-primary">Add category</button>
            </form>
            <ul className="m-plain m-stack" style={{ marginTop: 0 }}>
              {portal.categories.map((item) => (<li key={item.id} className="m-card m-split">
                  <span>{item.label}</span>
                  {PROTECTED.has(item.id) ? <span className="m-muted">Default</span> : <button type="button" className="m-btn m-btn-danger" style={{ width: 'auto' }} onClick={() => portal.removeCategory(item.id)}>Remove</button>}
                </li>))}
            </ul>
          </div>) : null}
        {tab === 'audit' ? (<div className="m-stack">
            <ul className="m-plain m-stack" style={{ marginTop: 0 }}>
              {portal.audit.map((event) => (<li key={event.id} className="m-card">
                  <p style={{ margin: 0 }}>{event.action}</p>
                  <p className="m-muted">{event.actor} · {formatWhen(event.at, lang)}</p>
                </li>))}
            </ul>
            <section className="m-card">
              <h2>Prototype inbox</h2>
              {portal.inbox.length === 0 ? <p className="m-muted">No support messages stored in this session.</p> : (<ul className="m-plain m-stack">
                  {portal.inbox.map((message) => (<li key={message.id}>
                      <p className="m-row-title">{message.topic} — {message.name}</p>
                      <p className="m-muted m-break">{message.email} · {formatWhen(message.at, lang)}</p>
                      <p style={{ margin: '0.3rem 0 0' }}>{message.message}</p>
                    </li>))}
                </ul>)}
            </section>
          </div>) : null}
        {tab === 'health' ? (<div className="m-card m-stack" style={{ marginTop: 0 }}>
            <p style={{ margin: 0 }}>Demonstration mode: {isDemoMode() ? 'On' : 'Off'}</p>
            <p style={{ margin: 0 }} className="m-break">Configured API base: {apiBaseUrl() || 'Not set'}</p>
            <p style={{ margin: 0 }}>Applications in this session: {portal.applications.length}</p>
            <p style={{ margin: 0 }}>Documents recorded: {portal.applications.reduce((sum, item) => sum + item.documents.length, 0)}</p>
            <p style={{ margin: 0 }}>Findings recorded: {portal.applications.reduce((sum, item) => sum + item.checks.length, 0)}</p>
            <p className="m-muted" style={{ margin: 0 }}>Uptime and processing throughput are not measured. No monitoring service is connected.</p>
            <button type="button" className="m-btn m-btn-primary" disabled={checking} onClick={() => {
                setChecking(true);
                void testApiConnection().then((result) => {
                    setHealth(result.message);
                    setChecking(false);
                });
            }}>{checking ? 'Testing connection' : 'Test connection'}</button>
            {health ? <Notice>{health}</Notice> : null}
            <button type="button" className="m-btn m-btn-danger" onClick={() => setReset(true)}>Restore demonstration data</button>
          </div>) : null}
      </div>
      {reset ? (<ConfirmDialog title="Restore demonstration data?" body="This replaces applications, rules, and messages in this browser session with the prepared prototype data. Uploaded files in memory will be dropped." confirmLabel="Restore" cancelLabel="Go back" onClose={() => setReset(false)} onConfirm={() => {
                portal.restoreDemo();
                setReset(false);
            }}/>) : null}
    </Screen>);
}
