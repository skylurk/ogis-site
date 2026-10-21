'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CLIENTS, FOLDERS, type FolderName, type Item, OWNER, PROJECTS, SERVICES, SKILLS, WORK } from '@/data/portfolio';
import { closest, COMMON_SLIPS, q, tokenize } from '@/lib/fixer';
import { NOT_FOUND_QUIPS, WITTY } from '@/lib/witty';
import { APP_NAMES, useApps, useDesktop, type Win } from '../desktop/DesktopContext';
import WindowFrame from '../desktop/WindowFrame';
import { useSearch } from '../desktop/Spotlight';

type Line = { key: number; node: ReactNode; cls?: string };
type Dir = '~' | FolderName;
type Out = {
  say: (node: ReactNode, cls?: string) => void;
  fail: (msg: ReactNode, fixes?: string[]) => false;
  /** A reply that isn't an error but has somewhere useful to go next, offered through `fcvk`. */
  offer: (msg: ReactNode, fixes: string[]) => true;
};

const D = ({ children }: { children: ReactNode }) => <span className="d">{children}</span>;
const M = ({ children }: { children: ReactNode }) => <span className="m">{children}</span>;
const table = (rows: [string, string][], pad: number, Wrap = D) =>
  rows.map(([a, b], i) => <span key={i}><Wrap>{a.padEnd(pad)}</Wrap>{b}{'\n'}</span>);

const DIRS: FolderName[] = ['Services', 'Projects', 'Career', 'NGO Work', 'Trash'];
const HOME_FILES = ['README.md', 'David Résumé.pdf'];
const README = `Welcome to ${OWNER.studio}.\n\nThis is David's portfolio, built as a desktop. Each folder is a part of his work:\n  Services/   what he offers\n  Projects/   things he has built\n  Career/     where he has worked\n  NGO Work/   software and support for non-profits\n\nTry: cd Projects, ls, cat Ingia, open Ingia, hire`;
const GIT_SUBS = ['status', 'log', 'push', 'pull', 'commit', 'branch', 'clone', 'add', 'diff', 'checkout', 'remote', 'fetch', 'stash', 'init'];
const NPM_SUBS = ['install', 'run', 'start', 'test', 'build', 'ls', 'init', 'version'];
const NPM_SCRIPTS = ['dev', 'build', 'start', 'typecheck'];
const EDITORS = ['vim', 'vi', 'nano', 'emacs', 'code'];
const READ_ONLY = ['mkdir', 'touch', 'mv', 'cp', 'chmod', 'chown', 'ln'];

/** One line per command, used by `help`, `man` and `which`. */
const MAN: Record<string, string> = {
  help: 'list what you can do here', whoami: 'about David', services: 'what David offers', projects: 'things David has built',
  career: 'where David has worked', skills: 'languages, frameworks and tools', contact: 'how to reach David', hire: 'start an email to David',
  ls: 'list a folder (-l, -a)', cd: 'change folder', pwd: 'print the current folder', cat: 'print a file or project',
  open: 'open anything by name', echo: 'print text', history: 'commands you have typed', clear: 'clear the screen',
  date: 'current date and time', uptime: 'how long this desktop has been on', uname: 'system name (-a for more)', hostname: 'machine name',
  top: 'open windows, as processes', ps: 'open windows, as processes', which: 'locate a command', man: 'read about a command',
  ping: 'check a host is up', curl: 'fetch a URL', ssh: 'connect to a server', git: 'version control', npm: 'node package manager',
  node: 'JavaScript runtime', python3: 'Python', neofetch: 'system summary', sudo: 'run as administrator', rm: 'remove files',
  fcvk: 'fix the last command, like thefuck', exit: 'close Terminal'
};

