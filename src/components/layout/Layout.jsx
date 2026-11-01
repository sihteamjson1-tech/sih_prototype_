import { Outlet } from 'react-router-dom';
import { GovHeader } from './GovHeader.jsx';
import { SiteFooter } from './SiteFooter.jsx';
export function Layout() {
    return (<div className="flex min-h-screen flex-col">
      <GovHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </div>);
}
