'use client';

import { useEffect, useState } from 'react';

const WALLS = ['', 'dusk', 'lake', 'night'];
const EVENT = 'ogis:wallpaper';
const KEY = 'ogis-wall';

/** Moves to the next wallpaper. Callable from anywhere (menus, windows). */
export function cycleWallpaper() { window.dispatchEvent(new Event(EVENT)); }

export default function Wallpaper() {
  const [i, setI] = useState(0);
  useEffect(() => {
    try { setI(+(localStorage.getItem(KEY) || 0) % WALLS.length); } catch {}
    const next = () => setI(n => { const v = (n + 1) % WALLS.length; try { localStorage.setItem(KEY, String(v)); } catch {} return v; });
    window.addEventListener(EVENT, next);
    return () => window.removeEventListener(EVENT, next);
  }, []);
  return (
    <div className="wall" data-v={WALLS[i]}>
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
