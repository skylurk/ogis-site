'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { matchIntents } from '@/data/helpdesk';
import { PROJECTS, SERVICES, WORK, type FolderName } from '@/data/portfolio';
import { SVG } from '@/lib/icons';
import { APP_NAMES, type AppKey, useApps, useDesktop } from './DesktopContext';
import { AppIcon, FolderIcon, OrgDot, ProjIcon, Svg } from './Icons';

type Result = { label: string; sub: string; icon: ReactNode; run: () => void };

/** Everything searchable, used by Spotlight and the Terminal's `open` command. */
export function useSearch() {
  const apps = useApps();
  const all = useMemo<Result[]>(() => {
    const launchable: Exclude<AppKey, 'preview' | 'trash'>[] = ['finder', 'about', 'helpdesk', 'services', 'career', 'quote', 'mail', 'terminal', 'site'];
    const folders: FolderName[] = ['Services', 'Projects', 'Career', 'NGO Work'];
    return [
      ...launchable.map(k => ({ label: APP_NAMES[k], sub: 'Application', icon: <AppIcon k={k} />, run: apps.launch[k] })),
      ...folders.map(f => ({ label: f, sub: 'Folder', icon: <FolderIcon name={f} />, run: () => apps.finder(f) })),
      ...SERVICES.map(s => ({ label: s.name, sub: 'Service', icon: <AppIcon k={s.icon} />, run: () => apps.services(s.id) })),
      ...PROJECTS.map(p => ({ label: p.name, sub: 'Project', icon: <ProjIcon p={p} />, run: () => apps.project(p) })),
      ...WORK.map((w, i) => ({ label: w.org, sub: w.role, icon: <OrgDot w={w} />, run: () => apps.career(i) })),
      { label: 'David Résumé.pdf', sub: 'Document', icon: <Svg html={SVG.pdf} />, run: apps.resume }
    ];
  }, [apps]);
  return (raw: string) => {
    const q = raw.trim().toLowerCase();
    if (!q) return [];
    // Everyday phrases first ("my laptop is slow"), then exact names.
    const intents: Result[] = matchIntents(q).slice(0, 3).map(i => ({ label: i.label, sub: `Help Desk · ${i.sub}`, icon: <AppIcon k="helpdesk" />, run: () => apps.helpdesk(i.node) }));
    const named = all.filter(r => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q))
      .sort((a, b) => a.label.toLowerCase().indexOf(q) - b.label.toLowerCase().indexOf(q));
    const results = [...intents, ...named].slice(0, 8);
    // A sentence, or nothing found: offer to ask the Help Desk in the visitor's own words.
    if (!results.length || (q.includes(' ') && !named.length)) {
      results.push({ label: `Ask the Help Desk: “${raw.trim()}”`, sub: 'Help Desk', icon: <AppIcon k="helpdesk" />, run: () => apps.helpdesk(undefined, raw.trim()) });
    }
    return results;
  };
}

export default function Spotlight() {
  const { setSpot } = useDesktop();
  const search = useSearch();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const res = search(q);
  const pick = (r?: Result) => { if (!r) return; setSpot(false); r.run(); };
  return (
    <div className="spot">
      <div className="bar">
        <Svg html={SVG.search} />
        <input autoFocus placeholder="Try “my laptop is slow” or “Ingia”" aria-label="Spotlight Search" autoComplete="off" value={q}
          onChange={e => { setQ(e.target.value); setSel(0); }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { setSel(s => Math.min(res.length - 1, s + 1)); e.preventDefault(); }
            if (e.key === 'ArrowUp') { setSel(s => Math.max(0, s - 1)); e.preventDefault(); }
            if (e.key === 'Enter') pick(res[sel]);
          }} />
      </div>
      <ul>
        {res.map((r, i) => (
          <li key={r.sub + r.label} className={i === sel ? 'on' : ''} onClick={() => pick(r)}>
            <span className="ic">{r.icon}</span><span>{r.label}</span><small>{r.sub}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
