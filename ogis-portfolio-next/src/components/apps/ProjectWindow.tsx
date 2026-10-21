'use client';

import { CASE_STUDIES } from '@/data/caseStudies';
import { useApps, type Win } from '../desktop/DesktopContext';
import { ProjIcon } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';
import ProjectViz from './ProjectViz';

export default function ProjectWindow({ win }: { win: Win }) {
  const apps = useApps();
  const p = apps.projectById(win.props.projectId);
  if (!p) return null;
  const cs = CASE_STUDIES[p.id];
  return (
    <WindowFrame win={win} w={640} h={640}>
      <ProjectViz kind={p.viz} />
      <article className="proj case" style={{ paddingTop: 20 }}>
        <div className="title">
          <ProjIcon p={p} />
          <div>
            <h2>{p.name}{p.status && <span className="status">{p.status}</span>}</h2>
            <div className="meta" style={{ margin: 0 }}>{p.kind}</div>
          </div>
        </div>
        {cs ? <>
          <p className="cs-eyebrow">Case study</p>
          <h3 className="cs-headline">{cs.headline}</h3>
          <dl className="cs-facts">{cs.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <h4>The problem</h4>{cs.problem.map(t => <p key={t}>{t}</p>)}
          <h4>What we built</h4>{cs.approach.map(t => <p key={t}>{t}</p>)}
          <ul className="cs-list">{cs.highlights.map(h => <li key={h}>{h}</li>)}</ul>
          <blockquote className="cs-principle">{cs.principle}</blockquote>
          {cs.results && <><h4>Results</h4><ul className="cs-list">{cs.results.map(r => <li key={r}>{r}</li>)}</ul></>}
        </> : <p>{p.body}</p>}
        <div className="chips" style={{ marginTop: 18 }}>{p.tags.map(t => <span className="chip" key={t}>{t}</span>)}</div>
        <div className="btnrow" style={{ justifyContent: 'flex-start' }}>
          <button className="btn primary" onClick={() => apps.calendar()}>Book a call about {p.name}</button>
          <button className="btn" onClick={() => apps.mail(`About ${p.name}`)}>Email David</button>
          <button className="btn" onClick={() => apps.finder('Projects')}>All projects</button>
        </div>
      </article>
    </WindowFrame>
  );
}
