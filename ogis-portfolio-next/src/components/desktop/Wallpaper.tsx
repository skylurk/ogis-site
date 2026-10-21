'use client';

import { useEffect, useState } from 'react';

export const WALLPAPERS = [
  { v: '', name: 'Tahoe', note: 'Day in light mode, night in dark' },
  { v: 'dusk', name: 'Dusk', note: 'Warm evening' },
  { v: 'lake', name: 'Lake', note: 'Cool and calm' },
  { v: 'night', name: 'Night', note: 'Always dark' }
];
const EVENT = 'ogis:wallpaper';
const KEY = 'ogis-wall';

const readIndex = () => { try { return +(localStorage.getItem(KEY) || 0) % WALLPAPERS.length; } catch { return 0; } };

/** Sets the wallpaper by index, or moves to the next one when no index is given. */
export function setWallpaper(i?: number) { window.dispatchEvent(new CustomEvent(EVENT, { detail: i })); }
export const cycleWallpaper = () => setWallpaper();

/** The current wallpaper index, kept in sync across the desktop and System Settings. */
export function useWallpaper() {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(readIndex());
    const on = (e: Event) => setI(n => {
      const d = (e as CustomEvent<number | undefined>).detail;
      const v = d === undefined ? (n + 1) % WALLPAPERS.length : d;
      try { localStorage.setItem(KEY, String(v)); } catch { /* private mode */ }
      return v;
    });
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return i;
}

/** The wallpaper artwork. `mini` draws a small preview for System Settings. */
export function WallArt({ v, mini = false }: { v: string; mini?: boolean }) {
  return (
    <div className={'wall' + (mini ? ' mini' : '')} data-v={v}>
      <i className="b1" /><i className="b2" /><i className="b3" />
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M0 600C300 500 620 690 930 590S1400 450 1600 540V1000H0Z" fill="rgba(255,255,255,.10)" />
        <path d="M0 600C300 500 620 690 930 590S1400 450 1600 540" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1.4" />
        <path d="M0 705C360 625 700 810 1060 705S1460 625 1600 680V1000H0Z" fill="rgba(10,40,140,.22)" />
        <path d="M0 705C360 625 700 810 1060 705S1460 625 1600 680" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1" />
        <path d="M0 830C420 760 820 905 1210 820S1510 780 1600 800V1000H0Z" fill="rgba(4,16,80,.32)" />
      </svg>
    </div>
  );
}

export default function Wallpaper() {
  const i = useWallpaper();
  return <WallArt v={WALLPAPERS[i].v} />;
}
