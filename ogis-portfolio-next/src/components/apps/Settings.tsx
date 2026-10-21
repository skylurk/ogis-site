'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OWNER } from '@/data/portfolio';
import { applyReduceMotion, applyTheme, readReduceMotion, readTheme, type Theme } from '@/lib/prefs';
import { useApps, type Win } from '../desktop/DesktopContext';
import { AppIcon, type IconKey } from '../desktop/Icons';
import { setWallpaper, useWallpaper, WallArt, WALLPAPERS } from '../desktop/Wallpaper';
import WindowFrame from '../desktop/WindowFrame';

type Pane = 'appearance' | 'wallpaper' | 'accessibility';
const PANES: [Pane, string, IconKey][] = [['appearance', 'Appearance', 'appearance'], ['wallpaper', 'Wallpaper', 'wallpaper'], ['accessibility', 'Accessibility', 'access']];
const THEMES: [Theme, string][] = [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']];

/** A small System Settings: appearance, wallpaper and accessibility. Choices are remembered in this browser. */
export default function Settings({ win }: { win: Win }) {
  const apps = useApps();
  const wall = useWallpaper();
  const [pane, setPane] = useState<Pane>((win.props.pane as Pane) || 'appearance');
  const [theme, setTheme] = useState<Theme>('auto');
  const [motion, setMotion] = useState(false);
  useEffect(() => { setTheme(readTheme()); setMotion(readReduceMotion()); }, []);
  useEffect(() => { if (win.props.pane) setPane(win.props.pane as Pane); }, [win.nonce, win.props.pane]);

  const pickTheme = (t: Theme) => { setTheme(t); applyTheme(t); };
  const toggleMotion = () => { const v = !motion; setMotion(v); applyReduceMotion(v); };

  return (
    <WindowFrame win={win} w={720} h={520}>
      <div className="settings">
        <nav className="sidebar">
          <button className="set-profile" onClick={apps.about}>
            <span className="avatar">{OWNER.initials}</span>
            <span><b>Guest</b><small>Visiting {OWNER.studio}</small></span>
          </button>
          {PANES.map(([k, l, icon]) => (
            <button key={k} className={pane === k ? 'on' : ''} onClick={() => setPane(k)}><AppIcon k={icon} className="set-ico" />{l}</button>
          ))}
        </nav>
        <div className="set-pane">
          {pane === 'appearance' && <>
            <h2 className="set-title">Appearance</h2>
            <div className="group">
              <div className="gr themes" role="radiogroup" aria-label="Appearance">
                {THEMES.map(([t, l]) => (
                  <button key={t} role="radio" aria-checked={theme === t} className={'theme-tile' + (theme === t ? ' on' : '')} onClick={() => pickTheme(t)}>
                    <span className={`theme-prev ${t}`}><i /><i /></span>{l}
                  </button>
                ))}
              </div>
            </div>
            <p className="set-note">Auto follows your device’s light or dark setting.</p>
          </>}

          {pane === 'wallpaper' && <>
            <h2 className="set-title">Wallpaper</h2>
            <div className="wall-grid" role="radiogroup" aria-label="Wallpaper">
              {WALLPAPERS.map((w, i) => (
                <button key={w.name} role="radio" aria-checked={wall === i} className={'wall-tile' + (wall === i ? ' on' : '')} onClick={() => setWallpaper(i)}>
                  <WallArt v={w.v} mini />
                  <b>{w.name}</b><small>{w.note}</small>
                </button>
              ))}
            </div>
          </>}

          {pane === 'accessibility' && <>
            <h2 className="set-title">Accessibility</h2>
            <div className="group">
              <div className="gr">
                <div className="grow">Reduce motion<small>Turns off window, dock and wallpaper animations</small></div>
                <button role="switch" aria-checked={motion} aria-label="Reduce motion" className={'switch' + (motion ? '' : ' off')} onClick={toggleMotion} />
              </div>
              <div className="gr">
                <div className="grow">Simple view<small>The whole portfolio as one plain, readable page. Works with screen readers.</small></div>
                <Link className="btn" href="/simple">Open</Link>
              </div>
              <div className="gr">
                <div className="grow">Keyboard<small>⌘K or Ctrl+K opens Search · Tab moves between buttons · Enter opens</small></div>
              </div>
            </div>
          </>}
        </div>
      </div>
    </WindowFrame>
  );
}
