'use client';

import { useEffect, useState } from 'react';
import { FOLDER_NOTES, FOLDERS, type FolderName } from '@/data/portfolio';
import { SVG } from '@/lib/icons';
import { isCoarse, useApps, type Win } from '../desktop/DesktopContext';
import { ItemIcon, Svg } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';

const FAVS: FolderName[] = ['Services', 'Projects', 'Career', 'NGO Work'];
const TAGS: [string, string, FolderName][] = [['#2a7cf7', 'Employment', 'Career'], ['#e5892b', 'Consultancy', 'Career'], ['#d9396f', 'Non-profit', 'NGO Work']];

export default function Finder({ win }: { win: Win }) {
  const apps = useApps();
  const start = win.props.folder ?? 'Projects';
  const [nav, setNav] = useState({ hist: [start], pos: 0 });
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<number | null>(null);
  const folder = nav.hist[nav.pos];

  const go = (f: FolderName) => {
    setNav(n => n.hist[n.pos] === f ? n : { hist: [...n.hist.slice(0, n.pos + 1), f], pos: n.pos + 1 });
    setQ(''); setSel(null);
  };
  const step = (d: number) => { setNav(n => ({ ...n, pos: Math.max(0, Math.min(n.hist.length - 1, n.pos + d)) })); setQ(''); setSel(null); };
  useEffect(() => { if (win.props.folder) go(win.props.folder); }, [win.nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = FOLDERS[folder].filter(it => it.name.toLowerCase().includes(q.trim().toLowerCase()));
  const note = FOLDER_NOTES[folder];

  return (
    <WindowFrame win={win} w={780} h={480} toolbar={<>
      <div className="cap">
        <button aria-label="Back" disabled={nav.pos === 0} onClick={() => step(-1)}><Svg html={SVG.back} /></button>
        <button aria-label="Forward" disabled={nav.pos >= nav.hist.length - 1} onClick={() => step(1)}><Svg html={SVG.fwd} /></button>
      </div>
      <div className="tb-title">{folder}</div>
      <div className="cap">
        <button className="on" aria-label="Icon view"><Svg html={SVG.gridv} /></button>
        <button aria-label="List view" disabled><Svg html={SVG.listv} /></button>
      </div>
      <label className="search"><Svg html={SVG.search} /><input placeholder="Search" aria-label="Search this folder" value={q} onChange={e => setQ(e.target.value)} /></label>
    </>}>
      <div className="finder">
        <nav className="sidebar">
          <h6>Favorites</h6>
          {FAVS.map(f => <button key={f} className={f === folder ? 'on' : ''} onClick={() => go(f)}><Svg html={SVG.sfolder} />{f}</button>)}
          <h6>Locations</h6>
          <button className={folder === 'Trash' ? 'on' : ''} onClick={() => go('Trash')}><Svg html={SVG.strash} />Trash</button>
          <h6>Tags</h6>
          {TAGS.map(([c, t, f]) => <button key={t} onClick={() => go(f)}><span className="tag" style={{ background: c }} />{t}</button>)}
        </nav>
        <div className="f-main">
          <div className="f-status">{items.length} item{items.length === 1 ? '' : 's'}{note ? ' · ' + note : ''}</div>
          {items.length ? (
            <div className="grid">
              {items.map((it, i) => (
                <button key={it.name} className={'item' + (sel === i ? ' sel' : '')}
                  onClick={() => { setSel(i); if (isCoarse()) apps.openItem(it); }}
                  onDoubleClick={() => apps.openItem(it)}
                  onKeyDown={e => { if (e.key === 'Enter') apps.openItem(it); }}>
                  <div className="img"><ItemIcon it={it} /></div><span>{it.name}</span>
                </button>
              ))}
            </div>
          ) : <div className="empty">{q ? 'No matches' : 'This folder is empty'}</div>}
        </div>
      </div>
    </WindowFrame>
  );
}
