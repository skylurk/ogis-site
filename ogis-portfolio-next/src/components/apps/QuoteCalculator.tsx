'use client';

import { useState } from 'react';
import { OWNER } from '@/data/portfolio';
import { QUOTE_SERVICES, QUOTE_TEAMS, QUOTE_TIMELINE, QUOTE_WHEN, quoteSize, type QuoteService, SIZE_NAMES } from '@/data/helpdesk';
import { useApps, type Win } from '../desktop/DesktopContext';
import WindowFrame from '../desktop/WindowFrame';

type KeyProps = { on?: boolean; cls: string; children: React.ReactNode; onClick: () => void; label?: string };
function Key({ on, cls, children, onClick, label }: KeyProps) {
  return <button className={`key ${cls}${on ? ' on' : ''}`} aria-pressed={on} aria-label={label} onClick={onClick}>{children}</button>;
}

/** A Calculator-style toy that sizes a job: pick a service, team size and urgency. */
export default function QuoteCalculator({ win }: { win: Win }) {
  const apps = useApps();
  const [service, setService] = useState<QuoteService | null>(null);
  const [team, setTeam] = useState<number | null>(null);
  const [when, setWhen] = useState<number | null>(null);
  const [ngo, setNgo] = useState(false);

  const label = QUOTE_SERVICES.find(([k]) => k === service)?.[1];
  const size = service != null && team != null ? quoteSize(service, team) : null;

  let big = 'Pick a service', small = 'Top row: what do you need?';
  if (service && team == null) { big = label!; small = 'Next: how many people will use it?'; }
  if (service && size != null) {
    big = SIZE_NAMES[size];
    small = `${label} · ${QUOTE_TEAMS[team!]} people · about ${QUOTE_TIMELINE[service][size]}`;
  }
  const notes = [ngo && 'NGO rate available ♥', when === 2 && 'Rush job: mention it in your email', when === 1 && 'This month is usually fine'].filter(Boolean) as string[];

  const send = () => {
    const lines = [
      `Hi ${OWNER.name},`, '',
      'I used the Quote Calculator on your site:',
      `• Service: ${label ?? 'not sure yet'}`,
      `• People who will use it: ${team != null ? QUOTE_TEAMS[team] : 'not sure'}`,
      `• Timing: ${when != null ? QUOTE_WHEN[when] : 'flexible'}`,
      ngo ? '• We are an NGO' : '',
      size != null ? `• Your estimate: ${SIZE_NAMES[size]}, about ${QUOTE_TIMELINE[service!][size]}` : '',
      '', 'A bit more about what we need:', '', ''
    ].filter((l, i, a) => l !== '' || a[i - 1] !== '');
    apps.mail(`Quote request${label ? `: ${label}` : ''}`, lines.join('\n'));
  };
  const clear = () => { setService(null); setTeam(null); setWhen(null); setNgo(false); };

  return (
    <WindowFrame win={win} w={320} h={540} className="calc-win">
      <div className="calc">
        <div className="calc-display" aria-live="polite">
          <div className="calc-small">{small}</div>
          <div className="calc-big">{big}</div>
          <div className="calc-notes">{notes.map(n => <span key={n}>{n}</span>)}</div>
        </div>
        <div className="calc-keys">
          {QUOTE_SERVICES.map(([k, l]) => <Key key={k} cls="fn" on={service === k} onClick={() => setService(k)}>{l}</Key>)}
          {QUOTE_TEAMS.map((t, i) => <Key key={t} cls="num" on={team === i} onClick={() => setTeam(i)} label={`${t} people`}>{t}<small>people</small></Key>)}
          <Key cls="op" on={ngo} onClick={() => setNgo(n => !n)} label="We are an NGO">NGO</Key>
          {QUOTE_WHEN.map((w, i) => <Key key={w} cls="num" on={when === i} onClick={() => setWhen(i)}>{w}</Key>)}
          <Key cls="fn" onClick={clear} label="Clear">AC</Key>
          <button className="key op wide" onClick={send}>= Get a quote</button>
        </div>
        <p className="calc-foot">An estimate of size and time, not a price. David replies with a real quote.</p>
      </div>
    </WindowFrame>
  );
}
