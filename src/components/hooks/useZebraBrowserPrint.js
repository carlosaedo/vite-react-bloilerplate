import { useEffect } from 'react';

const useZebraBrowserPrint = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:9100/BrowserPrint.js';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      console.log('BrowserPrint.js loaded successfully');
    };

    script.onerror = () => {
      console.error('Failed to load Zebra Browser Print script');
    };

    document.body.appendChild(script);

    return () => {
      // Optional cleanup if the component unmounts
      document.body.removeChild(script);
    };
  }, []);
};

export default useZebraBrowserPrint;
