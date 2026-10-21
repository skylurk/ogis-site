'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { PROJECTS } from '@/data/portfolio';
import { BATTERY, NETWORKS, WIFI_HELP } from '@/data/status';
import { SVG } from '@/lib/icons';
import { applyReduceMotion, applyTheme, readReduceMotion } from '@/lib/prefs';
import { useApps, useDesktop } from '../desktop/DesktopContext';
import { AppIcon, Svg } from '../desktop/Icons';

const isDark = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
};

function Bars({ n }: { n: number }) {
  return <span className="cc-bars" aria-label={`${n} of 3 bars`}>{[1, 2, 3].map(i => <i key={i} className={i <= n ? 'on' : ''} />)}</span>;
}

function Cup({ level }: { level: number }) {
  return (
    <svg className="cc-cup" viewBox="0 0 40 40" aria-hidden="true">
      <defs><clipPath id="cupClip"><path d="M8 13h20v13a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z" /></clipPath></defs>
      <rect x="6" y={34 - 21 * (level / 100)} width="24" height="22" fill="#c98b4e" clipPath="url(#cupClip)" />
      <path d="M8 13h20v13a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z" fill="none" stroke="#fff" strokeWidth="2.2" />
      <path d="M28 16h3a4 4 0 0 1 0 8h-3" fill="none" stroke="#fff" strokeWidth="2.2" />
      <path className="steam" d="M14 9c-2-2 2-3 0-5M20 9c-2-2 2-3 0-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** iOS-style Control Center for phones: Wi-Fi and coffee "battery" jokes, appearance toggles and shortcuts. */
export default function ControlCenter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const apps = useApps();
  const { toast } = useDesktop();
  const [dark, setDark] = useState(false);
  const [motion, setMotion] = useState(false);
  const [showNets, setShowNets] = useState(false);
  const [dragY, setDragY] = useState(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (!open) { setShowNets(false); return; }
    setDark(isDark()); setMotion(readReduceMotion());
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  const go = (fn: () => void) => { onClose(); setTimeout(fn, 180); };
  const toggleDark = () => { const v = !dark; setDark(v); applyTheme(v ? 'dark' : 'light'); };
  const toggleMotion = () => { const v = !motion; setMotion(v); applyReduceMotion(v); };

  // Swipe the panel up to close, like iOS.
  const down = (e: PointerEvent) => { start.current = e.clientY; };
  const move = (e: PointerEvent) => { if (start.current != null) setDragY(Math.min(0, e.clientY - start.current)); };
  const up = () => { if (dragY < -70) onClose(); setDragY(0); start.current = null; };
  const building = PROJECTS.find(p => p.status);

  return (
    <div className={'cc' + (open ? ' open' : '')} aria-hidden={!open} onClick={onClose}>
      <div className="cc-panel" role="dialog" aria-label="Control Center" onClick={e => e.stopPropagation()}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}>

        <div className="cc-grid">
          <div className="cc-tile cc-wide cc-conn">
            <button className="cc-row" onClick={() => setShowNets(s => !s)} aria-expanded={showNets}>
              <span className="cc-dot on"><Svg html={SVG.wifi} /></span>
              <span className="cc-text"><b>Wi-Fi</b><small>{NETWORKS.find(n => n.connected)?.name}</small></span>
              <span className="cc-chev">{showNets ? '⌃' : '⌄'}</span>
            </button>
          </div>

          <div className="cc-tile cc-wide cc-battery" role="status">
            <Cup level={BATTERY.level} />
            <span className="cc-text"><b>{BATTERY.title}</b><small>{BATTERY.lines[0]}</small></span>
          </div>

          {showNets && (
            <div className="cc-tile cc-full cc-nets">
              {NETWORKS.map(n => (
                <button key={n.name} className="cc-net" onClick={() => ('help' in n.action ? go(() => apps.helpdesk('wifi')) : toast((n.action as { toast: string }).toast))}>
                  <span className="cc-check">{n.connected ? '✓' : ''}</span>
                  <span className="cc-net-name">{n.name}{n.strength === 1 && <small> weak</small>}</span>
                  <Bars n={n.strength} />
                </button>
              ))}
              <button className="cc-link" onClick={() => go(() => apps.helpdesk('wifi'))}>{WIFI_HELP} ›</button>
            </div>
          )}

          <button className={'cc-tile cc-sq' + (dark ? ' active' : '')} onClick={toggleDark} aria-pressed={dark}>
            <span className="cc-glyph">{dark ? '☾' : '☀︎'}</span><small>{dark ? 'Dark' : 'Light'}</small>
          </button>
          <button className={'cc-tile cc-sq' + (motion ? ' active' : '')} onClick={toggleMotion} aria-pressed={motion}>
            <span className="cc-glyph">◐</span><small>Reduce motion</small>
          </button>
          <button className="cc-tile cc-sq" onClick={() => go(() => apps.calendar())}>
            <span className="cc-app"><AppIcon k="calendar" /></span><small>Book a call</small>
          </button>
          <button className="cc-tile cc-sq" onClick={() => go(() => apps.helpdesk())}>
            <span className="cc-app"><AppIcon k="helpdesk" /></span><small>Help Desk</small>
          </button>

          {building && (
            <button className="cc-tile cc-full cc-now" onClick={() => go(() => apps.project(building))}>
              <span className="cc-art" style={{ background: `linear-gradient(150deg,${building.g[0]},${building.g[1]})` }} />
              <span className="cc-text"><small>Now building</small><b>{building.name}</b></span>
              <span className="cc-chev">›</span>
            </button>
          )}

          <button className="cc-tile cc-full cc-low" onClick={() => go(() => apps.calendar('A quick call'))}>{BATTERY.cta} ›</button>
        </div>
        <button className="cc-handle" aria-label="Close Control Center" onClick={onClose} />
      </div>
    </div>
  );
}
