'use client';

import { CLIENTS, OWNER, SKILLS, TRAINING, WORK, type Work } from '@/data/portfolio';
import type { Win } from '../desktop/DesktopContext';
import WindowFrame from '../desktop/WindowFrame';

const Row = ({ w }: { w: Work }) => (
  <div className="cv-row"><div className="yr">{w.years}</div><div><b>{w.role} · {w.org}</b><span>{w.body}</span></div></div>
);

export default function Resume({ win }: { win: Win }) {
  return (
    <WindowFrame win={win} w={640} h={640}>
      <div className="paper">
        <h1>{OWNER.name}</h1>
        <div className="role">{OWNER.role}</div>
        <p style={{ color: 'var(--text-2)', maxWidth: '60ch', margin: 0 }}>{OWNER.bio}</p>
        <h4>Work experience</h4>{WORK.filter(w => w.kind === 'emp').map(w => <Row key={w.org} w={w} />)}
        <h4>Consultancy</h4>{WORK.filter(w => w.kind === 'con').map(w => <Row key={w.org} w={w} />)}
        <h4>Also worked with</h4><p style={{ margin: 0, color: 'var(--text-2)' }}>{CLIENTS.join(' · ')}</p>
        <h4>Training</h4>
        {TRAINING.map(([y, t, s]) => <div className="cv-row" key={t}><div className="yr">{y}</div><div><b>{t}</b><span>{s}</span></div></div>)}
        <h4>Skills</h4>
        <div className="skills">{SKILLS.map(([k, v]) => <div key={k}><b>{k}</b><span>{v}</span></div>)}</div>
        <h4>Languages</h4><p style={{ margin: 0 }}>{OWNER.languages.join(', ')}</p>
        <h4>Contact</h4><p style={{ margin: 0 }}>{OWNER.email} · {OWNER.phone} (phone &amp; WhatsApp)</p>
      </div>
    </WindowFrame>
  );
}
