import * as React from 'react'; 
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
 
import { Layout } from 'antd';
import 'antd/dist/antd.css';

// import 'toastr/build/toastr.min.css'; 
import Dashboard from './components/dashboard.component';
import Create from './components/create.component';
import FooterSurvey from './common/footer';
import Summary from './components/summary.component';
import Preview from './components/preview.component';
import Analyze from './components/analyze.component';
import AnalyzeBrowse from './components/analyze-browse.component';
import Cumulative from './components/cumulative.component';
import Comparison from './components/comparison.component';
import Design from './components/design.component';
import CollectorList from './components/collect/list.component';
import CollectorWeblink from './components/collect/weblink.component';
import CollectorSocial from './components/collect/social.component';
import CollectorBanner from './components/collect/banner.component';
import CollectorEmail from './components/collect/email/manage.component';
import CollectorSMS from './components/collect/sms/manage.component';
// import ExecutiveReport from './components/executive-report.component';
// import RedirectClientSurvey from './components/redirect-client-survey.component';
import PreviewClientSurvey from './components/preview-client-survey.component';
import Login from './components/login.component';
import Register from './components/register.component';
import ForgotPassword from './components/forgotpassword.component';
import Confirm from './components/confirm.component';
import ResetPassword from './components/resetpassword.component';
import Admin from './components/admin.component';
import User from './components/user.component';

import './App.css';

const App: React.FC = () => {
  return (
      <Router basename={`cxm/platform`}>

        <Layout >
        
                <Switch>
                    <Route path='/:xSite/admin' component={ Admin } />
                    <Route path='/:xSite/user/:userId' component={ User } />
                    <Route path='/:xSite/login' component={ Login } />
                    <Route path='/:xSite/register' component={ Register } />
                    <Route path='/:xSite/confirm/:token' component={ Confirm } />
                    <Route path='/:xSite/forgotpassword' component={ ForgotPassword } />
                    <Route path='/:xSite/resetpassword/:token' component={ ResetPassword } />
                    <Route path='/:xSite/create' component={ Create } />
                    <Route path='/:xSite/preview/:id' component={ Preview } />
                    <Route path='/:xSite/summary/:id' component={ Summary } />
                    {/* <Route path='/:xSite/sv' component={ RedirectClientSurvey } /> */}
                    <Route path='/:xSite/sv-preview/:surveyId/:size' component={ PreviewClientSurvey } />
                    <Route path='/:xSite/comparison/:id' component={ Comparison } />
                    <Route path='/:xSite/cumulative/:id' component={ Cumulative } />
                    <Route path='/:xSite/analyze/browse/:id' component={ AnalyzeBrowse } />
                    <Route path='/:xSite/analyze/:id' component={ Analyze } />
                    <Route path='/:xSite/design/:surveyId' component={ Design } />
                    <Route path='/:xSite/collect/list/:id' component={ CollectorList } />
                    <Route path='/:xSite/collect/weblink/:id' component={ CollectorWeblink } />
                    <Route path='/:xSite/collect/social/:id' component={ CollectorSocial } />
                    <Route path='/:xSite/collect/banner/:id' component={ CollectorBanner } />
                    <Route path='/:xSite/collect/sms/:id' component={ CollectorSMS } />
                    <Route path='/:xSite/collect/email/:id' component={ CollectorEmail } />
                    {/* <Route path='/:xSite/executive-report' component={ ExecutiveReport } /> */}
                    <Route path='/:xSite/dashboard' component={ Dashboard } />
                    <Route path='/:xSite/' component={ Dashboard } />
                </Switch>

            <FooterSurvey />

        </Layout>
        
      </Router>
  );
}

export default App;
