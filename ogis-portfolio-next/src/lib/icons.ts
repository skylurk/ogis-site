// Static SVG markup for icons. These are constants written here, never user input,
// so they are rendered with dangerouslySetInnerHTML (see components/desktop/Icons.tsx).

export const SVG = {
  logo: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4.5 13.5c2.5-2 5-2 7.5 0s5 2 7.5 0M6 17c2-1.4 4-1.4 6 0s4 1.4 6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="15" cy="8" r="2" fill="currentColor"/></svg>',
  search: '<svg class="ico" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12.7 12.7 17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  wifi: '<svg class="ico" viewBox="0 0 20 20"><path d="M2.5 7.5a11 11 0 0 1 15 0M5 10.3a7.3 7.3 0 0 1 10 0M7.6 13a3.6 3.6 0 0 1 4.8 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="15.6" r="1.3" fill="currentColor"/></svg>',
  battery: '<svg class="ico" viewBox="0 0 26 20" style="width:24px"><rect x="1.5" y="5" width="20" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".7"/><rect x="3.3" y="6.8" width="13" height="6.4" rx="1.6" fill="currentColor"/><path d="M23.5 8.5v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></svg>',
  back: '<svg viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fwd: '<svg viewBox="0 0 16 16"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  up: '<svg viewBox="0 0 16 16"><path d="M3 10l5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  down: '<svg viewBox="0 0 16 16"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gridv: '<svg viewBox="0 0 16 16"><g fill="currentColor"><rect x="2" y="2" width="5" height="5" rx="1.2"/><rect x="9" y="2" width="5" height="5" rx="1.2"/><rect x="2" y="9" width="5" height="5" rx="1.2"/><rect x="9" y="9" width="5" height="5" rx="1.2"/></g></svg>',
  listv: '<svg viewBox="0 0 16 16"><path d="M5 4h9M5 8h9M5 12h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><g fill="currentColor"><circle cx="2.3" cy="4" r="1"/><circle cx="2.3" cy="8" r="1"/><circle cx="2.3" cy="12" r="1"/></g></svg>',
  sfolder: '<svg viewBox="0 0 16 16"><path d="M1.8 4.2c0-.8.6-1.4 1.4-1.4h3.1l1.4 1.4h5.1c.8 0 1.4.6 1.4 1.4v6.2c0 .8-.6 1.4-1.4 1.4H3.2c-.8 0-1.4-.6-1.4-1.4z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  strash: '<svg viewBox="0 0 16 16"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.3 4.5l.7 8.5c0 .5.4.9.9.9h4.2c.5 0 .9-.4.9-.9l.7-8.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pdf: '<svg viewBox="0 0 48 60" aria-hidden="true" style="height:56px"><path d="M6 2h26l14 14v40a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" stroke="#d6dae2"/><path d="M32 2v12a2 2 0 0 0 2 2h12" fill="#e4e8ef" stroke="#d6dae2"/><rect x="9" y="38" width="30" height="13" rx="3" fill="#ef4b4b"/><text x="24" y="48" text-anchor="middle" font-family="-apple-system,system-ui,sans-serif" font-size="9" font-weight="800" fill="#fff">PDF</text><path d="M11 20h26M11 26h26M11 32h16" stroke="#c7ccd6" stroke-width="2.4" stroke-linecap="round"/></svg>',
  file: '<svg viewBox="0 0 48 60" aria-hidden="true" style="height:56px"><path d="M6 2h26l14 14v40a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" stroke="#d6dae2"/><path d="M32 2v12a2 2 0 0 0 2 2h12" fill="#f1e2e2" stroke="#d6dae2"/><path d="M11 26h26M11 32h26M11 38h26M11 44h18" stroke="#d9a6a6" stroke-width="2.4" stroke-linecap="round"/></svg>'
};

