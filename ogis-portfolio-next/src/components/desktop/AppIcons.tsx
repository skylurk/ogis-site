'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';

// Full-colour app icons in the style of macOS Tahoe: a continuous-curve "squircle",
// layered gradients and a soft glass edge. Each is drawn in a 100×100 box.

/** The iOS/macOS squircle: corners that curve continuously instead of a plain radius. */
export const SQUIRCLE = 'M50 0C89.8 0 100 10.2 100 50S89.8 100 50 100 0 89.8 0 50 10.2 0 50 0Z';

function Base({ children, bg, defs }: { children?: ReactNode; bg: [string, string] | string; defs?: (id: string) => ReactNode }) {
  const raw = useId(), id = raw.replace(/:/g, '');
  const fill = typeof bg === 'string' ? bg : `url(#${id}bg)`;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <clipPath id={`${id}c`}><path d={SQUIRCLE} /></clipPath>
        {typeof bg !== 'string' && <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={bg[0]} /><stop offset="1" stopColor={bg[1]} /></linearGradient>}
        <linearGradient id={`${id}gl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient>
        {defs?.(id)}
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect width="100" height="100" fill={fill} />
        {children}
        <rect width="100" height="100" fill={`url(#${id}gl)`} />
      </g>
      <path d={SQUIRCLE} fill="none" stroke="#fff" strokeOpacity=".38" strokeWidth="1.4" />
      <path d={SQUIRCLE} fill="none" stroke="#000" strokeOpacity=".12" strokeWidth=".6" />
    </svg>
  );
}

const Finder = () => (
  <Base bg={['#1e7bf2', '#1550c8']}>
    <path d="M0 0h57c-6 20-9 38-8 57h7c-1 15 0 29 3 43H0Z" fill="#7fd3ff" />
    <rect x="27" y="29" width="6" height="15" rx="3" fill="#0b2554" />
    <rect x="67" y="29" width="6" height="15" rx="3" fill="#0b2554" />
    <path d="M22 66c14 13 42 13 56 0" stroke="#0b2554" strokeWidth="4.5" fill="none" strokeLinecap="round" />
  </Base>
);

const Mail = () => (
  <Base bg={['#62d0ff', '#1769ef']}>
    <rect x="17" y="28" width="66" height="45" rx="7" fill="#fff" />
    <path d="M19 32l31 24 31-24" stroke="#2f80f5" strokeWidth="3.6" fill="none" strokeLinejoin="round" />
    <path d="M19 70l22-17M81 70L59 53" stroke="#d6e6ff" strokeWidth="2.4" />
  </Base>
);

const Messages = () => (
  <Base bg={['#6be680', '#13b244']}>
    <ellipse cx="50" cy="47" rx="32" ry="25" fill="#fff" />
    <path d="M28 63c-1 8-6 13-11 16 9 1 18-2 24-8z" fill="#fff" />
  </Base>
);

const Contacts = () => (
  <Base bg={['#c99363', '#87552f']}>
    <rect width="15" height="100" fill="#000" opacity=".16" />
    <circle cx="56" cy="40" r="13.5" fill="#f2e4d2" />
    <path d="M31 80c2-15 12-22 25-22s23 7 25 22z" fill="#f2e4d2" />
    <rect x="91" y="20" width="9" height="12" rx="2" fill="#f2c94c" />
    <rect x="91" y="36" width="9" height="12" rx="2" fill="#6fcf97" />
    <rect x="91" y="52" width="9" height="12" rx="2" fill="#56ccf2" />
  </Base>
);

const Gear = ({ teeth = 12, r = 27, color = '#41454d', inner = '#aab0ba' }: { teeth?: number; r?: number; color?: string; inner?: string }) => (
  <g>
    {Array.from({ length: teeth }, (_, i) => <rect key={i} x="45.5" y={50 - r - 8} width="9" height="14" rx="2" fill={color} transform={`rotate(${(360 / teeth) * i} 50 50)`} />)}
    <circle cx="50" cy="50" r={r} fill={color} />
    <circle cx="50" cy="50" r={r - 7} fill={inner} />
    <circle cx="50" cy="50" r={r - 15} fill={color} />
  </g>
);

const Settings = () => (
  <Base bg={['#d3d7de', '#7e8692']}>
    <Gear />
  </Base>
);

const Services = () => (
  <Base bg={['#4cb4ff', '#1858dc']}>
    <path d="M38 37v-6a5 5 0 0 1 5-5h14a5 5 0 0 1 5 5v6" stroke="#fff" strokeWidth="5" fill="none" />
    <rect x="20" y="36" width="60" height="42" rx="8" fill="#fff" />
    <rect x="20" y="52" width="60" height="5" fill="#1858dc" opacity=".28" />
    <rect x="44" y="49" width="12" height="11" rx="2.5" fill="#1858dc" />
  </Base>
);

const TimeMachine = () => (
  <Base bg={['#35b894', '#0b4a42']}>
    <circle cx="50" cy="50" r="25" fill="#f4fbf8" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x="49" y="28" width="2" height={i % 3 ? 3 : 5} fill="#0b4a42" transform={`rotate(${i * 30} 50 50)`} />)}
    <path d="M50 37v14l9 6" stroke="#0b4a42" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 38a30 30 0 1 0 8-12" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M22 20l9 7-11 3z" fill="#fff" />
  </Base>
);

