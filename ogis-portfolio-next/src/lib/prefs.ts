// Visitor preferences (appearance, reduce motion), saved in this browser only.

export type Theme = 'auto' | 'light' | 'dark';
const THEME_KEY = 'ogis-theme', MOTION_KEY = 'ogis-motion';

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

export function readTheme(): Theme { const t = read(THEME_KEY); return t === 'light' || t === 'dark' ? t : 'auto'; }
export function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'auto') delete root.dataset.theme; else root.dataset.theme = t;
  write(THEME_KEY, t);
}

export function readReduceMotion() { return read(MOTION_KEY) === 'reduce'; }
export function applyReduceMotion(on: boolean) {
  const root = document.documentElement;
  if (on) root.dataset.motion = 'reduce'; else delete root.dataset.motion;
  write(MOTION_KEY, on ? 'reduce' : 'full');
}

/** Runs before the page paints (inlined in the layout) so a saved theme never flashes the wrong colours. */
export const PREFS_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;if(localStorage.getItem('${MOTION_KEY}')==='reduce')document.documentElement.dataset.motion='reduce'}catch(e){}})()`;
