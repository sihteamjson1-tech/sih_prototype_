import { Route, Routes } from 'react-router-dom';
import { MobileShell } from './MobileShell.jsx';
import { MobileAbout } from './pages/MobileAbout.jsx';
import { MobileAdmin } from './pages/MobileAdmin.jsx';
import { MobileApplicant } from './pages/MobileApplicant.jsx';
import { MobileCompliance } from './pages/MobileCompliance.jsx';
import { MobileComplianceDesk } from './pages/MobileComplianceDesk.jsx';
import { MobileDocuments } from './pages/MobileDocuments.jsx';
import { MobileHelp } from './pages/MobileHelp.jsx';
import { MobileHome } from './pages/MobileHome.jsx';
import { MobileInfrastructure } from './pages/MobileInfrastructure.jsx';
import { MobileLogin } from './pages/MobileLogin.jsx';
import { MobileNotFound } from './pages/MobileNotFound.jsx';
import { MobileOfficer } from './pages/MobileOfficer.jsx';
import { MobilePolicy } from './pages/MobilePolicy.jsx';
import { MobileReports } from './pages/MobileReports.jsx';
import { MobileTrack } from './pages/MobileTrack.jsx';
import { MobileVerify } from './pages/MobileVerify.jsx';

export function MobileApp() {
    return (<Routes>
      <Route element={<MobileShell />}>
        <Route index element={<MobileHome />}/>
        <Route path="about" element={<MobileAbout />}/>
        <Route path="verify" element={<MobileVerify />}/>
        <Route path="documents" element={<MobileDocuments />}/>
        <Route path="compliance" element={<MobileCompliance />}/>
        <Route path="track" element={<MobileTrack />}/>
        <Route path="reports" element={<MobileReports />}/>
        <Route path="reports/:applicationId" element={<MobileReports />}/>
        <Route path="infrastructure" element={<MobileInfrastructure />}/>
        <Route path="login" element={<MobileLogin />}/>
        <Route path="help" element={<MobileHelp />}/>
        <Route path="privacy" element={<MobilePolicy kind="privacy"/>}/>
        <Route path="terms" element={<MobilePolicy kind="terms"/>}/>
        <Route path="disclaimer" element={<MobilePolicy kind="disclaimer"/>}/>
        <Route path="security" element={<MobilePolicy kind="security"/>}/>
        <Route path="dashboard/applicant" element={<MobileApplicant />}/>
        <Route path="dashboard/officer" element={<MobileOfficer />}/>
        <Route path="dashboard/compliance" element={<MobileComplianceDesk />}/>
        <Route path="dashboard/admin" element={<MobileAdmin />}/>
        <Route path="*" element={<MobileNotFound />}/>
      </Route>
    </Routes>);
}
