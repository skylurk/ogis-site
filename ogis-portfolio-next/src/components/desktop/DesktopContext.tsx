'use client';

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { FOLDERS, type FolderName, type Item, PROJECTS, type Project, type ServiceId } from '@/data/portfolio';

export type AppKey = 'finder' | 'about' | 'helpdesk' | 'services' | 'career' | 'calendar' | 'quote' | 'mail' | 'terminal' | 'settings' | 'site' | 'preview' | 'trash';
export type WinKind = 'finder' | 'about' | 'site' | 'services' | 'career' | 'project' | 'resume' | 'mail' | 'terminal' | 'helpdesk' | 'quote' | 'calendar' | 'settings' | 'junk';

export const APP_NAMES: Record<AppKey, string> = {
  finder: 'Finder', about: 'About David', helpdesk: 'Help Desk', services: 'Services', career: 'Career', calendar: 'Calendar', quote: 'Quote Calculator', mail: 'Mail', settings: 'System Settings',
  terminal: 'Terminal', site: 'About This Site', preview: 'Preview', trash: 'Trash'
};

export type WinProps = { folder?: FolderName; service?: ServiceId; index?: number; projectId?: string; subject?: string; body?: string; node?: string; ask?: string; pane?: string; junk?: string };
export type Win = { id: string; app: AppKey; kind: WinKind; title: string; props: WinProps; z: number; min: boolean; nonce: number };
type OpenSpec = Omit<Win, 'z' | 'min' | 'nonce'>;

type State = { wins: Win[]; top: number; locked: boolean; spot: boolean; toastMsg: string | null };
type Action =
  | { t: 'open'; spec: OpenSpec }
  | { t: 'close'; id: string }
  | { t: 'focus'; id: string }
  | { t: 'min'; id: string; min: boolean }
  | { t: 'lock'; locked: boolean }
  | { t: 'spot'; open: boolean }
  | { t: 'toast'; msg: string | null };

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case 'open': {
      const top = s.top + 1, existing = s.wins.find(w => w.id === a.spec.id);
      if (existing) return { ...s, top, wins: s.wins.map(w => w.id === a.spec.id ? { ...w, ...a.spec, z: top, min: false, nonce: w.nonce + 1 } : w) };
      return { ...s, top, wins: [...s.wins, { ...a.spec, z: top, min: false, nonce: 0 }] };
    }
    case 'close': return { ...s, wins: s.wins.filter(w => w.id !== a.id) };
    case 'focus': {
      const w = s.wins.find(x => x.id === a.id);
      if (!w || w.z === s.top) return s;
      return { ...s, top: s.top + 1, wins: s.wins.map(x => x.id === a.id ? { ...x, z: s.top + 1 } : x) };
    }
    case 'min': return { ...s, top: s.top + 1, wins: s.wins.map(w => w.id === a.id ? { ...w, min: a.min, z: a.min ? w.z : s.top + 1 } : w) };
    case 'lock': return { ...s, locked: a.locked, spot: false };
    case 'spot': return { ...s, spot: a.open };
    case 'toast': return { ...s, toastMsg: a.msg };
  }
}

type Ctx = State & {
  activeId: string | null;
  open: (spec: OpenSpec) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  setMin: (id: string, min: boolean) => void;
  setLocked: (locked: boolean) => void;
  setSpot: (open: boolean) => void;
  toast: (msg: string) => void;
};
const DesktopCtx = createContext<Ctx | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { wins: [], top: 20, locked: true, spot: false, toastMsg: null });
  const open = useCallback((spec: OpenSpec) => dispatch({ t: 'open', spec }), []);
  const close = useCallback((id: string) => dispatch({ t: 'close', id }), []);
  const focus = useCallback((id: string) => dispatch({ t: 'focus', id }), []);
  const setMin = useCallback((id: string, min: boolean) => dispatch({ t: 'min', id, min }), []);
  const setLocked = useCallback((locked: boolean) => dispatch({ t: 'lock', locked }), []);
  const setSpot = useCallback((o: boolean) => dispatch({ t: 'spot', open: o }), []);
  const toast = useCallback((msg: string) => {
    dispatch({ t: 'toast', msg });
    setTimeout(() => dispatch({ t: 'toast', msg: null }), 2600);
  }, []);
  const activeId = useMemo(() => {
    let best: Win | null = null;
    for (const w of state.wins) if (!w.min && (!best || w.z > best.z)) best = w;
    return best?.id ?? null;
  }, [state.wins]);
  const value = useMemo<Ctx>(() => ({ ...state, toast, activeId, open, close, focus, setMin, setLocked, setSpot }),
    [state, activeId, open, close, focus, setMin, setLocked, setSpot, toast]);
  return <DesktopCtx.Provider value={value}>{children}</DesktopCtx.Provider>;
}