const G = {
  support: '<svg viewBox="0 0 64 64"><path d="M14 36v-6a18 18 0 0 1 36 0v6" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><rect x="10" y="33" width="11" height="17" rx="4" fill="#fff"/><rect x="43" y="33" width="11" height="17" rx="4" fill="#fff"/><path d="M48 50c0 4-5 6-12 6" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg>',
  dev: '<svg viewBox="0 0 64 64"><path d="M22 20 10 32l12 12M42 20l12 12-12 12" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 14 28 50" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/></svg>',
  ngo: '<svg viewBox="0 0 64 64"><path d="M32 52S10 39 10 24a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 15-22 28-22 28z" fill="#fff"/></svg>',
  career: '<svg viewBox="0 0 64 64"><circle cx="34" cy="33" r="18" fill="none" stroke="#fff" stroke-width="4.5"/><path d="M34 22v12l8 5" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 26l6 8 7-7" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  services: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="18" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="6.5 4.8"/><circle cx="32" cy="32" r="9" fill="none" stroke="#fff" stroke-width="4"/></svg>',
  plane: '<svg viewBox="0 0 64 64"><path d="M32 6c2.4 0 3.6 2.4 3.6 5v13l19 11v6l-19-6v11l6 5v5l-9.6-2.6L22.4 56v-5l6-5V35l-19 6v-6l19-11V11c0-2.6 1.2-5 3.6-5z" fill="#fff"/></svg>',
  pin: '<svg viewBox="0 0 64 64"><path d="M32 8a16 16 0 0 0-16 16c0 12 16 31 16 31s16-19 16-31A16 16 0 0 0 32 8zm0 23a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" fill="#fff"/><ellipse cx="32" cy="57" rx="12" ry="3" fill="#fff" opacity=".5"/></svg>',
  car: '<svg viewBox="0 0 64 64"><path d="M10 37l6-12a6 6 0 0 1 5.4-3.4h21.2A6 6 0 0 1 48 25l6 12v10a2 2 0 0 1-2 2h-5v-4H17v4h-5a2 2 0 0 1-2-2z" fill="#fff"/><circle cx="20" cy="40" r="3.5" fill="#1d3557" opacity=".5"/><circle cx="44" cy="40" r="3.5" fill="#1d3557" opacity=".5"/><path d="M18 33l3.5-7.5h21L46 33z" fill="#1d3557" opacity=".35"/></svg>',
  db: '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="16" rx="17" ry="6.5" fill="#fff"/><path d="M15 16v32c0 3.6 7.6 6.5 17 6.5s17-2.9 17-6.5V16M15 32c0 3.6 7.6 6.5 17 6.5S49 35.6 49 32" fill="none" stroke="#fff" stroke-width="4.5"/></svg>',
  qr: '<svg viewBox="0 0 64 64" fill="#fff"><path d="M10 10h18v18H10zm5 5v8h8v-8zM36 10h18v18H36zm5 5v8h8v-8zM10 36h18v18H10zm5 5v8h8v-8z"/><rect x="36" y="36" width="7" height="7"/><rect x="47" y="36" width="7" height="7"/><rect x="36" y="47" width="7" height="7"/><rect x="47" y="47" width="7" height="7"/><rect x="41.5" y="41.5" width="7" height="7"/></svg>',
  prop: '<svg viewBox="-32 -32 64 64"><g fill="#fff"><ellipse rx="5.5" ry="19" cy="-14"/><ellipse rx="5.5" ry="19" cy="-14" transform="rotate(120)"/><ellipse rx="5.5" ry="19" cy="-14" transform="rotate(240)"/></g><circle r="6" fill="#fff" stroke="#3a2a8a" stroke-width="3" stroke-opacity=".4"/></svg>',
  finder: '<svg viewBox="0 0 64 64"><path d="M22 21v8M43 21v8" stroke="#0b2a5a" stroke-width="4" stroke-linecap="round"/><path d="M17 42c9 7.5 21 7.5 30 0" stroke="#0b2a5a" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M34 8c-4.5 12-5.5 22-3.5 31h5" stroke="#0b2a5a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  about: '<svg viewBox="0 0 64 64"><circle cx="32" cy="24" r="11" fill="#fff"/><path d="M12 54c2-11 10-17 20-17s18 6 20 17z" fill="#fff"/></svg>',
  terminal: '<svg viewBox="0 0 64 64"><path d="M15 22l11 9-11 9" stroke="#e8ecf2" stroke-width="4.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 43h17" stroke="#e8ecf2" stroke-width="4.2" stroke-linecap="round"/></svg>',
  mail: '<svg viewBox="0 0 64 64"><rect x="8" y="16" width="48" height="33" rx="5" fill="#fff"/><path d="M10 19l22 17 22-17" stroke="#3b8af5" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>',
  trash: '<svg viewBox="0 0 64 64"><path d="M14 16h36l-3.5 38a3 3 0 0 1-3 2.7H20.5a3 3 0 0 1-3-2.7z" fill="rgba(255,255,255,.55)" stroke="#8c96a8" stroke-width="2"/><ellipse cx="32" cy="16" rx="19" ry="3.6" fill="#dfe5ee" stroke="#8c96a8" stroke-width="2"/><path d="M24 24l2 26M32 24v26M40 24l-2 26" stroke="#9ea8b8" stroke-width="1.6" stroke-linecap="round"/></svg>',
  helpdesk: '<svg viewBox="0 0 64 64"><path d="M14 14h28a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H28l-9 7v-7h-5a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z" fill="#fff"/><path d="M52 26h2a6 6 0 0 1 6 6v9a6 6 0 0 1-6 6h-2v5l-7-5h-7" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" opacity=".7"/><circle cx="20" cy="28" r="2.6" fill="#1fa463"/><circle cx="28" cy="28" r="2.6" fill="#1fa463"/><circle cx="36" cy="28" r="2.6" fill="#1fa463"/></svg>',
  quote: '<svg viewBox="0 0 64 64"><rect x="14" y="10" width="36" height="12" rx="3" fill="#e9eaee"/>' + [0, 1, 2].map(r => [0, 1, 2].map(c => `<circle cx="${20 + c * 12}" cy="${32 + r * 10}" r="4.2" fill="${c === 2 ? '#ff9f0a' : '#6b6e76'}"/>`).join('')).join('') + '</svg>',
  site: '<svg viewBox="0 0 24 24" style="color:#fff">' + SVG.logo.slice(SVG.logo.indexOf('>') + 1)
};
export type GlyphKey = keyof typeof G;
export const GLYPH: Record<GlyphKey, string> = G;

