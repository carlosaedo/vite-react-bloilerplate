// hooks/useIsMobile.js
import { useEffect, useState } from 'react';

export default function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Set initial value
    setIsMobile(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return isMobile;
}
