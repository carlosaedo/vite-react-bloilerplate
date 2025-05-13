import { useState, useEffect } from 'react';

import torrestirApi from '../api/torrestirApi';

const useBackendStatus = (interval = 10000) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const ping = async () => {
      try {
        const response = await torrestirApi.get('/auth/ping', {
          headers: { 'Cache-Control': 'no-store' },
        });
        const text = response.data;
        console.log('response: ', text);
        if (isMounted) setIsOnline(text === 'pong');
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
