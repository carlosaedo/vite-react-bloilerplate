import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/pages/Home';
import Page404 from './components/pages/Page404';
import TrackingSearch from './components/pages/TrackingSearch';
import Tracking from './components/pages/Tracking';
import TestType00 from './components/pages/TestType-00';
import './App.css';

function App() {
  console.log(`
▗▄▄▄▖▗▄▖ ▗▄▄▖ ▗▄▄▖ ▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▄▖▗▄▄▖
  █ ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌▐▌   ▐▌     █    █  ▐▌ ▐▌
  █ ▐▌ ▐▌▐▛▀▚▖▐▛▀▚▖▐▛▀▀▘ ▝▀▚▖  █    █  ▐▛▀▚▖
  █ ▝▚▄▞▘▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖▗▄▄▞▘  █  ▗▄█▄▖▐▌ ▐▌

  W E B   S E R V I C E   P O R T A L

  `);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='*' element={<Navigate to='/404' replace />} />
      <Route path='/404' element={<Page404 />} />
      <Route path='/tracking' element={<TrackingSearch />} />
      <Route path='/tracking/:trackingNumber' element={<Tracking />} />
      <Route path='/test-type-00' element={<TestType00 />} />
    </Routes>
  );
}

export default App;
