'use client';

import { useEffect, useRef } from 'react';
import type { VizKind } from '@/data/portfolio';

const FONT = '-apple-system,system-ui,sans-serif';

function FlightMap() {
  const stops: [number, number, string, string, 'start' | 'end', number, number][] = [
    [90, 78, 'Kisumu · HKKI', 'Crew 2', 'start', -14, 22],
    [222, 108, 'Wilson · HKNW', 'Crew 1, 3', 'end', -10, 22],
    [338, 166, 'Mombasa · HKMO', 'Crew 4', 'end', -12, -4]
  ];
  return (
    <div className="viz v-map">
      <svg className="full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
        <path d="M90 78Q160 40 222 108" fill="none" stroke="#4fc3f7" strokeWidth="1.6" strokeDasharray="4 5" />
        <path d="M222 108Q300 110 338 166" fill="none" stroke="#4fc3f7" strokeWidth="1.6" strokeDasharray="4 5" />
        {stops.map(([x, y, n, c, a, dx, dy]) => (
          <g key={n}>
            <circle cx={x} cy={y} r="5" fill="#4cd577" className="pulse" />
            <circle cx={x} cy={y} r="5" fill="#4cd577" stroke="#fff" strokeWidth="1.5" />
            <text x={x + dx} y={y + dy} textAnchor={a} fill="#e8f3ff" fontSize="11" fontWeight="600" fontFamily={FONT}>{n}</text>
            <text x={x + dx} y={y + dy + 14} textAnchor={a} fill="#8fb4cf" fontSize="10" fontFamily={FONT}>{c}</text>
          </g>
        ))}
        <g transform="translate(160 62) rotate(35)"><path d="M0-9c1 0 1.5 1 1.5 2v5l7.5 4.5V5L1.5 2.6v4.4L4 9v2l-4-1-4 1V9l2.5-2V2.6L-9 5V2.5L-1.5-2v-5c0-1 .5-2 1.5-2z" fill="#fff" /></g>
      </svg>
      <span className="badge">Crew on duty · 4</span><span className="badge r">Sample data</span>
    </div>
  );
}

function Geofence() {
  const log: [string, string, 'in' | 'out'][] = [['08:58 Gate A', 'Checked in', 'in'], ['09:14 Reception', 'Checked in', 'in'], ['09:40 Gate A', 'Checked out', 'out'], ['10:02 Outside fence', 'Blocked', 'out']];
  return (
    <div className="viz v-geo">
      <div className="area">
        <svg className="full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
          <circle cx="100" cy="104" r="62" fill="rgba(31,158,87,.12)" stroke="#1f9e57" strokeWidth="1.6" strokeDasharray="5 4" />
          <circle cx="100" cy="104" r="14" fill="rgba(31,158,87,.25)" className="pulse" />
          <path d="M100 76a14 14 0 0 0-14 14c0 10 14 26 14 26s14-16 14-26a14 14 0 0 0-14-14z" fill="#1f9e57" /><circle cx="100" cy="90" r="5" fill="#fff" />
          <path d="M100 104h62" stroke="#1f9e57" strokeWidth="1.2" />
          <text x="131" y="99" textAnchor="middle" fill="#14663b" fontSize="11" fontWeight="700" fontFamily={FONT}>20 m</text>
          <circle cx="58" cy="132" r="4" fill="#2a7cf7" /><circle cx="182" cy="40" r="4" fill="#b5541c" />
        </svg>
      </div>
      <div className="log">
        <b>Today at the gate</b>
        {log.map(([a, b, c]) => <div key={a}><span>{a}</span><span className={c}>{b}</span></div>)}
        <div style={{ color: '#7b8191', marginTop: 'auto' }}>Sample data</div>
      </div>
    </div>
  );
}

function Diagnostics() {
  const rows: [string, string, string, string][] = [['DME', 'Engine electronics', 'ok', 'No faults'], ['EGS', 'Transmission', 'ok', 'No faults'], ['DSC', 'Stability control', 'bad', '2 faults [DEMO]'], ['KOMBI', 'Instrument cluster', 'ok', 'No faults'], ['FRM', 'Footwell module', 'bad', '1 fault [DEMO]'], ['SZL', 'Steering column', 'na', 'No response']];
  return (
    <div className="viz v-term">
      <span className="badge">BMW 3 Series E90 · Simulator mode</span>
      {rows.map(([a, b, c, d]) => <div className="r" key={a}><span>{a}</span><span style={{ color: '#9aa3b8' }}>{b}</span><span className={c}>{d}</span></div>)}
    </div>
  );
}

function Database() {
  const rows: [string, string, number, string][] = [['b_1042', 'Achieng O.', 3, 'confirmed'], ['b_1043', 'Kamau N.', 1, 'pending'], ['b_1044', 'Wanjiru M.', 5, 'confirmed'], ['b_1045', 'Otieno J.', 2, 'cancelled']];
  return (
    <div className="viz v-db">
      <span className="badge">Firebase · sample project</span>
      <div className="tree"><span>▾ demo-app</span><span>&nbsp;&nbsp;▸ users</span><span className="on">&nbsp;&nbsp;▾ bookings</span><span>&nbsp;&nbsp;▸ payments</span><span>&nbsp;&nbsp;▸ settings</span></div>
      <table><thead><tr><th>id</th><th>guest</th><th>nights</th><th>status</th></tr></thead>
        <tbody>{rows.map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table>
    </div>
  );
}

function QR() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const x = ref.current!.getContext('2d')!, n = 29; let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    x.fillStyle = '#fff'; x.fillRect(0, 0, n, n); x.fillStyle = '#111318';
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (rnd() > .52) x.fillRect(i, j, 1, 1);
    for (const [a, b] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      x.fillStyle = '#fff'; x.fillRect(a - 1, b - 1, 9, 9); x.fillStyle = '#111318'; x.fillRect(a, b, 7, 7);
      x.fillStyle = '#fff'; x.fillRect(a + 1, b + 1, 5, 5); x.fillStyle = '#111318'; x.fillRect(a + 2, b + 2, 3, 3);
    }
  }, []);
  return (
    <div className="viz v-qr">
      <canvas ref={ref} width={29} height={29} aria-label="Illustration of a QR code" />
      <div className="qt"><b>ogiscreatives.com</b><span>Encoded directly</span><span>No redirect or short link</span><span>Never expires</span><span>Runs in your browser</span></div>
    </div>
  );
}

function Roadmap() {
  const steps: [string, string, string][] = [['done', 'Planning', 'Stack & workflows agreed'], ['done', 'Set-up', 'Workspace & database'], ['now', 'Build', 'Screens, reviewed by owner'], ['', 'Pilot', 'With an operator']];
  return (
    <div className="viz v-road">
      <span className="badge">Roadmap</span>
      <ol>{steps.map(([c, t, s]) => <li key={t} className={c}><i />{t}<small>{s}</small></li>)}</ol>
    </div>
  );
}

const VIZ: Record<VizKind, () => React.JSX.Element> = { map: FlightMap, geo: Geofence, term: Diagnostics, db: Database, qr: QR, road: Roadmap };
export default function ProjectViz({ kind }: { kind: VizKind }) {
  const V = VIZ[kind];
  return <V />;
}