const Calculator = () => (
  <Base bg={['#3c3e44', '#121316']}>
    <rect x="16" y="15" width="68" height="17" rx="4" fill="#1c1d21" />
    <text x="78" y="29" textAnchor="end" fill="#fff" fontSize="13" fontFamily="-apple-system,system-ui,sans-serif" fontWeight="300">42</text>
    {[0, 1, 2].map(r => [0, 1, 2, 3].map(c => (
      <circle key={`${r}${c}`} cx={23 + c * 18} cy={47 + r * 17} r="7" fill={c === 3 ? '#ff9f0a' : r === 0 ? '#a5a5a5' : '#5d6067'} />
    )))}
  </Base>
);

const Terminal = () => (
  <Base bg={['#454a54', '#1a1c21']}>
    <rect x="11" y="13" width="78" height="74" rx="10" fill="#0a0b0e" stroke="#555b66" strokeWidth="1.5" />
    <text x="20" y="38" fill="#eef1f6" fontSize="19" fontWeight="700" fontFamily="'SF Mono',Menlo,monospace">&gt;_</text>
  </Base>
);

function Calendar() {
  // The date only exists in the browser, so render it after mounting to keep server and client markup equal.
  const [d, setD] = useState<Date | null>(null);
  useEffect(() => { setD(new Date()); }, []);
  return (
    <Base bg={['#ffffff', '#eceef2']}>
      <text x="50" y="30" textAnchor="middle" fill="#ff3b30" fontSize="14" fontWeight="600" fontFamily="-apple-system,system-ui,sans-serif" letterSpacing="1">
        {d ? d.toLocaleDateString('en', { weekday: 'short' }).toUpperCase() : ''}
      </text>
      <text x="50" y="78" textAnchor="middle" fill="#1c1c1e" fontSize="46" fontWeight="300" fontFamily="-apple-system,system-ui,sans-serif">{d?.getDate() ?? ''}</text>
    </Base>
  );
}

const Site = () => (
  <Base bg={['#6ec3ff', '#2531a8']}>
    <circle cx="50" cy="50" r="27" fill="none" stroke="#fff" strokeWidth="5" />
    <path d="M30 55c7-6 13-6 20 0s13 6 20 0M34 66c5-4 11-4 16 0s11 4 16 0" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <circle cx="61" cy="38" r="5.5" fill="#fff" />
  </Base>
);

const Resume = () => (
  <Base bg={['#ffffff', '#eceef2']}>
    <path d="M28 12h30l16 16v56a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z" fill="#fff" stroke="#d3d7de" strokeWidth="1.5" />
    <path d="M58 12v13a3 3 0 0 0 3 3h13" fill="#e8ebf0" stroke="#d3d7de" strokeWidth="1.5" />
    <path d="M32 38h32M32 46h32M32 54h22" stroke="#c4c9d2" strokeWidth="3" strokeLinecap="round" />
    <rect x="30" y="64" width="38" height="15" rx="3.5" fill="#ef4b4b" />
    <text x="49" y="75.5" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="-apple-system,system-ui,sans-serif">PDF</text>
  </Base>
);

/** Trash isn't a squircle on macOS: it's a free-standing glass bin, shown full here. */
function Trash() {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9d0db" /><stop offset=".5" stopColor="#f6f8fb" /><stop offset="1" stopColor="#b8c0cc" /></linearGradient>
      </defs>
      <path d="M33 22c2-8 10-10 15-6 3-6 13-5 15 2 6-1 9 4 7 8H30c-1-2 0-4 3-4z" fill="#fff" stroke="#c9cfd8" strokeWidth="1.2" />
      <path d="M24 26h52l-5 64a5 5 0 0 1-5 4.6H34a5 5 0 0 1-5-4.6z" fill={`url(#${id}b)`} stroke="#98a2b1" strokeWidth="1.4" />
      {[34, 42, 50, 58, 66].map(x => <path key={x} d={`M${x} 32l${(x - 50) * 0.06} 56`} stroke="#9aa4b3" strokeWidth="1" opacity=".7" />)}
      {[40, 52, 64, 76].map(y => <path key={y} d={`M${26 + y * 0.06} ${y}h${48 - y * 0.12}`} stroke="#9aa4b3" strokeWidth="1" opacity=".5" />)}
      <ellipse cx="50" cy="26" rx="27" ry="4.5" fill="#e8ecf2" stroke="#98a2b1" strokeWidth="1.4" />
    </svg>
  );
}

export const FULL_ICONS: Record<string, () => ReactNode> = {
  finder: Finder, mail: Mail, helpdesk: Messages, about: Contacts, settings: Settings, services: Services,
  career: TimeMachine, quote: Calculator, terminal: Terminal, calendar: Calendar, site: Site, resume: Resume, trash: Trash
};
