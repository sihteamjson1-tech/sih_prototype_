import { ClipboardCheck, House, Menu, Moon, ScanSearch, ScrollText, Sun, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AssistantChat } from '../feedback/AssistantChat.jsx';
import { Emblem } from '../layout/Chrome.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { ROLE_PATH, useSession } from '../../context/SessionContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { roleLabel } from '../../utils/labels.js';
import '../../styles/mobile.css';

const TAB_PATHS = ['/', '/verify', '/track', '/reports'];

function isTabPath(pathname, to) {
    if (to === '/')
        return pathname === '/';
    return pathname === to || pathname.startsWith(`${to}/`);
}

export function MobileShell() {
    const { lang, messages, setLang } = useLanguage();
    const { scale, setScale, theme, setTheme } = useUi();
    const { user, logout } = useSession();
    const location = useLocation();
    const [more, setMore] = useState(false);
    const closeRef = useRef(null);
    const titleId = useId();
    const routeKey = `${location.pathname}${location.search}${location.hash}`;
    const [routeMark, setRouteMark] = useState(routeKey);
    if (routeMark !== routeKey) {
        setRouteMark(routeKey);
        setMore(false);
    }
    const hi = lang === 'hi';
    const moreActive = !TAB_PATHS.some((path) => isTabPath(location.pathname, path));
    useEffect(() => {
        document.documentElement.classList.add('is-mobile-app');
        return () => document.documentElement.classList.remove('is-mobile-app');
    }, []);
    useEffect(() => {
        if (!more)
            return undefined;
        closeRef.current?.focus();
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (event) => {
            if (event.key === 'Escape')
                setMore(false);
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', onKey);
        };
    }, [more]);
    useEffect(() => {
        const meta = document.querySelector('meta[name="theme-color"]') ?? document.createElement('meta');
        const created = !meta.parentNode;
        if (created) {
            meta.setAttribute('name', 'theme-color');
            document.head.appendChild(meta);
        }
        const previous = meta.getAttribute('content');
        meta.setAttribute('content', theme === 'dark' ? '#101920' : '#f3f6fa');
        return () => {
            if (created)
                meta.remove();
            else if (previous)
                meta.setAttribute('content', previous);
            else
                meta.removeAttribute('content');
        };
    }, [theme]);
    const tabs = [
        { to: '/', label: hi ? 'होम' : 'Home', icon: House, end: true },
        { to: '/verify', label: hi ? 'जाँच' : 'Verify', icon: ClipboardCheck },
        { to: '/track', label: hi ? 'स्थिति' : 'Track', icon: ScanSearch },
        { to: '/reports', label: hi ? 'रिपोर्ट' : 'Reports', icon: ScrollText },
    ];
    return (<div className="m-app">
      <a className="skip-link" href="#main-content">{messages.skip}</a>
      <div className="m-top no-print">
        <header className="m-header">
          <Link className="m-brand" to="/" aria-label={messages.product}>
            <Emblem className="h-10 w-10"/>
            <span className="m-brand-copy">
              <strong>{messages.product}</strong>
              <span>{messages.tagline}</span>
            </span>
          </Link>
          <div className="m-header-actions">
            <button type="button" className="m-lang-btn" lang={lang === 'en' ? 'hi' : 'en'} onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>
            <button type="button" className="m-icon-btn" aria-pressed={theme === 'dark'} aria-label={theme === 'dark' ? messages.lightMode : messages.darkMode} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={16} aria-hidden="true"/> : <Moon size={16} aria-hidden="true"/>}
            </button>
            {user ? (<Link className="m-icon-btn" to={ROLE_PATH[user.role]} aria-label={`${user.name}, ${roleLabel(user.role, lang)}`}>
                <span className="m-avatar" aria-hidden="true">{user.name.slice(0, 1)}</span>
              </Link>) : (<Link className="m-icon-btn" to="/login" aria-label={messages.login}>
                {hi ? 'लॉग' : 'Log'}
              </Link>)}
          </div>
        </header>
        <div className="m-tricolour" aria-hidden="true">
          <span style={{ background: '#FF9933' }}/>
          <span style={{ background: theme === 'dark' ? '#d7e6f4' : '#ffffff' }}/>
          <span style={{ background: '#138808' }}/>
        </div>
        <p className="m-proto">{messages.prototype}</p>
      </div>
      <main id="main-content" tabIndex={-1} className="m-main">
        <div key={location.pathname} className="m-page">
          <Outlet />
        </div>
      </main>
      <nav className="m-tabbar no-print" aria-label="Primary">
        {tabs.map((tab) => (<NavLink key={tab.to} to={tab.to} end={tab.end} className="m-tab">
            <tab.icon aria-hidden="true"/>
            {tab.label}
          </NavLink>))}
        <button type="button" className={more || moreActive ? 'm-tab is-active' : 'm-tab'} aria-expanded={more} aria-controls="mobile-more" onClick={() => setMore(true)}>
          <Menu aria-hidden="true"/>
          {hi ? 'और' : 'More'}
        </button>
      </nav>
      {more ? (<div className="m-sheet no-print" onMouseDown={() => setMore(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby={titleId} id="mobile-more" className="m-sheet-panel" onMouseDown={(event) => event.stopPropagation()}>
            <div className="m-grab" aria-hidden="true"/>
            <div className="m-sheet-head">
              <h2 id={titleId}>{hi ? 'मेनू' : 'Menu'}</h2>
              <button ref={closeRef} type="button" className="m-icon-btn" aria-label={messages.closeMenu} onClick={() => setMore(false)}>
                <X size={16} aria-hidden="true"/>
              </button>
            </div>
            {user ? (<p className="m-muted">{user.name} · {roleLabel(user.role, lang)}</p>) : null}
            <p className="m-group-label">{messages.services}</p>
            <div>
              <Link className="m-linkline" to="/verify">{messages.validation}</Link>
              <Link className="m-linkline" to="/verify?type=eoa">{messages.eoa}</Link>
              <Link className="m-linkline" to="/verify?type=new-institution">{messages.newInstitution}</Link>
              <Link className="m-linkline" to="/verify?type=details-update">{messages.change}</Link>
              <Link className="m-linkline" to="/verify?type=faculty-infrastructure">{messages.faculty}</Link>
              <Link className="m-linkline" to="/verify?type=other">{messages.other}</Link>
              <Link className="m-linkline" to="/documents">{messages.documents}</Link>
              <Link className="m-linkline" to="/compliance">{messages.compliance}</Link>
              <Link className="m-linkline" to="/infrastructure">{hi ? 'अवसंरचना साक्ष्य' : 'Infrastructure evidence'}</Link>
              <Link className="m-linkline" to="/track">{messages.tracking}</Link>
              <Link className="m-linkline" to="/reports">{hi ? 'रिपोर्ट और ऑडिट' : 'Reports and audit'}</Link>
            </div>
            <p className="m-group-label">{hi ? 'डेस्क' : 'Desks'}</p>
            <div>
              <Link className="m-linkline" to="/dashboard/applicant">{roleLabel('applicant', lang)}</Link>
              <Link className="m-linkline" to="/dashboard/officer">{roleLabel('officer', lang)}</Link>
              <Link className="m-linkline" to="/dashboard/compliance">{roleLabel('compliance', lang)}</Link>
              <Link className="m-linkline" to="/dashboard/admin">{roleLabel('admin', lang)}</Link>
              {user ? (<button type="button" className="m-linkline" onClick={() => { logout(); setMore(false); }}>{messages.logout}</button>) : (<Link className="m-linkline" to="/login">{messages.login}</Link>)}
            </div>
            <p className="m-group-label">{messages.footerAbout}</p>
            <div>
              <Link className="m-linkline" to="/about">{messages.about}</Link>
              <Link className="m-linkline" to="/about#pramaan">{messages.aboutPramaan}</Link>
              <Link className="m-linkline" to="/about#aicte">{messages.aboutAicte}</Link>
              <Link className="m-linkline" to="/about#project">{messages.aboutProject}</Link>
              <Link className="m-linkline" to="/help">{messages.help}</Link>
              <Link className="m-linkline" to="/help#faqs">{messages.faqs}</Link>
              <Link className="m-linkline" to="/help#guide">{messages.guide}</Link>
              <Link className="m-linkline" to="/help#contact">{messages.contact}</Link>
              <Link className="m-linkline" to="/help#accessibility">{messages.accessibility}</Link>
            </div>
            <p className="m-group-label">{messages.footerPolicies}</p>
            <div>
              <Link className="m-linkline" to="/privacy">{messages.privacy}</Link>
              <Link className="m-linkline" to="/terms">{messages.terms}</Link>
              <Link className="m-linkline" to="/disclaimer">{messages.disclaimer}</Link>
              <Link className="m-linkline" to="/security">{messages.security}</Link>
            </div>
            <p className="m-group-label">{hi ? 'पढ़ने का आकार' : 'Reading size'}</p>
            <div className="m-seg" role="group" aria-label={messages.theme}>
              <button type="button" className="m-chip" aria-pressed={scale === 'sm'} onClick={() => setScale('sm')}>A−</button>
              <button type="button" className="m-chip" aria-pressed={scale === 'md'} onClick={() => setScale('md')}>A</button>
              <button type="button" className="m-chip" aria-pressed={scale === 'lg'} onClick={() => setScale('lg')}>A+</button>
              <button type="button" className="m-chip" aria-pressed={lang === 'en'} lang="en" onClick={() => setLang('en')}>English</button>
              <button type="button" className="m-chip" aria-pressed={lang === 'hi'} lang="hi" onClick={() => setLang('hi')}>हिंदी</button>
              <button type="button" className="m-chip" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>{messages.light}</button>
              <button type="button" className="m-chip" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>{messages.dark}</button>
            </div>
          </div>
        </div>) : null}
      <AssistantChat />
    </div>);
}