// Tahoe lets folders take a tint and a symbol; each top-level folder gets its own.
export const TINTS = {
  blue: ['#4597ec', '#76bbf7', '#a9d6ff', '#5fa8ef'],
  green: ['#36a862', '#69cc8b', '#a6eabc', '#4fb974'],
  orange: ['#e3842c', '#f6ad58', '#ffd6a3', '#ec983f'],
  pink: ['#d4527f', '#ef84a9', '#ffc3d7', '#e36b96'],
  teal: ['#1f9d93', '#4cc7bb', '#9de9e0', '#36b2a6']
} as const;
export type Tint = keyof typeof TINTS;

export function folderSVG(tint: Tint = 'blue', sym?: GlyphKey) {
  const [a, b, c, d] = TINTS[tint];
  const symbol = sym ? `<g transform="translate(23 22) scale(.28)" opacity=".5" style="mix-blend-mode:multiply">${G[sym].replace(/#fff/g, d).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>` : '';
  return `<svg viewBox="0 0 64 52" aria-hidden="true"><path d="M3 9a5 5 0 0 1 5-5h15.3a4 4 0 0 1 2.9 1.2L30 9h26a5 5 0 0 1 5 5v6H3z" fill="${a}"/><rect x="2" y="14" width="60" height="36" rx="5.5" fill="${b}"/><rect x="2" y="14" width="60" height="5" rx="2.5" fill="${c}" opacity=".9"/><rect x="2" y="44" width="60" height="6" rx="3" fill="${d}" opacity=".7"/>${symbol}</svg>`;
}
