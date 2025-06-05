import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from './components/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/pages/Unauthorized';
import Sidebar from './components/sidebar/Sidebar';
import Login from './components/auth/login';
import ResetPassword from './components/auth/resetPassword';
import ResetPasswordNextStep from './components/auth/resetPasswordNextStep';
import Login2FA from './components/auth/login2FA';
import Login2FARequestNewCode from './components/auth/login2FARequestNewCode';
import CreateAccount from './components/auth/createAccount';
import ValidateCreatedAccount from './components/auth/validateCreatedAccount';
import ResetPassNew from './components/pages/resetPass_new';
import ResetPassError from './components/pages/resetPass_error';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './components/pages/Home';
import Incidents from './components/pages/Incidents';
import Page404 from './components/pages/Page404';
import TrackingSearch from './components/pages/TrackingSearch';
import Tracking from './components/pages/Tracking';
import TestType00 from './components/pages/TestType-00';
import ConnectionBanner from './components/connectionBanner/ConnectionBanner';

import ShippingForm from './components/pages/ShippingFormParent';

import ClientDetails from './components/pages/ClientDetails';
import ClientNew from './components/pages/ClientNew';
import './App.css';

const App = () => {
  let params = useParams();
  const { isLoggedIn } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(250); // default expanded
  console.log(`
▗▄▄▄▖▗▄▖ ▗▄▄▖ ▗▄▄▖ ▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▄▖▗▄▄▖
  █ ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌▐▌   ▐▌     █    █  ▐▌ ▐▌
  █ ▐▌ ▐▌▐▛▀▚▖▐▛▀▚▖▐▛▀▀▘ ▝▀▚▖  █    █  ▐▛▀▚▖
  █ ▝▚▄▞▘▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖▗▄▄▞▘  █  ▗▄█▄▖▐▌ ▐▌

  W E B   S E R V I C E   P O R T A L

  `);

  return (
    <React.Fragment>
      <ConnectionBanner />
      <Sidebar onToggle={setSidebarWidth} />
      <div
        className='main-app-content'
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease',
          padding: '0px',
        }}
      >
        <div className='content-main'>
          <Header />
          <Routes>
            {isLoggedIn ? (
              <React.Fragment>
                {/* Admin-only routes */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route path='/test-type-00' element={<TestType00 />} />
                </Route>
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route path='/incidents' element={<Incidents />} />
                </Route>
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route path='/client-details/:clientId?' element={<ClientDetails />} />
                </Route>
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route path='/client-new' element={<ClientNew />} />
                </Route>
              </React.Fragment>
            ) : (
              <Route path='*' element={<Navigate to='/login' replace />} />
            )}
            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path='/resetpassword' element={<ResetPassword />} />
            <Route path='/login' element={<Login />} />
            <Route path='/resetpass-new' element={<ResetPassNew />} />
            <Route path='/resetpass-error' element={<ResetPassError />} />
            <Route path='/reset-password-next-step' element={<ResetPasswordNextStep />} />
            <Route path='/login-2fa/:userEmail' element={<Login2FA />} />
            <Route
              path='/login-2fa-request-new-code/:userEmail'
              element={<Login2FARequestNewCode />}
            />
            <Route path='/create-account' element={<CreateAccount />} />
            <Route path='/validate-created-account' element={<ValidateCreatedAccount />} />

            <Route path='/' element={<Home />} />
            <Route path='*' element={<Navigate to='/' replace />} />
            <Route path='/404' element={<Page404 />} />
            <Route path='/tracking' element={<TrackingSearch />} />
            <Route path='/tracking/:trackingNumber' element={<Tracking />} />
            <Route path='/shipping-form' element={<ShippingForm sidebarWidth={sidebarWidth} />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;
