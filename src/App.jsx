import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/pages/Home';
import Page404 from './components/pages/Page404';
import TrackingSearch from './components/pages/TrackingSearch';
import Tracking from './components/pages/Tracking';
import './App.css';

function App() {
  console.log(`
▗▄▄▄▖▗▄▖ ▗▄▄▖ ▗▄▄▖ ▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▄▖▗▄▄▖
  █ ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌▐▌   ▐▌     █    █  ▐▌ ▐▌
  █ ▐▌ ▐▌▐▛▀▚▖▐▛▀▚▖▐▛▀▀▘ ▝▀▚▖  █    █  ▐▛▀▚▖
  █ ▝▚▄▞▘▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖▗▄▄▞▘  █  ▗▄█▄▖▐▌ ▐▌

  T R A C K I N G   S E R V I C E

  `);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='*' element={<Navigate to='/404' replace />} />
      <Route path='/404' element={<Page404 />} />
      <Route path='/tracking' element={<TrackingSearch />} />
      <Route path='/tracking/:trackingNumber' element={<Tracking />} />
    </Routes>
  );
}

export default App;
