'use client';

import { useEffect, useRef, useState } from 'react';
import { OWNER, PROJECTS, SERVICES, WORK, type ServiceId } from '@/data/portfolio';
import { useApps, type Win } from '../desktop/DesktopContext';
import { AppIcon, OrgDot, ProjIcon } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';

/** A System Settings-style app with one pane per service. */
export default function Services({ win }: { win: Win }) {
  const apps = useApps();
  const [id, setId] = useState<ServiceId>(win.props.service ?? 'support');
  const pane = useRef<HTMLDivElement>(null);
  useEffect(() => { if (win.props.service) setId(win.props.service); }, [win.nonce, win.props.service]);
  useEffect(() => { pane.current?.scrollTo(0, 0); }, [id]);

  const s = SERVICES.find(x => x.id === id)!;
  const orgs = s.orgs.map(n => WORK.findIndex(w => w.org === n)).filter(i => i >= 0);
  const projs = s.id === 'dev' ? PROJECTS : s.id === 'ngo' ? PROJECTS.filter(p => p.id === 'flightbag' || p.id === 'qr') : [];

  return (
    <WindowFrame win={win} w={760} h={560}>
      <div className="settings">
        <nav className="sidebar">
          <button className="set-profile" onClick={apps.about}>
            <span className="avatar">{OWNER.initials}</span>
            <span><b>{OWNER.name}</b><small>{OWNER.studio}</small></span>
          </button>
          {SERVICES.map(x => (
            <button key={x.id} className={x.id === id ? 'on' : ''} onClick={() => setId(x.id)}><AppIcon k={x.icon} className="set-ico" />{x.name}</button>
          ))}
          <h6>More</h6>
          <button onClick={() => apps.career()}><AppIcon k="career" className="set-ico" />Career</button>
          <button onClick={() => apps.finder('Projects')}><AppIcon k="dev" className="set-ico" />Projects</button>
          <button onClick={() => apps.mail()}><AppIcon k="mail" className="set-ico" />Contact</button>
        </nav>
        <div className="set-pane" ref={pane}>
          <div className="set-head"><AppIcon k={s.icon} /><h2>{s.name}</h2><p>{s.tagline}</p></div>
          <div className="group-label">What&apos;s included</div>
          <div className="group">
            {s.items.map(([t, d]) => (
              <div className="gr" key={t}><div className="grow">{t}<small>{d}</small></div><span className="switch" role="img" aria-label="Included" /></div>
            ))}
          </div>
          <div className="group-label">Where I&apos;ve done this</div>
          <div className="group">
            {orgs.map(i => (
              <div className="gr link" key={i} onClick={() => apps.career(i)}>
                <OrgDot w={WORK[i]} />
                <div className="grow">{WORK[i].org}<small>{WORK[i].role} · {WORK[i].years}</small></div><span className="go">›</span>
              </div>
            ))}
          </div>
          {projs.length > 0 && <>
            <div className="group-label">{s.id === 'ngo' ? 'Useful starting points' : 'Things I have built'}</div>
            <div className="group">
              {projs.map(p => (
                <div className="gr link" key={p.id} onClick={() => apps.project(p)}>
                  <span style={{ width: 26, height: 26, flex: 'none', display: 'grid' }}><ProjIcon p={p} /></span>
                  <div className="grow">{p.name}<small>{p.kind}</small></div><span className="go">›</span>
                </div>
              ))}
            </div>
          </>}
          <div className="btnrow" style={{ justifyContent: 'flex-end' }}>
            <button className="btn" onClick={apps.resume}>Résumé</button>
            <button className="btn primary" onClick={() => apps.mail(`${s.name} enquiry`)}>Request {s.name}</button>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
