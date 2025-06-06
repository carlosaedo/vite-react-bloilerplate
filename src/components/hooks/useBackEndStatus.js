import { useState, useEffect } from 'react';

import torrestirApi from '../api/torrestirApi';

const useBackendStatus = (interval = 30000) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const ping = async () => {
      try {
        const response = await torrestirApi.get('/api/ping', {
          headers: { 'Cache-Control': 'no-store' },
        });
        const text = response.data;
        if (isMounted) setIsOnline(text === 'Pong');
        //if (isMounted) setIsOnline(true);
      } catch (error) {
        if (isMounted) setIsOnline(false);
      }
    };

    // Initial ping
    ping();
    const intervalId = setInterval(ping, interval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [interval]);

  return isOnline;
};

export default useBackendStatus;
