'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { APP_NAMES, type AppKey, isPhone, useApps, useDesktop } from './DesktopContext';
import { AppIcon } from './Icons';

const DOCK: (AppKey | '|')[] = ['finder', 'helpdesk', 'about', 'services', 'career', 'calendar', 'quote', 'mail', 'terminal', 'settings', '|', 'trash'];
const BASE = 54, MAX = 82;

export default function Dock() {
  const d = useDesktop(), apps = useApps();
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [bouncing, setBouncing] = useState<Set<AppKey>>(new Set());
  const seen = useRef(new Set<AppKey>());
  const running = new Set(d.wins.map(w => w.app));

  // Bounce an app's icon the first time it opens.
  useEffect(() => {
    for (const w of d.wins) if (!seen.current.has(w.app)) {
      seen.current.add(w.app);
      setBouncing(b => new Set(b).add(w.app));
      setTimeout(() => setBouncing(b => { const n = new Set(b); n.delete(w.app); return n; }), 1100);
    }
  }, [d.wins]);

  const magnify = (e: PointerEvent<HTMLDivElement>) => {
    if (isPhone() || e.pointerType !== 'mouse') return;
    const next: Record<string, number> = {};
    e.currentTarget.querySelectorAll<HTMLElement>('.dock-item').forEach(it => {
      const r = it.getBoundingClientRect(), dist = Math.abs(e.clientX - (r.left + r.width / 2));
      next[it.dataset.app!] = BASE + (MAX - BASE) * Math.max(0, 1 - dist / 150) ** 2;
    });
    setSizes(next);
  };
  const click = (k: AppKey) => {
    const mine = d.wins.filter(w => w.app === k);
    const minimized = mine.find(w => w.min);
    if (minimized) { d.setMin(minimized.id, false); return; }
    if (mine.length) { d.focus(mine.sort((a, b) => b.z - a.z)[0].id); return; }
    apps.launch[k]();
  };

  return (
    <div className="dock-wrap">
      <div className="dock" onPointerMove={magnify} onPointerLeave={() => setSizes({})}>
        {DOCK.map((k, i) => k === '|' ? <div key={i} className="dock-sep" /> : (
          <button key={k} data-app={k} aria-label={APP_NAMES[k]} onClick={() => click(k)}
            className={['dock-item', running.has(k) && k !== 'trash' && 'running', bouncing.has(k) && 'bounce'].filter(Boolean).join(' ')}
            style={sizes[k] ? { width: sizes[k], height: sizes[k] } : undefined}>
            <AppIcon k={k === 'preview' ? 'finder' : k} />
            <span className="tip">{APP_NAMES[k]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
