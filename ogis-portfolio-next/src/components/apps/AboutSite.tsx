'use client';

import { OWNER } from '@/data/portfolio';
import { useApps, useDesktop, type Win } from '../desktop/DesktopContext';
import { AppIcon } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';

const ROWS: [string, string][] = [
  ['Look', 'macOS Tahoe, Liquid Glass'],
  ['Built with', 'Next.js, React and TypeScript'],
  ['Glass', 'CSS backdrop-filter: blur + saturate'],
  ['Windows', 'React components dragged with pointer events'],
  ['Icons', 'CSS gradients and inline SVG, no image files'],
  ['Made by', 'David · Ogis Creatives'],
  ['Shortcuts', '⌘K or Ctrl+K opens Spotlight']
];

export default function AboutSite({ win }: { win: Win }) {
  const { setLocked } = useDesktop();
  const apps = useApps();
  return (
    <WindowFrame win={win} w={440} h={520}>
      <div className="about">
        <AppIcon k="site" className="logo-big" />
        <h1>{OWNER.studio}</h1>
        <p className="sub">Portfolio OS · Version 26.1</p>
        <dl className="specs">{ROWS.map(([k, v]) => [<dt key={k + 't'}>{k}</dt>, <dd key={k + 'd'}>{v}</dd>])}</dl>
        <div className="btnrow">
          <button className="btn" onClick={() => apps.settings('wallpaper')}>Change wallpaper</button>
          <a className="btn" href="/simple">Simple view</a>
          <button className="btn" onClick={() => setLocked(true)}>Lock screen</button>
        </div>
      </div>
    </WindowFrame>
  );
}
