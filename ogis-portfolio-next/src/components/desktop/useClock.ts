'use client';

import { useEffect, useState } from 'react';

/** Current time, refreshed every 10 seconds. Null until mounted so server and client markup match. */
export function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(t);
  }, []);
  return now;
}