export function useDesktop() {
  const c = useContext(DesktopCtx);
  if (!c) throw new Error('useDesktop must be used inside DesktopProvider');
  return c;
}

/** Named ways to open each window, shared by icons, menus, Spotlight and Terminal. */
export function useApps() {
  const { open, toast } = useDesktop();
  return useMemo(() => {
    const a = {
      finder: (folder: FolderName = 'Projects') => open({ id: 'finder', app: 'finder', kind: 'finder', title: folder, props: { folder } }),
      about: () => open({ id: 'about', app: 'about', kind: 'about', title: 'About David', props: {} }),
      site: () => open({ id: 'site', app: 'site', kind: 'site', title: 'About This Site', props: {} }),
      services: (service: ServiceId = 'support') => open({ id: 'services', app: 'services', kind: 'services', title: 'Services', props: { service } }),
      career: (index = 0) => open({ id: 'career', app: 'career', kind: 'career', title: 'Career', props: { index } }),
      project: (p: Project) => open({ id: 'proj:' + p.id, app: 'finder', kind: 'project', title: p.name, props: { projectId: p.id } }),
      resume: () => open({ id: 'resume', app: 'preview', kind: 'resume', title: 'David Résumé.pdf', props: {} }),
      mail: (subject?: string, body?: string) => open({ id: 'mail', app: 'mail', kind: 'mail', title: 'New Message', props: { subject, body } }),
      helpdesk: (node?: string, ask?: string) => open({ id: 'helpdesk', app: 'helpdesk', kind: 'helpdesk', title: 'Help Desk', props: { node, ask } }),
      quote: () => open({ id: 'quote', app: 'quote', kind: 'quote', title: 'Quote Calculator', props: {} }),
      calendar: (topic?: string) => open({ id: 'calendar', app: 'calendar', kind: 'calendar', title: 'Book a Call', props: { subject: topic } }),
      settings: (pane?: string) => open({ id: 'settings', app: 'settings', kind: 'settings', title: 'System Settings', props: { pane } }),
      junk: (name: string) => open({ id: 'junk', app: 'finder', kind: 'junk', title: name, props: { junk: name } }),
      terminal: () => open({ id: 'terminal', app: 'terminal', kind: 'terminal', title: 'guest — zsh — 80×24', props: {} })
    };
    const launch: Record<AppKey, () => void> = {
      finder: () => a.finder(), about: a.about, helpdesk: () => a.helpdesk(), services: () => a.services(), career: () => a.career(), calendar: () => a.calendar(), quote: a.quote, mail: () => a.mail(), settings: () => a.settings(),
      terminal: a.terminal, site: a.site, preview: a.resume, trash: () => a.finder('Trash')
    };
    const openItem = (it: Item) => {
      switch (it.type) {
        case 'folder': return a.finder(it.name);
        case 'project': return a.project(it.ref);
        case 'service': return a.services(it.ref.id);
        case 'work': return a.career(WORK_INDEX(it.ref.org));
        case 'pdf': return a.resume();
        case 'app': return ({ about: a.about, mail: () => a.mail(), site: a.site, helpdesk: () => a.helpdesk(), quote: a.quote, calendar: () => a.calendar(), settings: () => a.settings() })[it.icon]();
        case 'junk': return a.junk(it.name);
        case 'file': return toast(`“${it.name}” is in the Trash. It is staying there.`);
      }
    };
    return { ...a, launch, openItem, projectById: (id?: string) => PROJECTS.find(p => p.id === id) };
  }, [open, toast]);
}

const WORK_INDEX = (org: string) => FOLDERS.Career.findIndex(i => i.name === org);
export const isPhone = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches;
export const isCoarse = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