export default function Terminal({ win }: { win: Win }) {
  const { close, wins } = useDesktop();
  const apps = useApps();
  const search = useSearch();
  const [lines, setLines] = useState<Line[]>(() => [
    { key: 0, node: `Last login: ${new Date().toDateString()} on ttys001`, cls: 'm' },
    { key: 1, node: <>Welcome to {OWNER.studio}. Type <D>help</D> to see what you can do. Mistype something? Type <D>fcvk</D>.</> }
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwdState] = useState<Dir>('~');
  const [pending, setPending] = useState<{ opts: string[]; i: number } | null>(null);
  const cwdRef = useRef<Dir>('~');
  const hist = useRef<string[]>([]), hi = useRef(0), seq = useRef(2);
  const lastFail = useRef<{ raw: string; fixes: string[] } | null>(null);
  const quip = useRef(0);
  const box = useRef<HTMLDivElement>(null), field = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => field.current?.focus(), 50); }, []);
  useEffect(() => { box.current?.scrollTo(0, box.current.scrollHeight); }, [lines, pending]);

  const setCwd = (d: Dir) => { cwdRef.current = d; setCwdState(d); };
  const prompt = (d: Dir) => `guest@ogis ${d} %`;

  /* ---------- Virtual filesystem ---------- */
  const resolveDir = (arg?: string): Dir | null => {
    if (!arg || arg === '~' || arg === '~/') return '~';
    if (arg === '..' || arg === '../' || arg === '-') return '~';
    if (arg === '.' || arg === './') return cwdRef.current;
    const name = arg.replace(/^~\//, '').replace(/^\.\//, '').replace(/\/$/, '');
    return DIRS.find(d => d.toLowerCase() === name.toLowerCase()) ?? null;
  };
  const namesIn = (d: Dir) => d === '~' ? [...DIRS.filter(x => x !== 'Trash'), ...HOME_FILES] : FOLDERS[d].map(i => i.name);
  /** Finds "Ingia", "Projects/Ingia" or "~/Projects/Ingia". */
  const findItem = (path: string): { dir: Dir; item?: Item; file?: string } | null => {
    const clean = path.replace(/^~\//, '').replace(/\/$/, '');
    const slash = clean.indexOf('/');
    const dir = slash >= 0 ? resolveDir(clean.slice(0, slash)) : cwdRef.current;
    const name = (slash >= 0 ? clean.slice(slash + 1) : clean).toLowerCase();
    if (!dir) return null;
    if (dir === '~') { const file = HOME_FILES.find(f => f.toLowerCase() === name); return file ? { dir, file } : null; }
    const item = FOLDERS[dir].find(i => i.name.toLowerCase() === name);
    return item ? { dir, item } : null;
  };
  const allNames = () => [...DIRS, ...HOME_FILES, ...DIRS.flatMap(d => FOLDERS[d].map(i => i.name)), ...Object.values(APP_NAMES)];

  const describe = (it: Item): string => {
    switch (it.type) {
      case 'project': return `${it.ref.name} · ${it.ref.kind}${it.ref.status ? ` (${it.ref.status})` : ''}\n\n${it.ref.body}\n\nBuilt with: ${it.ref.tags.join(', ')}`;
      case 'work': return `${it.ref.org}\n${it.ref.role} · ${it.ref.years}\n\n${it.ref.body}`;
      case 'service': return `${it.ref.name}\n${it.ref.tagline}\n\n${it.ref.items.map(([t, d]) => `  • ${t}: ${d}`).join('\n')}`;
      default: return `${it.name}: nothing readable inside.`;
    }
  };

  /* ---------- Commands ---------- */
  type Handler = (args: string[], o: Out) => boolean | void;
  const CMDS: Record<string, Handler> = {
    help: (_, o) => o.say(<>{table([['whoami', MAN.whoami], ['services', MAN.services], ['projects', MAN.projects], ['career', MAN.career], ['skills', MAN.skills], ['contact', MAN.contact], ['hire', MAN.hire]], 10)}{'\n'}{table([['ls cd pwd', 'move around the folders'], ['cat open', 'read or open anything'], ['fcvk', 'fix the command you just mistyped']], 10)}{'\n'}<M>Also: echo, history, man, which, date, uptime, uname, top, ping, curl, git, npm, sudo, neofetch, clear, exit</M></>),
    whoami: (_, o) => o.say(`${OWNER.name} · ${OWNER.studio}\n${OWNER.role}, ${OWNER.city}`),
    services: (_, o) => o.say(<>{table(SERVICES.map(s => [s.name, s.tagline]), 23)}</>),
    projects: (_, o) => o.say(<>{table(PROJECTS.map(p => [p.name, p.kind]), 18)}</>),
    career: (_, o) => o.say(<>{table(WORK.map(w => [w.years, `${w.role} · ${w.org}`]), 16, M)}</>),
    skills: (_, o) => o.say(<>{table(SKILLS, 13)}</>),
    contact: (_, o) => o.say(`email      ${OWNER.email}\nphone      ${OWNER.phone}\nwhatsapp   ${OWNER.whatsapp}`),
    hire: (_, o) => { apps.mail('Hiring enquiry'); o.say('Opening Mail. David usually replies within a day.', 'm'); },

    pwd: (_, o) => o.say(`/Users/guest${cwdRef.current === '~' ? '' : '/' + cwdRef.current}`),
    cd: (args, o) => {
      if (args[0] === '/') return o.fail('cd: permission denied: /', []);
      const d = resolveDir(args[0]);
      if (!d) {
        const file = findItem(args[0]);
        if (file) return o.fail(`cd: not a directory: ${args[0]}`, [`open ${q(args[0])}`, `cat ${q(args[0])}`]);
        return o.fail(`cd: no such file or directory: ${args[0]}`, closest(args[0], DIRS).map(x => `cd ${q(x)}`));
      }
      setCwd(d);
    },
    ls: (args, o) => {
      const flags = args.filter(a => a.startsWith('-')).join(''), target = args.find(a => !a.startsWith('-'));
      const d = target ? resolveDir(target) : cwdRef.current;
      if (!d) {
        const f = target && findItem(target);
        if (f) return o.say(target!);
        return o.fail(`ls: ${target}: No such file or directory`, closest(target!, namesIn(cwdRef.current).concat(DIRS)).map(x => `ls ${q(x)}`));
      }
      let names = namesIn(d).map(n => (DIRS as string[]).includes(n) ? n + '/' : n);
      if (d === '~' && flags.includes('a')) names = ['./', '../', '.coffee', '.ideas', ...names, 'Trash/'];
      if (flags.includes('l')) {
        o.say(names.map(n => `${n.endsWith('/') ? 'drwxr-xr-x' : '-rw-r--r--'}  guest  staff  Oct 21  ${n}`).join('\n'));
      } else o.say(<>{names.map(n => <span key={n}>{n.endsWith('/') ? <D>{q(n)}</D> : q(n)}{'   '}</span>)}</>);
    },
    cat: (args, o) => {
      if (!args[0]) return o.fail('usage: cat file', []);
      if (args[0] === '.coffee') return o.say('☕ Still warm. David runs on Kenyan AA.');
      if (args[0] === '.ideas') return o.say('1. Fogedit Aviation\n2. Something for your organisation? Type hire.');
      const d = resolveDir(args[0]);
      if (d && d !== cwdRef.current) return o.fail(`cat: ${args[0]}: Is a directory`, [`ls ${q(args[0])}`, `cd ${q(args[0])}`]);
      const f = findItem(args[0]);
      if (!f) return o.fail(`cat: ${args[0]}: No such file or directory`, closest(args[0].split('/').pop()!, namesIn(cwdRef.current)).map(x => `cat ${q(x)}`));
      if (f.file === 'README.md') return o.say(README);
      if (f.file) return o.fail(`cat: ${f.file}: binary file (PDF)`, [`open ${q(f.file)}`]);
      o.say(describe(f.item!));
    },
    open: (args, o) => {
      const arg = args.join(' ');
      if (!arg) return o.fail('usage: open name', []);
      if (/^["']?homework\/?["']?$/i.test(arg)) { apps.secret(); return o.say('Opening Homework… good luck with the password.', 'm'); }
      const f = findItem(arg);
      if (f?.item) { apps.openItem(f.item); return o.say(`Opened ${f.item.name}`, 'm'); }
      if (f?.file === 'David Résumé.pdf') { apps.resume(); return o.say('Opened David Résumé.pdf', 'm'); }
      if (f?.file === 'README.md') return o.say(README);
      const d = resolveDir(arg);
      if (d && d !== '~') { apps.finder(d); return o.say(`Opened ${d}`, 'm'); }
      const hit = search(arg)[0];
      if (hit) { hit.run(); return o.say(`Opened ${hit.label}`, 'm'); }
      return o.fail(`The file /Users/guest/${arg} does not exist.`, closest(arg, allNames()).map(x => `open ${q(x)}`));
    },

    echo: (args, o) => o.say(args.join(' ').replace(/\$(\w+)/g, (_, v: string) => ({ USER: 'guest', HOME: '/Users/guest', SHELL: '/bin/zsh', PWD: '/Users/guest' + (cwdRef.current === '~' ? '' : '/' + cwdRef.current), HIRE: OWNER.email } as Record<string, string>)[v] ?? '')),
    history: (_, o) => o.say(hist.current.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n') || ''),
    date: (_, o) => o.say(new Date().toString()),
    uptime: (_, o) => { const m = Math.max(1, Math.round(performance.now() / 60000)); o.say(`${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}  up ${m} min${m === 1 ? '' : 's'}, 1 user, load averages: 1.04 0.98 0.87`); },
    uname: (args, o) => o.say(args.includes('-a') ? 'Darwin ogis-creatives 26.1.0 Darwin Kernel Version 26.1.0: Tahoe; arm64' : 'Darwin'),
    hostname: (_, o) => o.say('ogis-creatives.local'),
    top: (_, o) => o.say(<>{`PID    COMMAND            %CPU  MEM\n`}{wins.map((w, i) => `${String(4200 + i * 37).padEnd(7)}${w.title.slice(0, 18).padEnd(19)}${(1.2 + i * 0.7).toFixed(1).padStart(4)}  ${12 + i * 3}M\n`).join('') || 'No windows open.\n'}<M>{`Processes: ${wins.length} total. Close windows with the red button, not kill.`}</M></>),
    which: (args, o) => {
      if (!args[0]) return o.fail('usage: which command', []);
      if (['cd', 'echo', 'history', 'pwd'].includes(args[0])) return o.say(`${args[0]}: shell built-in command`);
      if (CMDS[args[0]]) return o.say(`/usr/local/bin/${args[0]}`);
      return o.fail(`${args[0]} not found`, closest(args[0], Object.keys(CMDS)).map(c => `which ${c}`));
    },
    man: (args, o) => {
      if (!args[0]) return o.say("What manual page do you want?\nFor example, try 'man services'.");
      if (MAN[args[0]]) return o.say(`${args[0]}: ${MAN[args[0]]}`);
      return o.fail(`No manual entry for ${args[0]}`, closest(args[0], Object.keys(MAN)).map(c => `man ${c}`));
    },
    ping: (args, o) => {
      const host = args.find(a => !a.startsWith('-'));
      if (!host) return o.fail('usage: ping host', ['ping ogiscreatives.com']);
      o.say(`PING ${host}: 56 data bytes\n${[24.1, 22.8, 23.5].map((t, i) => `64 bytes from ${host}: icmp_seq=${i} ttl=56 time=${t} ms`).join('\n')}\n\n--- ${host} ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss`);
    },
    curl: (args, o) => {
      const url = args.find(a => !a.startsWith('-'));
      if (!url) return o.fail('curl: try \'curl ogiscreatives.com\'', ['curl ogiscreatives.com']);
      if (!/ogiscreatives/i.test(url)) return o.fail(`curl: (6) Could not resolve host: ${url}\nThis terminal only talks to ogiscreatives.com.`, [`curl ogiscreatives.com`]);
      o.say(JSON.stringify({ name: OWNER.name, studio: OWNER.studio, services: SERVICES.map(s => s.name), email: OWNER.email, phone: OWNER.phone, available: true }, null, 2));
    },
    ssh: (args, o) => o.fail(`ssh: connect to host ${args.find(a => !a.startsWith('-'))?.replace(/^.*@/, '') ?? 'server'} port 22: Connection refused\nNeed a server looked after? That's one of David's services.`, ['services']),
    neofetch: (_, o) => o.say(<><D>   ~~~   </D> guest@ogis{'\n'}<D> ~~~~~~~ </D> OS: Ogis Creatives Portfolio 26.1{'\n'}<D>~~~~~~~~~</D> Services: {SERVICES.length}  Projects: {PROJECTS.length}{'\n'}<D> ~~~~~~~ </D> Organisations: {WORK.length + CLIENTS.length}{'\n'}<D>   ~~~   </D> Languages: {OWNER.languages.join(', ')}</>),

    git: (args, o) => {
      const [sub, ...rest] = args;
      if (!sub) return o.say('usage: git <command> [<args>]\n\nTry: git status, git log, git push');
      switch (sub) {
        case 'status': return o.say("On branch master\nYour branch is up to date with 'origin/master'.\n\nnothing to commit, working tree clean");
        case 'log': return o.say(<><span className="g">87671f4</span> Add Ogis Creatives portfolio site{'\n'}<span className="g">2019a1c</span> Kasas Kenya: aircraft and crew management system{'\n'}<span className="g">2018f0e</span> Afrigroup Kenya: first day on the IT desk</>);
        case 'push':
          if (rest.some(r => r === '-u' || r === '--set-upstream')) return o.say('Everything up-to-date');
          return o.fail('fatal: The current branch master has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin master', ['git push --set-upstream origin master']);
        case 'pull': case 'fetch': return o.say('Already up to date.');
        case 'commit':
          if (!rest.includes('-m')) return o.fail('Aborting commit due to empty commit message.', ['git commit -m "Hire David"']);
          return o.say('On branch master\nnothing to commit, working tree clean');
        case 'branch': return o.say('* master');
        case 'clone': return o.say(`Cloning into '${(rest[0] ?? 'ogis-site').split('/').pop()!.replace(/\.git$/, '')}'...\ndone.`);
        case 'remote': return o.say(rest.includes('-v') ? 'origin\thttps://github.com/skylurk/ogis-site.git (fetch)\norigin\thttps://github.com/skylurk/ogis-site.git (push)' : 'origin');
        case 'add': case 'diff': case 'stash': case 'checkout': case 'init': return o.say('Nothing to do: this portfolio is read-only.');
        default: {
          const best = closest(sub, GIT_SUBS);
          return o.fail(`git: '${sub}' is not a git command. See 'git --help'.${best.length ? `\n\nThe most similar command is\n\t${best[0]}` : ''}`, best.map(b => ['git', b, ...rest.map(q)].join(' ')));
        }
      }
    },
    npm: (args, o) => {
      const [sub, ...rest] = args;
      const script = sub === 'run' || sub === 'run-script' ? rest[0] : ['start', 'build'].includes(sub) ? sub : undefined;
      if (!sub) return o.say('npm <command>\n\nUsage:\nnpm install        install all the dependencies in your project\nnpm run <foo>      run the script named <foo>');
      if (sub === 'install' || sub === 'i') return o.say('up to date, audited 28 packages in 1s\n\nfound 0 vulnerabilities');
      if (sub === 'test') return o.fail('npm error Missing script: "test"\nDavid tests in the browser. You are in it.', []);
      if (sub === 'version' || sub === '-v') return o.say('11.19.0');
      if (sub === 'ls') return o.say('ogis-portfolio@1.0.0\n├── next@16.4.0\n├── react@19.3.0\n├── react-dom@19.3.0\n└── typescript@5.9.3');
      if (sub === 'run' && !script) return o.say(`Scripts available in ogis-portfolio@1.0.0 via \`npm run\`:\n  ${NPM_SCRIPTS.join('\n  ')}`);
      if (script) {
        if (!NPM_SCRIPTS.includes(script)) {
          const best = closest(script, NPM_SCRIPTS);
          return o.fail(`npm error Missing script: "${script}"${best.length ? `\nnpm error\nnpm error Did you mean this?\nnpm error   npm run ${best[0]}` : ''}`, best.map(b => `npm run ${b}`));
        }
        const cmd = { dev: 'next dev', build: 'next build', start: 'next start', typecheck: 'tsc --noEmit' }[script];
        const body = script === 'build' ? '✓ Compiled successfully\n✓ Generating static pages (3/3)' : script === 'typecheck' ? '' : '  ▲ Next.js 16.4.0\n  - Local: you are looking at it\n\n✓ Ready';
        return o.say(`> ogis-portfolio@1.0.0 ${script}\n> ${cmd}\n\n${body}`);
      }
      const best = closest(sub, NPM_SUBS);
      return o.fail(`Unknown command: "${sub}"${best.length ? `\n\nDid you mean this?\n    npm ${best[0]}` : ''}`, best.map(b => ['npm', b, ...rest].join(' ')));
    },
    node: (args, o) => o.say(args.includes('-v') || args.includes('--version') ? 'v24.21.0' : 'No REPL here, but this whole desktop is TypeScript. Try: cat README.md'),
    python3: (args, o) => o.say(args.includes('-V') || args.includes('--version') ? 'Python 3.13.2' : 'No REPL here. Python is on the list though: try skills'),
    brew: (args, o) => o.fail(`Warning: No available formula with the name "${args[1] ?? args[0] ?? ''}".\nThis Mac is a portfolio. To install David instead, use: hire`, ['hire']),

    sudo: (args, o) => {
      if (!args.length) return o.fail('usage: sudo command', []);
      o.say('[sudo] password for guest: ********', 'm');
      const sub = args.map(q).join(' ');
      if (/^(rm|shutdown|reboot|halt|kill)\b/.test(sub)) return o.fail('guest is not in the sudoers file. This incident will be reported to David.', []);
      return exec(sub, o);
    },
    rm: (args, o) => {
      if (args.some(a => /^-\w*r\w*f|^-\w*f\w*r/.test(a)) && args.includes('/')) return o.fail('rm: /: Permission denied', ['sudo rm -rf /']);
      return o.fail(`rm: ${args.filter(a => !a.startsWith('-')).pop() ?? ''}: Read-only file system`, []);
    },
    clear: () => { setLines([]); },
    exit: () => { close(win.id); }
  };
  CMDS.python = CMDS.python3;
  CMDS.ps = CMDS.top;
  CMDS.htop = CMDS.top;
  CMDS.dir = CMDS.ls;
  CMDS.type = CMDS.cat;
  for (const ed of EDITORS) CMDS[ed] = (args, o) => o.say(`${ed}: ${args[0] ?? 'this file'} is read-only here. (And you can always leave vim with :q!)`);
  for (const c of READ_ONLY) CMDS[c] = (_, o) => o.fail(`${c}: Read-only file system. This desktop is a portfolio, not a scratchpad.`, []);
  // `fcvk` is the advertised name; the uncensored spelling still works for anyone who types it.
  const FIX_WORDS = ['fcvk', 'fuck', 'thefuck', 'fix'];

  /** Runs one command. Returns false if it failed, so `a && b` can stop early. */
  function exec(raw: string, o: Out): boolean {
    const norm = raw.toLowerCase().replace(/\s+/g, ' ').replace(/[.!?,]+$/, '').trim();
    for (const w of WITTY) {
      const m = norm.match(w.match);
      if (!m) continue;
      const text = typeof w.reply === 'function' ? w.reply(m) : w.reply;
      if (w.fixes?.length) return o.offer(text, w.fixes);
      o.say(text); return true;
    }
    for (const [re, rep] of COMMON_SLIPS) if (re.test(raw)) return o.fail(`zsh: command not found: ${raw.split(/\s/)[0]}`, [raw.replace(re, rep)]);
    const [cmd, ...args] = tokenize(raw);
    if (!cmd) return true;
    const h = CMDS[cmd.toLowerCase()];
    if (!h) {
      const fixes = closest(cmd, Object.keys(CMDS).filter(k => k.length > 1)).map(c => [c, ...args.map(q)].join(' '));
      if (fixes.length) return o.fail(`zsh: command not found: ${cmd}`, fixes);
      const line = NOT_FOUND_QUIPS[quip.current++ % NOT_FOUND_QUIPS.length].replace('{cmd}', cmd);
      return o.fail(<>{`zsh: command not found: ${cmd}`}{'\n'}<M>{line}</M></>, ['help']);
    }
    return h(args, o) !== false;
  }

  function run(raw: string) {
    const out: Line[] = [];
    let failed: { raw: string; fixes: string[]; offer?: boolean } | null = null;
    const o: Out = {
      say: (node, cls) => { out.push({ key: seq.current++, node, cls }); },
      fail: (msg, fixes = []) => {
        out.push({ key: seq.current++, node: msg });
        if (!failed) failed = { raw, fixes };
        return false;
      },
      offer: (msg, fixes) => {
        out.push({ key: seq.current++, node: msg });
        if (!failed) failed = { raw, fixes, offer: true };
        return true;
      }
    };
    out.push({ key: seq.current++, node: <><span className="p">{prompt(cwdRef.current)}</span> {raw}</> });

    if (FIX_WORDS.includes(raw.trim().toLowerCase())) {
      const fix = lastFail.current;
      if (!fix?.fixes.length) out.push({ key: seq.current++, node: 'No fcvks given' });
      else setPending({ opts: fix.fixes, i: 0 });
      setLines(l => [...l, ...out]);
      return;
    }

    const expanded = raw.replace(/!!/g, hist.current[hist.current.length - 1] ?? '');
    if (expanded !== raw) out.push({ key: seq.current++, node: expanded, cls: 'm' });
    if (raw) { hist.current.push(expanded); hi.current = hist.current.length; }
    let clear = false;
    for (const part of expanded.split('&&').map(s => s.trim())) {
      if (part === 'clear') { clear = true; continue; }
      if (!exec(part, o)) break;
    }
    lastFail.current = failed;
    const f = failed as { fixes: string[]; offer?: boolean } | null;
    if (f?.fixes.length) out.push({ key: seq.current++, cls: 'm hint',
      node: f.offer || f.fixes[0] === 'help' ? <>Type <D>fcvk</D> for: {f.fixes[0]}</> : <>Mistyped? Type <D>fcvk</D> to fix it.</> });
    setLines(l => clear ? [] : [...l, ...out]);
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (pending) {
      e.preventDefault();
      if (e.key === 'ArrowUp') setPending({ ...pending, i: (pending.i - 1 + pending.opts.length) % pending.opts.length });
      if (e.key === 'ArrowDown') setPending({ ...pending, i: (pending.i + 1) % pending.opts.length });
      if (e.key === 'Enter') { const cmd = pending.opts[pending.i]; setPending(null); run(cmd); }
      if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'c')) {
        setPending(null);
        setLines(l => [...l, { key: seq.current++, node: '^C', cls: 'm' }]);
      }
      return;
    }
    const h = hist.current;
    if (e.key === 'ArrowUp' && h.length) { hi.current = Math.max(0, hi.current - 1); setInput(h[hi.current]); e.preventDefault(); }
    if (e.key === 'ArrowDown' && h.length) { hi.current = Math.min(h.length, hi.current + 1); setInput(h[hi.current] ?? ''); }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') { setLines(l => [...l, { key: seq.current++, node: <><span className="p">{prompt(cwdRef.current)}</span> {input}^C</> }]); setInput(''); }
    if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); setLines([]); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const words = tokenize(input), last = words.pop() ?? '';
      const pool = words.length ? namesIn(cwdRef.current).concat(DIRS) : Object.keys(CMDS);
      const hit = pool.filter(n => n.toLowerCase().startsWith(last.toLowerCase()));
      if (hit.length === 1) setInput([...words.map(q), q(hit[0])].join(' ') + ((DIRS as string[]).includes(hit[0]) ? '/' : ' '));
    }
    if (e.key === 'Enter') { run(input.trim()); setInput(''); }
  };

  return (
    <WindowFrame win={win} w={680} h={440} className="term-win">
      <div className="term" ref={box} onClick={() => field.current?.focus()}>
        {lines.map(l => <div key={l.key} className={'ln ' + (l.cls ?? '')}>{l.node}</div>)}
        <div className="in">
          {pending ? (
            <span className="fixline">
              <b>{pending.opts[pending.i]}</b> [<span className="g">enter</span>/<span className="d">↑</span>/<span className="d">↓</span>/<span className="r">ctrl+c</span>]
            </span>
          ) : <span className="p">{prompt(cwd)}</span>}
          <input ref={field} aria-label={pending ? 'Choose a correction' : 'Terminal input'} autoComplete="off" spellCheck={false}
            value={pending ? '' : input} readOnly={!!pending}
            onChange={e => setInput(e.target.value)} onKeyDown={onKey} />
        </div>
      </div>
    </WindowFrame>
  );
}
