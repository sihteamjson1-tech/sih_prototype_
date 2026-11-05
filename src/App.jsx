import { BrowserRouter } from 'react-router-dom';
import { DesktopApp } from './components/desktop/DesktopApp.jsx';
import { MobileApp } from './components/mobile/MobileApp.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { PortalProvider } from './context/PortalContext.jsx';
import { SessionProvider } from './context/SessionContext.jsx';
import { UiProvider } from './context/UiContext.jsx';
import { ScrollToTop } from './hooks/usePageTitle.js';
import { useDeviceLayout } from './hooks/useDeviceLayout.js';

function ExperienceSwitch() {
    const { isMobile } = useDeviceLayout();
    return isMobile ? <MobileApp /> : <DesktopApp />;
}

export default function App() {
    return (<LanguageProvider>
      <UiProvider>
        <SessionProvider>
          <PortalProvider>
            <BrowserRouter>
              <ScrollToTop />
              <ExperienceSwitch />
            </BrowserRouter>
          </PortalProvider>
        </SessionProvider>
      </UiProvider>
    </LanguageProvider>);
}
