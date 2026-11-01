import { useState } from 'react';
import { DeskFrame } from '../../components/dashboards/DeskFrame.jsx';
import { Banner } from '../../components/feedback/Feedback.jsx';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog.jsx';
import { Field } from '../../components/forms/Field.jsx';
import { usePortal } from '../../context/PortalContext.jsx';
import { usePageTitle } from '../../hooks/usePageTitle.js';
import { apiBaseUrl, isDemoMode, testApiConnection } from '../../services/api.js';
import { buttonClass, cn, formatWhen, inputClass, selectClass } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { roleLabel } from '../../utils/labels.js';
export function AdminDashboard() {
    const portal = usePortal();
    const { lang } = useLanguage();
    usePageTitle('Administrator');
    const [tab, setTab] = useState('users');
    const [userForm, setUserForm] = useState({ name: '', email: '', role: 'applicant', organisation: '' });
    const [category, setCategory] = useState('');
    const [health, setHealth] = useState('');
    const [checking, setChecking] = useState(false);
    const [reset, setReset] = useState(false);
    const protectedCategories = new Set(['approval-letter', 'accreditation', 'faculty', 'infrastructure', 'land-building', 'financial', 'other']);
    const tabs = [
        { id: 'users', label: 'Users and roles' },
        { id: 'rules', label: 'Validation rules' },
        { id: 'categories', label: 'Document categories' },
        { id: 'audit', label: 'Audit logs' },
        { id: 'health', label: 'System health' },
    ];
    return (<DeskFrame role="admin" title="Administrator" lede="Manage demonstration users, checklist rules, and categories on this device. These controls do not change a government system.">
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((item) => (<button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? buttonClass('primary') : buttonClass('secondary')} onClick={() => setTab(item.id)}>
            {item.label}
          </button>))}
      </div>
      <div className="mt-4" role="tabpanel">
        {tab === 'users' ? (<div className="space-y-4">
            <form className="grid gap-3 border border-line bg-white p-4 md:grid-cols-2" onSubmit={(event) => {
                event.preventDefault();
                if (!userForm.name.trim() || !userForm.email.includes('@'))
                    return;
                portal.addUser(userForm);
                setUserForm({ name: '', email: '', role: 'applicant', organisation: '' });
            }}>
              <Field id="user-name" label="Name"><input id="user-name" className={inputClass} value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })}/></Field>
              <Field id="user-email" label="Email"><input id="user-email" className={inputClass} value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}/></Field>
              <Field id="user-role" label="Role">
                <select id="user-role" className={selectClass} value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}>
                  {['applicant', 'officer', 'compliance', 'admin'].map((role) => <option key={role} value={role}>{roleLabel(role, lang)}</option>)}
                </select>
              </Field>
              <Field id="user-org" label="Organisation"><input id="user-org" className={inputClass} value={userForm.organisation} onChange={(event) => setUserForm({ ...userForm, organisation: event.target.value })}/></Field>
              <button type="submit" className={buttonClass('primary')}>Add demonstration user</button>
            </form>
            <ul className="divide-y divide-line border border-line bg-white">
              {portal.users.map((user) => (<li key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-muted">{user.email} · {roleLabel(user.role, lang)} · {user.active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <button type="button" className={buttonClass('secondary')} onClick={() => portal.toggleUser(user.id)}>{user.active ? 'Deactivate' : 'Activate'}</button>
                </li>))}
            </ul>
          </div>) : null}
        {tab === 'rules' ? (<ul className="space-y-3">
            {portal.rules.map((rule) => (<li key={rule.id} className="border border-line bg-white p-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy">{rule.id}</p>
                    <p className="mt-1 leading-6">{rule.description}</p>
                    <p className="mt-1 text-muted">Evidence: {rule.evidence}. Origin: {rule.origin}.</p>
                  </div>
                  <button type="button" className={buttonClass('secondary')} aria-pressed={rule.enabled} onClick={() => portal.toggleRule(rule.id)}>
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {rule.kind === 'ratio' ? (<label className="mt-3 block">
                    Demonstration seats per faculty entry
                    <input type="number" min={1} max={100} className={cn(inputClass, 'mt-1 max-w-32')} value={rule.ratioDivisor} onChange={(event) => portal.setRatio(rule.id, Number(event.target.value) || 1)}/>
                  </label>) : null}
              </li>))}
            <p className="text-sm text-muted">Re-run validation after changing a rule. The threshold is a prototype setting, not an official norm.</p>
          </ul>) : null}
        {tab === 'categories' ? (<div className="space-y-3">
            <form className="flex flex-wrap gap-3" onSubmit={(event) => { event.preventDefault(); if (category.trim().length < 3)
            return; portal.addCategory(category.trim()); setCategory(''); }}>
              <label className="text-sm font-semibold" htmlFor="new-category">New category</label>
              <input id="new-category" className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)}/>
              <button type="submit" className={buttonClass('primary')}>Add category</button>
            </form>
            <ul className="divide-y divide-line border border-line bg-white">
              {portal.categories.map((item) => (<li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>{item.label}</span>
                  {protectedCategories.has(item.id) ? <span className="text-muted">Default</span> : <button type="button" className={buttonClass('danger')} onClick={() => portal.removeCategory(item.id)}>Remove</button>}
                </li>))}
            </ul>
          </div>) : null}
        {tab === 'audit' ? (<div className="space-y-4">
            <ul className="divide-y divide-line border border-line bg-white">
              {portal.audit.map((event) => (<li key={event.id} className="px-4 py-3 text-sm">
                  <p>{event.action}</p>
                  <p className="text-muted">{event.actor} · {formatWhen(event.at, lang)}</p>
                </li>))}
            </ul>
            <section>
              <h2 className="text-lg font-semibold text-navy">Prototype inbox</h2>
              {portal.inbox.length === 0 ? <p className="mt-2 text-sm text-muted">No support messages stored in this session.</p> : (<ul className="mt-2 divide-y divide-line border border-line bg-white">
                  {portal.inbox.map((message) => (<li key={message.id} className="px-4 py-3 text-sm">
                      <p className="font-semibold">{message.topic} — {message.name}</p>
                      <p className="text-muted">{message.email} · {formatWhen(message.at, lang)}</p>
                      <p className="mt-1">{message.message}</p>
                    </li>))}
                </ul>)}
            </section>
          </div>) : null}
        {tab === 'health' ? (<div className="space-y-3 border border-line bg-white p-4 text-sm">
            <p>Demonstration mode: {isDemoMode() ? 'On' : 'Off'}</p>
            <p>Configured API base: {apiBaseUrl() || 'Not set'}</p>
            <p>Applications in this session: {portal.applications.length}</p>
            <p>Documents recorded: {portal.applications.reduce((sum, item) => sum + item.documents.length, 0)}</p>
            <p>Findings recorded: {portal.applications.reduce((sum, item) => sum + item.checks.length, 0)}</p>
            <p>Uptime and processing throughput are not measured. No monitoring service is connected.</p>
            <button type="button" className={buttonClass('primary')} disabled={checking} onClick={() => {
                setChecking(true);
                void testApiConnection().then((result) => {
                    setHealth(result.message);
                    setChecking(false);
                });
            }}>
              {checking ? 'Testing connection' : 'Test connection'}
            </button>
            {health ? <Banner>{health}</Banner> : null}
            <button type="button" className={buttonClass('danger')} onClick={() => setReset(true)}>Restore demonstration data</button>
          </div>) : null}
      </div>
      {reset ? (<ConfirmDialog title="Restore demonstration data?" body="This replaces applications, rules, and messages in this browser session with the prepared prototype data. Uploaded files in memory will be dropped." confirmLabel="Restore" cancelLabel="Go back" onClose={() => setReset(false)} onConfirm={() => {
                portal.restoreDemo();
                setReset(false);
            }}/>) : null}
    </DeskFrame>);
}
