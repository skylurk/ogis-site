// Helpers for the Terminal's thefuck-style corrections (https://github.com/nvbn/thefuck).
// Pure functions only, so the rules are easy to test and extend.

/** Optimal string alignment distance: Levenshtein plus adjacent swaps ("psuh" → "push" costs 1). */
export function editDistance(a: string, b: string): number {
  a = a.toLowerCase(); b = b.toLowerCase();
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    const cost = a[i - 1] === b[j - 1] ? 0 : 1;
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[a.length][b.length];
}

/** The closest candidates to `word`, best first, within a typo-sized distance. */
export function closest(word: string, candidates: string[], max = 3): string[] {
  const limit = Math.max(2, Math.floor(word.length / 3));
  return candidates
    .map(c => ({ c, d: c.toLowerCase().startsWith(word.toLowerCase()) && word.length >= 3 ? 0.5 : editDistance(word, c) }))
    .filter(x => x.d <= limit && x.c.toLowerCase() !== word.toLowerCase())
    .sort((x, y) => x.d - y.d || x.c.length - y.c.length)
    .slice(0, max)
    .map(x => x.c);
}

/** Splits a command line like a shell: quotes and backslash-escaped spaces keep words together. */
export function tokenize(raw: string): string[] {
  const out: string[] = []; let cur = '', quote: string | null = null, has = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (quote) { if (ch === quote) quote = null; else cur += ch; continue; }
    if (ch === '"' || ch === "'") { quote = ch; has = true; continue; }
    if (ch === '\\' && i + 1 < raw.length) { cur += raw[++i]; has = true; continue; }
    if (/\s/.test(ch)) { if (cur || has) out.push(cur); cur = ''; has = false; continue; }
    cur += ch;
  }
  if (cur || has) out.push(cur);
  return out;
}

/** Quotes a word for display if it contains spaces. */
export const q = (w: string) => (/\s/.test(w) ? `"${w}"` : w);

/** Whole-line rewrites for typos people make all the time, checked before anything else. */
export const COMMON_SLIPS: [RegExp, string][] = [
  [/^cd\.\.(.*)$/, 'cd ..$1'],
  [/^ls-(\w+)(.*)$/, 'ls -$1$2'],
  [/^sl(\s.*)?$/, 'ls$1'],
  [/^gti(\s.*)?$/, 'git$1'],
  [/^got(\s.*)?$/, 'git$1'],
  [/^pyhton3?(\s.*)?$/, 'python3$1'],
  [/^claer$/, 'clear'],
  [/^cler$/, 'clear'],
  [/^exti$/, 'exit'],
  [/^suod(\s.*)?$/, 'sudo$1'],
  [/^nmp(\s.*)?$/, 'npm$1']
];
