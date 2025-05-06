import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './TrackingSearch.css';

const TrackingSearch = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (trackingNumber.trim()) {
      // Navigate to the tracking page with the tracking number as a parameter
      navigate(`/tracking/${trackingNumber.trim()}`);
    }
  };
  return (
    <div className='tracking-search-container'>
      <p>Search for your tracking information here.</p>

      <div className='search-box'>
        <input
          className='trackingInput'
          type='text'
          placeholder='Enter tracking number'
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <button className='button' onClick={handleSearch} disabled={!trackingNumber.trim()}>
          Search
        </button>
      </div>
    </div>
  );
};

export default TrackingSearch;
