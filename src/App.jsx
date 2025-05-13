import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ApiProvider } from './components/context/ApiContext';
import Sidebar from './components/sidebar/Sidebar';
import Login from './components/auth/login';
import ResetPassword from './components/auth/resetPassword';
import ResetPassNew from './components/pages/resetPass_new';
import ResetPassError from './components/pages/resetPass_error';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './components/pages/Home';
import Page404 from './components/pages/Page404';
import TrackingSearch from './components/pages/TrackingSearch';
import Tracking from './components/pages/Tracking';
import TestType00 from './components/pages/TestType-00';
import ConnectionBanner from './components/connectionBanner/ConnectionBanner';
import './App.css';

const App = () => {
  const [sidebarWidth, setSidebarWidth] = useState(250); // default expanded
  const isAuthenticated = !!localStorage.getItem('token');
  console.log(`
▗▄▄▄▖▗▄▖ ▗▄▄▖ ▗▄▄▖ ▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▄▖▗▄▄▖
  █ ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌▐▌   ▐▌     █    █  ▐▌ ▐▌
  █ ▐▌ ▐▌▐▛▀▚▖▐▛▀▚▖▐▛▀▀▘ ▝▀▚▖  █    █  ▐▛▀▚▖
  █ ▝▚▄▞▘▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖▗▄▄▞▘  █  ▗▄█▄▖▐▌ ▐▌

  W E B   S E R V I C E   P O R T A L

  `);

  return (
    <>
      <ApiProvider>
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
              {isAuthenticated ? (
                <>
                  <Route path='/test-type-00' element={<TestType00 />} />
                </>
              ) : (
                <Route path='*' element={<Navigate to='/login' replace />} />
              )}
              <Route path='/resetpassword' element={<ResetPassword />} />
              <Route path='/login' element={<Login />} />
              <Route path='/resetpass-new' element={<ResetPassNew />} />
              <Route path='/resetpass-error' element={<ResetPassError />} />

              <Route path='/' element={<Home />} />
              <Route path='*' element={<Navigate to='/' replace />} />
              <Route path='/404' element={<Page404 />} />
              <Route path='/tracking' element={<TrackingSearch />} />
              <Route path='/tracking/:trackingNumber' element={<Tracking />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </ApiProvider>
    </>
  );
};

export default App;
