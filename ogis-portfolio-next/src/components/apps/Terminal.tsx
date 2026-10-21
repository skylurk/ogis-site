'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CLIENTS, FOLDERS, type FolderName, OWNER, PROJECTS, SERVICES, SKILLS, WORK } from '@/data/portfolio';
import { useDesktop, type Win } from '../desktop/DesktopContext';
import WindowFrame from '../desktop/WindowFrame';
import { useSearch } from '../desktop/Spotlight';

type Line = { key: number; node: ReactNode; cls?: string };
const D = ({ children }: { children: ReactNode }) => <span className="d">{children}</span>;
const M = ({ children }: { children: ReactNode }) => <span className="m">{children}</span>;
const table = (rows: [string, string][], pad: number, Wrap = D) =>
  rows.map(([a, b], i) => <span key={i}><Wrap>{a.padEnd(pad)}</Wrap>{b}{'\n'}</span>);

export default function Terminal({ win }: { win: Win }) {
  const { close } = useDesktop();
  const search = useSearch();
  const [lines, setLines] = useState<Line[]>(() => [
    { key: 0, node: `Last login: ${new Date().toDateString()} on ttys001`, cls: 'm' },
    { key: 1, node: <>Welcome to {OWNER.studio}. Type <D>help</D> to see what you can do.</> }
  ]);
  const [input, setInput] = useState('');
  const hist = useRef<string[]>([]), hi = useRef(0), seq = useRef(2);
  const box = useRef<HTMLDivElement>(null), field = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => field.current?.focus(), 50); }, []);
  useEffect(() => { box.current?.scrollTo(0, box.current.scrollHeight); }, [lines]);

  const run = (raw: string) => {
    const out: Line[] = [{ key: seq.current++, node: <><span className="p">guest@ogis ~ %</span> {raw}</> }];
    const say = (node: ReactNode, cls?: string) => out.push({ key: seq.current++, node, cls });
    const [c = '', ...rest] = raw.split(/\s+/), arg = rest.join(' ');
    const cmds: Record<string, () => void> = {
      help: () => say(<>{table([['whoami', 'about David'], ['services', 'what I offer'], ['projects', 'things I have built'], ['career', 'where I have worked'], ['skills', 'languages, frameworks, tools'], ['ls', '[folder]  list a folder'], ['open', 'name  open anything by name'], ['contact', 'how to reach me']], 12)}<D>date</D>, <D>clear</D>, <D>neofetch</D>, <D>exit</D></>),
      whoami: () => say(`${OWNER.name} · ${OWNER.studio}\n${OWNER.role}, ${OWNER.city}`),
      services: () => say(<>{table(SERVICES.map(s => [s.name, s.tagline]), 23)}</>),
      projects: () => say(<>{table(PROJECTS.map(p => [p.name, p.kind]), 18)}</>),
      career: () => say(<>{table(WORK.map(w => [w.years, `${w.role} · ${w.org}`]), 16, M)}</>),
      skills: () => say(<>{table(SKILLS.map(([k, v]) => [k, v]), 13)}</>),
      ls: () => {
        const f = (Object.keys(FOLDERS) as FolderName[]).find(k => k.toLowerCase() === arg.toLowerCase());
        say(f ? FOLDERS[f].map(i => i.name).join('\n') : <>{(['Services', 'Projects', 'Career', 'NGO Work'] as const).map(k => <span key={k}><D>{k.replace(' ', '\\ ')}/</D>{'   '}</span>)}David\ Résumé.pdf</>);
      },
      open: () => {
        if (!arg) return say('usage: open name');
        const hit = search(arg)[0];
        if (!hit) return say(`open: ${arg}: no such file or app`);
        hit.run(); say(`Opened ${hit.label}`, 'm');
      },
      contact: () => say(`email      ${OWNER.email}\nphone      ${OWNER.phone}\nwhatsapp   ${OWNER.whatsapp}`),
      date: () => say(new Date().toString()),
      neofetch: () => say(<><D>   ~~~   </D> guest@ogis{'\n'}<D> ~~~~~~~ </D> OS: Ogis Creatives Portfolio 26.1{'\n'}<D>~~~~~~~~~</D> Services: {SERVICES.length}  Projects: {PROJECTS.length}{'\n'}<D> ~~~~~~~ </D> Organisations: {WORK.length + CLIENTS.length}{'\n'}<D>   ~~~   </D> Languages: {OWNER.languages.join(', ')}</>),
      sudo: () => say('Nice try. Ask David for admin rights.'),
      exit: () => close(win.id)
    };
    if (c.toLowerCase() === 'clear') { setLines([]); return; }
    if (raw) { hist.current.push(raw); hi.current = hist.current.length; (cmds[c.toLowerCase()] ?? (() => say(`zsh: command not found: ${c}`)))(); }
    setLines(l => [...l, ...out]);
  };

  return (
    <WindowFrame win={win} w={640} h={420} className="term-win">
      <div className="term" ref={box} onClick={() => field.current?.focus()}>
        {lines.map(l => <div key={l.key} className={'ln ' + (l.cls ?? '')}>{l.node}</div>)}
        <div className="in">
          <span className="p">guest@ogis ~ %</span>
          <input ref={field} aria-label="Terminal input" autoComplete="off" spellCheck={false} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              const h = hist.current;
              if (e.key === 'ArrowUp' && h.length) { hi.current = Math.max(0, hi.current - 1); setInput(h[hi.current]); e.preventDefault(); }
              if (e.key === 'ArrowDown' && h.length) { hi.current = Math.min(h.length, hi.current + 1); setInput(h[hi.current] ?? ''); }
              if (e.key === 'Enter') { run(input.trim()); setInput(''); }
            }} />
        </div>
      </div>
    </WindowFrame>
  );
}
