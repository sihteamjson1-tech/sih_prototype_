import { Link } from 'react-router-dom';
import { Banner, PageHeader } from '../feedback/Feedback.jsx';
import { Container } from '../layout/Chrome.jsx';
import { ROLE_PATH, useSession } from '../../context/SessionContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { buttonClass } from '../../utils/format.js';
import { roleLabel } from '../../utils/labels.js';
export function DeskFrame({ role, title, lede, children, }) {
    const { lang } = useLanguage();
    const { user, login } = useSession();
    return (<Container className="py-8">
      <PageHeader title={title} lede={lede} crumbs={[{ label: lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home', to: '/' }, { label: title }]}/>
      <Banner tone="warning">
        Demonstration desk for the {roleLabel(role, lang)}. Role selection in this SIH prototype is not access control. In production, enforce permissions on the server.
      </Banner>
      {user?.role !== role ? (<div className="mt-3">
          <button type="button" className={buttonClass('secondary')} onClick={() => login(role, 'demo')}>
            Enter this demonstration desk
          </button>
        </div>) : (<p className="mt-3 text-sm text-muted">
          Signed in as {user.name}. <Link className="font-semibold text-blue hover:underline" to={ROLE_PATH[user.role]}>Desk home</Link>
        </p>)}
      <div className="mt-6">{children}</div>
    </Container>);
}
