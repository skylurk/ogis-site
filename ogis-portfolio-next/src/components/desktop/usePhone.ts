'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(max-width: 700px)';
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};

/** True on phone-sized screens, where the site switches to the iPhone layout. False during server render. */
export function usePhone() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}

// Where the last home-screen icon was tapped, so the app can grow out of it like on iOS.
let origin: { x: number; y: number } | null = null;
export const setLaunchOrigin = (x: number, y: number) => { origin = { x, y }; };
export const takeLaunchOrigin = () => { const o = origin; origin = null; return o; };
