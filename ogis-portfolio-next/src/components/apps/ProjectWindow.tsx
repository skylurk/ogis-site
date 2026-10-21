'use client';

import { useApps, type Win } from '../desktop/DesktopContext';
import { ProjIcon } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';
import ProjectViz from './ProjectViz';

export default function ProjectWindow({ win }: { win: Win }) {
  const apps = useApps();
  const p = apps.projectById(win.props.projectId);
  if (!p) return null;
  return (
    <WindowFrame win={win} w={600} h={580}>
      <ProjectViz kind={p.viz} />
      <div className="proj" style={{ paddingTop: 20 }}>
        <div className="title">
          <ProjIcon p={p} />
          <div>
            <h2>{p.name}{p.status && <span className="status">{p.status}</span>}</h2>
            <div className="meta" style={{ margin: 0 }}>{p.kind}</div>
          </div>
        </div>
        <div className="chips" style={{ marginTop: 14 }}>{p.tags.map(t => <span className="chip" key={t}>{t}</span>)}</div>
        <p>{p.body}</p>
        <div className="btnrow" style={{ justifyContent: 'flex-start' }}>
          <button className="btn primary" onClick={() => apps.mail(`About ${p.name}`)}>Ask about {p.name}</button>
          <button className="btn" onClick={() => apps.finder('Projects')}>All projects</button>
        </div>
      </div>
    </WindowFrame>
  );
}
