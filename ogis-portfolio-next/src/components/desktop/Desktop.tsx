'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import About from '../apps/About';
import AboutSite from '../apps/AboutSite';
import Career from '../apps/Career';
import Finder from '../apps/Finder';
import HelpDesk from '../apps/HelpDesk';
import Mail from '../apps/Mail';
import ProjectWindow from '../apps/ProjectWindow';
import QuoteCalculator from '../apps/QuoteCalculator';
import Resume from '../apps/Resume';
import Services from '../apps/Services';
import Terminal from '../apps/Terminal';
import { DesktopProvider, isPhone, useApps, useDesktop, type Win, type WinKind } from './DesktopContext';
import DesktopIcons from './DesktopIcons';
import Dock from './Dock';
import LockScreen from './LockScreen';
import Menu, { type MenuItem } from './Menu';
import MenuBar from './MenuBar';
import Spotlight from './Spotlight';
import Wallpaper, { cycleWallpaper } from './Wallpaper';

const WINDOWS: Record<WinKind, ComponentType<{ win: Win }>> = {
  finder: Finder, about: About, site: AboutSite, services: Services, career: Career,
  project: ProjectWindow, resume: Resume, mail: Mail, terminal: Terminal, helpdesk: HelpDesk, quote: QuoteCalculator
};

function Shell() {
  const d = useDesktop(), apps = useApps();
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const firstUnlock = useRef(true);

  const unlock = () => {
    if (!d.locked) return;
    d.setLocked(false);
    if (firstUnlock.current && !d.wins.length) {
      firstUnlock.current = false;
      setTimeout(() => { if (!isPhone()) apps.services('support'); apps.helpdesk(); }, 450);
    }
  };

  useEffect(() => { document.body.classList.toggle('locked', d.locked); }, [d.locked]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (d.locked) { unlock(); e.preventDefault(); return; }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); d.setSpot(!d.spot); }
      if (e.key === 'Escape') { d.setSpot(false); setCtx(null); }
    };
    const down = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (d.spot && !t.closest('.spot,[aria-label="Spotlight search"]')) d.setSpot(false);
      if (ctx && !t.closest('.menu')) setCtx(null);
    };
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', down);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', down); };
  });

  const ctxItems: MenuItem[] = [['New Finder Window', '', () => apps.finder('Projects')], '-', ['Change Wallpaper', '', cycleWallpaper],
    ['Open Terminal', '', apps.terminal], '-', ['Get Info', '', apps.site], ['Lock Screen', '', () => d.setLocked(true)]];

  return (
    <div onContextMenu={e => {
      if ((e.target as HTMLElement).closest('.win,.dock,.menubar,.menu')) return;
      e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY });
    }}>
      <Wallpaper />
      <MenuBar />
      <DesktopIcons />
      <div className="desk">
        {d.wins.map(w => { const W = WINDOWS[w.kind]; return <W key={w.id} win={w} />; })}
      </div>
      <Dock />
      {d.spot && <Spotlight />}
      {ctx && <Menu items={ctxItems} x={ctx.x} y={ctx.y} onClose={() => setCtx(null)} />}
      {d.toastMsg && <div className="spot" style={{ top: 'auto', bottom: 110, width: 'auto', padding: '12px 20px', borderRadius: 999, fontWeight: 500 }}>{d.toastMsg}</div>}
      <LockScreen locked={d.locked} onUnlock={unlock} />
    </div>
  );
}

export default function Desktop() {
  return <DesktopProvider><Shell /></DesktopProvider>;
}
