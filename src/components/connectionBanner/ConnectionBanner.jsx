import React from 'react';
import useBackendStatus from '../hooks/useBackEndStatus';
import { FaExclamationTriangle } from 'react-icons/fa';
import './ConnectionBanner.css'; // optional for styling

const ConnectionBanner = () => {
  const isOnline = useBackendStatus();

  console.log('isOnline: ', isOnline);

  if (isOnline) return null;

  return (
    <div className='connection-banner'>
      <span className='connection-banner-icon'>
        <FaExclamationTriangle />
      </span>{' '}
      Lost connection to server. Trying to reconnect...
    </div>
  );
};

export default ConnectionBanner;
