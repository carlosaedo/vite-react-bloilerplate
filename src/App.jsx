import { Routes, Route, Navigate } from 'react-router-dom';
import { ApiProvider } from './components/context/ApiContext';
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
import './App.css';

function App() {
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
      <Header />
      <div className='content-main'>
        <ApiProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='*' element={<Navigate to='/404' replace />} />
            <Route path='/404' element={<Page404 />} />
            <Route path='/tracking' element={<TrackingSearch />} />
            <Route path='/tracking/:trackingNumber' element={<Tracking />} />
            <Route path='/test-type-00' element={<TestType00 />} />

            <Route path='/resetpassword' element={<ResetPassword />} />
            <Route path='/login' element={<Login />} />
            <Route path='/resetpass-new' element={<ResetPassNew />} />
            <Route path='/resetpass-error' element={<ResetPassError />} />
          </Routes>
        </ApiProvider>
      </div>
      <Footer />
    </>
  );
}

export default App;
