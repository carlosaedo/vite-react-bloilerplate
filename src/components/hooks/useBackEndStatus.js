import { useState, useEffect } from 'react';

import torrestirApi from '../api/torrestirApi';

const useBackendStatus = (interval = 10000) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const ping = async () => {
      try {
        const response = await torrestirApi('/auth/ping', { cache: 'no-store' });
        const text = await response.text();
        if (isMounted) setIsOnline(text === 'pong');
      } catch {
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
