import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { PortalProvider } from './context/PortalContext.jsx';
import { SessionProvider } from './context/SessionContext.jsx';
import { UiProvider } from './context/UiContext.jsx';
import { Layout } from './components/layout/Layout.jsx';
import { ScrollToTop } from './hooks/usePageTitle.js';
import { About } from './pages/About.jsx';
import { ApplicationVerification } from './pages/ApplicationVerification.jsx';
import { ComplianceChecker } from './pages/ComplianceChecker.jsx';
import { DocumentVerification } from './pages/DocumentVerification.jsx';
import { Help } from './pages/Help.jsx';
import { Home } from './pages/Home.jsx';
import { InfrastructureReview } from './pages/InfrastructureReview.jsx';
import { Login } from './pages/Login.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { PolicyPage } from './pages/PolicyPage.jsx';
import { Reports } from './pages/Reports.jsx';
import { TrackApplication } from './pages/TrackApplication.jsx';
import { AdminDashboard } from './pages/dashboards/AdminDashboard.jsx';
import { ApplicantDashboard } from './pages/dashboards/ApplicantDashboard.jsx';
import { ComplianceDashboard } from './pages/dashboards/ComplianceDashboard.jsx';
import { OfficerDashboard } from './pages/dashboards/OfficerDashboard.jsx';
export default function App() {
    return (<LanguageProvider>
      <UiProvider>
        <SessionProvider>
          <PortalProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />}/>
                  <Route path="about" element={<About />}/>
                  <Route path="verify" element={<ApplicationVerification />}/>
                  <Route path="documents" element={<DocumentVerification />}/>
                  <Route path="compliance" element={<ComplianceChecker />}/>
                  <Route path="track" element={<TrackApplication />}/>
                  <Route path="reports" element={<Reports />}/>
                  <Route path="reports/:applicationId" element={<Reports />}/>
                  <Route path="infrastructure" element={<InfrastructureReview />}/>
                  <Route path="login" element={<Login />}/>
                  <Route path="help" element={<Help />}/>
                  <Route path="privacy" element={<PolicyPage kind="privacy"/>}/>
                  <Route path="terms" element={<PolicyPage kind="terms"/>}/>
                  <Route path="disclaimer" element={<PolicyPage kind="disclaimer"/>}/>
                  <Route path="security" element={<PolicyPage kind="security"/>}/>
                  <Route path="dashboard/applicant" element={<ApplicantDashboard />}/>
                  <Route path="dashboard/officer" element={<OfficerDashboard />}/>
                  <Route path="dashboard/compliance" element={<ComplianceDashboard />}/>
                  <Route path="dashboard/admin" element={<AdminDashboard />}/>
                  <Route path="*" element={<NotFound />}/>
                </Route>
              </Routes>
            </BrowserRouter>
          </PortalProvider>
        </SessionProvider>
      </UiProvider>
    </LanguageProvider>);
}
