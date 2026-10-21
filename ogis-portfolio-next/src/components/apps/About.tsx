'use client';

import { OWNER } from '@/data/portfolio';
import { useApps, type Win } from '../desktop/DesktopContext';
import WindowFrame from '../desktop/WindowFrame';

export default function About({ win }: { win: Win }) {
  const apps = useApps();
  return (
    <WindowFrame win={win} w={470} h={590}>
      <div className="about">
        <div className="avatar">{OWNER.initials}</div>
        <h1>{OWNER.name}</h1>
        <p className="sub">{OWNER.studio} · {OWNER.role}</p>
        <p className="bio">{OWNER.bio}</p>
        <dl className="specs">{OWNER.specs.map(([k, v]) => [<dt key={k + 't'}>{k}</dt>, <dd key={k + 'd'}>{v}</dd>])}</dl>
        <div className="btnrow">
          <button className="btn" onClick={() => apps.services()}>Services</button>
          <button className="btn" onClick={() => apps.finder('Projects')}>Projects</button>
          <button className="btn" onClick={apps.resume}>Résumé</button>
          <button className="btn primary" onClick={() => apps.mail()}>Work with me</button>
        </div>
      </div>
    </WindowFrame>
  );
}
