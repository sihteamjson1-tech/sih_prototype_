import { Accessibility, Lock, LogOut, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { ROLE_PATH, useSession } from '../../context/SessionContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { buttonClass, cn } from '../../utils/format.js';
import { roleLabel } from '../../utils/labels.js';
import { Container, Emblem, TricolourMark } from './Chrome.jsx';
import { NavBar } from '../navigation/NavBar.jsx';
export function GovHeader() {
    const { lang, messages, setLang } = useLanguage();
    const { scale, setScale, theme, setTheme } = useUi();
    const { user, logout } = useSession();
    return (<header className="no-print">
      <a className="skip-link" href="#main-content">
        {messages.skip}
      </a>
      <div className="bg-navy-deep text-white">
        <Container className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-1.5 text-xs">
          <div className="flex items-center gap-2">
            <TricolourMark />
            <div className="leading-4">
              <p className="font-semibold">{messages.goi}</p>
              <p className="text-white/80">{messages.ministry}</p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
            <a className="hover:underline" href="#main-content">
              {messages.skip}
            </a>
            <span aria-hidden="true" className="text-white/30">|</span>
            <Link className="hover:underline" to="/help#accessibility">
              {messages.screen}
            </Link>
            <span aria-hidden="true" className="text-white/30">|</span>
            <span className="inline-flex items-center gap-1">
              <button type="button" lang="en" aria-pressed={lang === 'en'} className={lang === 'en' ? 'font-semibold underline' : ''} onClick={() => setLang('en')}>
                English
              </button>
              <span aria-hidden="true">|</span>
              <button type="button" lang="hi" aria-pressed={lang === 'hi'} className={lang === 'hi' ? 'font-semibold underline' : ''} onClick={() => setLang('hi')}>
                हिंदी
              </button>
            </span>
            <span aria-hidden="true" className="text-white/30">|</span>
            <span className="inline-flex items-center gap-1">
              <Accessibility className="h-4 w-4" aria-hidden="true"/>
              <button type="button" aria-label={messages.fontDown} aria-pressed={scale === 'sm'} className="px-1 font-semibold" onClick={() => setScale('sm')}>
                A−
              </button>
              <button type="button" aria-label={messages.fontReset} aria-pressed={scale === 'md'} className="px-1 font-semibold" onClick={() => setScale('md')}>
                A
              </button>
              <button type="button" aria-label={messages.fontUp} aria-pressed={scale === 'lg'} className="px-1 text-base font-semibold" onClick={() => setScale('lg')}>
                A+
              </button>
            </span>
          </div>
        </Container>
      </div>
      <div className="border-b border-[#f3e2c8] bg-[#fff8ef] text-center text-xs text-ink">
        <Container className="py-1">{messages.prototype}</Container>
      </div>
      <div className="bg-white">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <Emblem />
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-wide text-navy sm:text-[15px]">{messages.council}</p>
              <p className="text-xs italic text-muted">{messages.ministryLine}</p>
              <p className="mt-2 text-2xl font-semibold text-navy">{messages.product}</p>
              <p className="max-w-xl text-sm text-blue">{messages.tagline}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="inline-flex overflow-hidden rounded-sm border-2 border-navy" role="group" aria-label={messages.theme}>
              <button type="button" aria-pressed={theme === 'light'} aria-label={messages.lightMode} className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold', theme === 'light' ? 'bg-navy text-white' : 'bg-[#ffffff] text-[#123B63]')} onClick={() => setTheme('light')}>
                <Sun className="h-4 w-4" aria-hidden="true"/>
                {messages.light}
              </button>
              <button type="button" aria-pressed={theme === 'dark'} aria-label={messages.darkMode} className={cn('inline-flex items-center gap-1.5 border-l-2 border-navy px-3 py-1.5 text-sm font-semibold', theme === 'dark' ? 'bg-[#071422] text-white' : 'bg-[#ffffff] text-[#123B63]')} onClick={() => setTheme('dark')}>
                <Moon className="h-4 w-4" aria-hidden="true"/>
                {messages.dark}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-4">
            <div className="text-sm">
              <p className="flex items-center gap-2 font-semibold text-navy">
                <Lock className="h-4 w-4" aria-hidden="true"/>
                {messages.secure}
              </p>
              <p className="mt-1 text-muted">{messages.assisted}</p>
            </div>
            {user ? (<div className="flex items-center gap-3">
                <div className="text-sm">
                  <p className="font-semibold text-ink">{user.name}</p>
                  <p className="text-muted">{roleLabel(user.role, lang)}</p>
                </div>
                <Link className={buttonClass('secondary')} to={ROLE_PATH[user.role]}>
                  {messages.desk}
                </Link>
                <button type="button" className={buttonClass('secondary')} onClick={logout}>
                  <LogOut className="h-4 w-4" aria-hidden="true"/>
                  {messages.logout}
                </button>
              </div>) : (<Link className={buttonClass('primary')} to="/login">
                {messages.login}
              </Link>)}
            </div>
          </div>
        </Container>
        <div className="flex h-1" aria-hidden="true">
          <span className="h-full flex-1 bg-[#FF9933]"/>
          <span className="h-full flex-1 bg-[#ffffff]"/>
          <span className="h-full flex-1 bg-[#138808]"/>
        </div>
      </div>
      <NavBar />
    </header>);
}
