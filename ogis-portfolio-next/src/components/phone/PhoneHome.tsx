'use client';

import { useCallback, useState, type MouseEvent, type ReactNode } from 'react';
import { OWNER, PROJECTS, SERVICES, WORK } from '@/data/portfolio';
import { SVG } from '@/lib/icons';
import { type AppKey, useApps, useDesktop } from '../desktop/DesktopContext';
import { AppIcon, OrgDot, ProjIcon, Svg } from '../desktop/Icons';
import { setLaunchOrigin } from '../desktop/usePhone';
import ControlCenter from './ControlCenter';

type Tile = { label: string; icon: ReactNode; run: () => void; app?: AppKey };

/** An iOS-style folder icon: a frosted tile showing up to nine tiny icons. */
function Folder({ items }: { items: ReactNode[] }) {
  return <div className="ios-folder">{items.slice(0, 9).map((n, i) => <span key={i}>{n}</span>)}</div>;
}

/** The iPhone home screen: a status widget, an app grid with folders, Search and the Dock. */
export default function PhoneHome() {
  const apps = useApps();
  const { setSpot, wins } = useDesktop();
  const running = new Set(wins.map(w => w.app));
  const [cc, setCc] = useState(false);
  const closeCc = useCallback(() => setCc(false), []);

  const grid: Tile[] = [
    { label: 'Services', icon: <AppIcon k="services" />, run: () => apps.services() },
    { label: 'Projects', icon: <Folder items={PROJECTS.map(p => <ProjIcon key={p.id} p={p} />)} />, run: () => apps.finder('Projects') },
    { label: 'Career', icon: <AppIcon k="career" />, run: () => apps.career() },
    { label: 'Calendar', icon: <AppIcon k="calendar" />, run: () => apps.calendar() },
    { label: 'Quote', icon: <AppIcon k="quote" />, run: apps.quote },
    { label: 'Résumé', icon: <AppIcon k="resume" />, run: apps.resume },
    { label: 'About', icon: <AppIcon k="about" />, run: apps.about },
    { label: 'NGO Work', icon: <Folder items={[<AppIcon key="ngo" k="ngo" />, ...WORK.filter(w => w.ngo).map(w => <OrgDot key={w.org} w={w} />)]} />, run: () => apps.finder('NGO Work') },
    { label: 'Settings', icon: <AppIcon k="settings" />, run: () => apps.settings() },
    { label: 'Trash', icon: <AppIcon k="trash" />, run: () => apps.finder('Trash') },
    { label: 'Site Info', icon: <AppIcon k="site" />, run: apps.site }
  ];
  const dock: Tile[] = [
    { label: 'Help Desk', icon: <AppIcon k="helpdesk" />, run: () => apps.helpdesk(), app: 'helpdesk' },
    { label: 'Mail', icon: <AppIcon k="mail" />, run: () => apps.mail(), app: 'mail' },
    { label: 'Files', icon: <AppIcon k="finder" />, run: () => apps.finder('Services'), app: 'finder' },
    { label: 'Terminal', icon: <AppIcon k="terminal" />, run: apps.terminal, app: 'terminal' }
  ];
  const launch = (t: Tile) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = (e.currentTarget.querySelector('.ios-icon') ?? e.currentTarget).getBoundingClientRect();
    setLaunchOrigin(r.left + r.width / 2, r.top + r.height / 2);
    t.run();
  };
  const tile = (t: Tile, showLabel = true) => (
    <button key={t.label} className="ios-tile" onClick={launch(t)} aria-label={t.label}>
      <span className="ios-icon">{t.icon}</span>
      {showLabel && <span className="ios-label">{t.label}</span>}
    </button>
  );
  const building = PROJECTS.find(p => p.status);

  return (
    <div className="ios-home">
      <ControlCenter open={cc} onClose={closeCc} />
      <section className="ios-widget" aria-label="Status">
        <div className="w-top">
          <span className="avatar">{OWNER.initials}</span>
          <div><b>{OWNER.name}</b><small>{OWNER.studio}</small></div>
        </div>
        <div className="w-status"><i className="dot" />Available for new work</div>
        <div className="w-sub">{SERVICES.map(s => s.name.replace(' Services', '')).join(' · ')}</div>
        {building && <div className="w-sub">Now building: {building.name}</div>}
        <div className="w-actions">
          <button onClick={launch(dock[0])}>Get help</button>
          <button onClick={launch(grid[3])}>Book a call</button>
        </div>
      </section>
      <div className="ios-grid">{grid.map(t => tile(t))}</div>
      <div className="ios-spacer" />
      <div className="ios-search-row">
        <button className="ios-search" onClick={() => setSpot(true)}><Svg html={SVG.search} />Search</button>
        <button className="ios-cc-btn" onClick={() => setCc(true)} aria-label="Open Control Center: Wi-Fi, battery and settings" aria-expanded={cc}>
          <Svg html={SVG.up} />
        </button>
      </div>
      <a className="ios-simple" href="/simple">Simple view</a>
      <nav className="ios-dock" aria-label="Dock">
        {dock.map(t => (
          <span key={t.label} className={'ios-dock-slot' + (t.app && running.has(t.app) ? ' running' : '')}>
            {tile(t, false)}
          </span>
        ))}
      </nav>
    </div>
  );
}
