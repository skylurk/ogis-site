'use client';

import { useEffect, useRef, useState } from 'react';
import { CLIENTS, TRAINING, WORK } from '@/data/portfolio';
import { SVG } from '@/lib/icons';
import type { Win } from '../desktop/DesktopContext';
import { OrgDot, Svg } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';

const YEARS = ['Now', '2024', '2022', '2020', '2018', '2016'];
const GROUPS: [string, typeof WORK][] = [['Employment', WORK.filter(w => w.kind === 'emp')], ['Consultancy', WORK.filter(w => w.kind === 'con')]];

/** A Time Machine-style stack: newer chapters in front, older ones behind. */
export default function Career({ win }: { win: Win }) {
  const [i, setI] = useState(win.props.index ?? 0);
  const [dir, setDir] = useState(0);
  const wheelLock = useRef(false);
  const go = (n: number) => { n = Math.max(0, Math.min(WORK.length - 1, n)); if (n !== i) { setDir(n - i); setI(n); } };
  useEffect(() => { if (win.props.index != null) go(win.props.index); }, [win.nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  const wk = WORK[i];
  const cur = wk.years.includes('Present') ? 'Now' : String(YEARS.find(y => y !== 'Now' && +y <= wk.from) ?? '2016');
  const kindLabel = wk.ngo ? 'Non-profit' : wk.kind === 'emp' ? 'Employment' : 'Consultancy';

  return (
    <WindowFrame win={win} w={820} h={540} toolbar={<>
      <div className="tb-title">Career</div>
      <div className="cap">
        <button aria-label="Newer" onClick={() => go(i - 1)}><Svg html={SVG.up} /></button>
        <button aria-label="Older" onClick={() => go(i + 1)}><Svg html={SVG.down} /></button>
      </div>
    </>}>
      <div className="career" tabIndex={-1} onKeyDown={e => { if (e.key === 'ArrowDown') go(i + 1); if (e.key === 'ArrowUp') go(i - 1); }}>
        <nav className="sidebar">
          {GROUPS.map(([g, list]) => [
            <h6 key={g}>{g}</h6>,
            ...list.map(x => { const n = WORK.indexOf(x); return (
              <button key={x.org} className={'wk-row' + (n === i ? ' on' : '')} onClick={() => go(n)}><b>{x.org}</b><small>{x.years}</small></button>
            ); })
          ])}
          <h6>Training</h6>
          {TRAINING.map(([y, t, s]) => <div className="static-row" key={t}>{y} · {t}<br /><span style={{ color: 'var(--text-3)' }}>{s}</span></div>)}
          <h6>Also worked with</h6>
          {CLIENTS.map(c => <div className="static-row" key={c}>{c}</div>)}
        </nav>
        <div className="stage" onWheel={e => {
          if (Math.abs(e.deltaY) < 20 || wheelLock.current) return;
          wheelLock.current = true; setTimeout(() => (wheelLock.current = false), 420);
          go(i + (e.deltaY > 0 ? 1 : -1));
        }}>
          <div className="stack">
            <div className="ghost g2" /><div className="ghost g1" />
            <article key={i} className={'ccard' + (dir > 0 ? ' down' : '')}>
              <div className="top">
                <OrgDot w={wk} />
                <div><h2>{wk.org}</h2><div className="role">{wk.role}</div></div>
                <div className="yrs">{wk.years}<br /><span className={`kind ${wk.ngo ? 'ngo' : wk.kind}`}>{kindLabel}</span></div>
              </div>
              <p>{wk.body}</p>
              <ul>{wk.hl.map(h => <li key={h}>{h}</li>)}</ul>
            </article>
          </div>
          <div className="stage-nav"><span>{i + 1} of {WORK.length}</span></div>
        </div>
        <div className="rail" aria-hidden="true">{YEARS.map(y => <span key={y} className={y === cur ? 'on' : ''}>{y}</span>)}</div>
      </div>
    </WindowFrame>
  );
}
