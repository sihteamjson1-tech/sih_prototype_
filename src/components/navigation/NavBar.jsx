import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { cn } from '../../utils/format.js';
import { Container } from '../layout/Chrome.jsx';
const services = [
    { to: '/verify?type=eoa', key: 'eoa' },
    { to: '/verify?type=new-institution', key: 'newInstitution' },
    { to: '/verify?type=details-update', key: 'change' },
    { to: '/verify?type=faculty-infrastructure', key: 'faculty' },
    { to: '/verify?type=other', key: 'other' },
];
export function NavBar() {
    const { messages } = useLanguage();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [mobile, setMobile] = useState(false);
    const routeKey = `${location.pathname}${location.search}`;
    const [routeMark, setRouteMark] = useState(routeKey);
    if (routeMark !== routeKey) {
        setRouteMark(routeKey);
        setOpen(false);
        setMobile(false);
    }
    const menuId = useId();
    const wrapRef = useRef(null);
    useEffect(() => {
        const onPointer = (event) => {
            if (!wrapRef.current?.contains(event.target))
                setOpen(false);
        };
        const onKey = (event) => {
            if (event.key === 'Escape')
                setOpen(false);
        };
        window.addEventListener('mousedown', onPointer);
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('mousedown', onPointer);
            window.removeEventListener('keydown', onKey);
        };
    }, []);
    const itemClass = ({ isActive }) => cn('block px-3 py-3 text-sm font-medium text-white hover:bg-white/10', isActive && 'bg-white/10 shadow-[inset_0_-3px_0_#E89B3C]');
    const serviceActive = location.pathname === '/verify';
    return (<nav className="sticky top-0 z-40 bg-navy text-white" aria-label="Primary">
      <Container className="flex items-center justify-between lg:justify-start">
        <button type="button" className="inline-flex items-center gap-2 px-1 py-3 text-sm font-semibold lg:hidden" aria-expanded={mobile} aria-controls={menuId} onClick={() => setMobile((value) => !value)}>
          {mobile ? <X className="h-5 w-5" aria-hidden="true"/> : <Menu className="h-5 w-5" aria-hidden="true"/>}
          {mobile ? messages.closeMenu : messages.menu}
        </button>
        <div id={menuId} className={cn('w-full flex-col lg:flex lg:w-auto lg:flex-row', mobile ? 'flex' : 'hidden')}>
          <NavLink to="/" end className={itemClass}>
            {messages.home}
          </NavLink>
          <NavLink to="/about" className={itemClass}>
            {messages.about}
          </NavLink>
          <div ref={wrapRef} className="relative">
            <button type="button" className={cn('flex w-full items-center gap-1 px-3 py-3 text-left text-sm font-medium text-white hover:bg-white/10', serviceActive && 'bg-white/10 shadow-[inset_0_-3px_0_#E89B3C]')} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((value) => !value)}>
              {messages.services}
              <ChevronDown className="h-4 w-4" aria-hidden="true"/>
            </button>
            {open ? (<div className="z-50 min-w-72 border border-line bg-white py-1 text-ink shadow-sm lg:absolute lg:top-full lg:left-0">
                {services.map((item) => (<NavLink key={item.to} to={item.to} className="block px-4 py-2 text-sm hover:bg-canvas">
                    {messages[item.key]}
                  </NavLink>))}
              </div>) : null}
          </div>
          <NavLink to="/documents" className={itemClass}>
            {messages.documents}
          </NavLink>
          <NavLink to="/compliance" className={itemClass}>
            {messages.compliance}
          </NavLink>
          <NavLink to="/track" className={itemClass}>
            {messages.track}
          </NavLink>
          <NavLink to="/help" className={itemClass}>
            {messages.help}
          </NavLink>
        </div>
      </Container>
    </nav>);
}
