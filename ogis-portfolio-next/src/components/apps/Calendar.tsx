'use client';

import { useEffect, useMemo, useState } from 'react';
import { BOOKING, fmtLong, fmtNairobi, fmtTime, nairobiDay, type Slot, visitorZone, weekDays, weekStart } from '@/data/booking';
import { OWNER } from '@/data/portfolio';
import { SVG } from '@/lib/icons';
import { useApps, type Win } from '../desktop/DesktopContext';
import { Svg } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';
import { usePhone } from '../desktop/usePhone';

/** A Google Calendar-style booking page: pick a free slot, add a few details, send the request. */
export default function Calendar({ win }: { win: Win }) {
  const apps = useApps();
  const phone = usePhone();
  const [now, setNow] = useState<number | null>(null);
  const [week, setWeek] = useState(0);
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [method, setMethod] = useState<string>(BOOKING.methods[0]);
  const [name, setName] = useState('');
  const [topic, setTopic] = useState(win.props.subject ?? '');
  useEffect(() => { setNow(Date.now()); }, []);
  useEffect(() => { if (win.props.subject) setTopic(win.props.subject); }, [win.nonce, win.props.subject]);

  const days = useMemo(() => (now ? weekDays(now, week) : []), [now, week]);
  // Start on the first week and day that still have something free.
  useEffect(() => {
    if (!now || week !== 0) return;
    const first = days.findIndex(d => d.slots.some(s => !s.busy && !s.past));
    if (first === -1) setWeek(1); else setDayIdx(first);
  }, [now]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!now) return <WindowFrame win={win} w={900} h={600}><div className="cal-loading">Loading calendar…</div></WindowFrame>;

  const monday = new Date(weekStart(now) + week * 7 * 86_400_000);
  const todayKey = String(nairobiDay(now));
  const title = monday.toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const free = days.reduce((n, d) => n + d.slots.filter(s => !s.busy && !s.past).length, 0);
  const rows = days[0]?.slots.map(s => s.start) ?? [];

  const request = () => {
    if (!slot) return;
    const body = [
      `Hi ${OWNER.name},`, '',
      `I'd like to book a ${BOOKING.slotMinutes}-minute call.`, '',
      `• When: ${fmtLong(slot.start)} (my time, ${visitorZone()})`,
      `• That's ${fmtNairobi(slot.start)} in Nairobi`,
      `• How: ${method}`,
      name ? `• Name / organisation: ${name}` : '',
      topic ? `• About: ${topic}` : '', '',
      'Thanks!'
    ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
    apps.mail(`Call request: ${fmtNairobi(slot.start)} EAT`, body);
  };

  // Mini month for the sidebar.
  const first = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const weekKeys = new Set(days.map(d => d.key));
  const goToDate = (t: number) => {
    const w = Math.round((weekStart(t) - weekStart(now)) / (7 * 86_400_000));
    if (w >= 0 && w < BOOKING.weeksAhead) { setWeek(w); setSlot(null); setDayIdx(Math.min(4, (new Date(t).getUTCDay() + 6) % 7)); }
  };

  const slotButton = (s: Slot, compact = false) => {
    const on = slot?.start.getTime() === s.start.getTime();
    if (s.past) return <div key={s.start.getTime()} className="cal-slot past" aria-hidden="true" />;
    return s.busy
      ? <div key={s.start.getTime()} className="cal-slot busy" aria-label={`${fmtTime(s.start)} busy`}>{compact ? `${fmtTime(s.start)} · Busy` : 'Busy'}</div>
      : <button key={s.start.getTime()} className={'cal-slot free' + (on ? ' on' : '')} onClick={() => setSlot(s)} aria-pressed={on}>
          {compact ? `${fmtTime(s.start)} · Available` : 'Free'}
        </button>;
  };

  const toolbar = <>
    <button className="btn cal-today" onClick={() => { setWeek(0); setSlot(null); }}>Today</button>
    <div className="cap">
      <button aria-label="Previous week" disabled={week === 0} onClick={() => { setWeek(w => w - 1); setSlot(null); }}><Svg html={SVG.back} /></button>
      <button aria-label="Next week" disabled={week >= BOOKING.weeksAhead - 1} onClick={() => { setWeek(w => w + 1); setSlot(null); }}><Svg html={SVG.fwd} /></button>
    </div>
    <div className="tb-title">{title}</div>
  </>;

  const panel = slot && (
    <aside className="cal-panel" aria-label="Booking details">
      <div className="cal-ev"><i />Call with {OWNER.name}</div>
      <p className="cal-when">{fmtLong(slot.start)}<br /><small>{BOOKING.slotMinutes} minutes · {fmtNairobi(slot.start)} in Nairobi</small></p>
      <div className="cal-methods" role="radiogroup" aria-label="How should David call?">
        {BOOKING.methods.map(m => <button key={m} role="radio" aria-checked={method === m} className={method === m ? 'on' : ''} onClick={() => setMethod(m)}>{m}</button>)}
      </div>
      <label className="cal-field">Your name or organisation<input id="calName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Amina, SomaSawa" /></label>
      <label className="cal-field">What would you like to talk about?<textarea id="calTopic" rows={3} value={topic} onChange={e => setTopic(e.target.value)} placeholder="Our office Wi-Fi keeps dropping…" /></label>
      <button className="btn primary cal-send" onClick={request}>Request this time</button>
      <button className="btn" onClick={() => setSlot(null)}>Pick another time</button>
      <p className="cal-note">David confirms by email, usually within a day.</p>
    </aside>
  );

  return (
    <WindowFrame win={win} w={940} h={620} toolbar={toolbar}>
      <div className="cal">
        {!phone && (
          <nav className="cal-side">
            <button className="cal-create" onClick={() => { const s = days.flatMap(d => d.slots).find(x => !x.busy && !x.past); if (s) setSlot(s); }}>
              <span>+</span> Book a call
            </button>
            <div className="cal-mini" aria-label="Month">
              <div className="cal-mini-title">{title}</div>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <b key={i}>{d}</b>)}
              {Array.from({ length: lead }, (_, i) => <span key={'l' + i} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const t = first.getTime() + i * 86_400_000;
                return <button key={i} onClick={() => goToDate(t)} className={[weekKeys.has(String(t)) && 'wk', String(t) === todayKey && 'today'].filter(Boolean).join(' ')}>{i + 1}</button>;
              })}
            </div>
            <div className="cal-legend">
              <span><i className="free" />Available</span>
              <span><i className="busy" />Busy</span>
            </div>
            <p className="cal-tz">Times shown in your time zone ({visitorZone()}). David works from {BOOKING.zoneLabel}.</p>
          </nav>
        )}

        {phone ? (
          <div className="cal-day">
            <div className="cal-days">
              {days.map((d, i) => (
                <button key={d.key} className={(i === dayIdx ? 'on ' : '') + (d.key === todayKey ? 'today' : '')} onClick={() => { setDayIdx(i); setSlot(null); }}>
                  <small>{d.weekday}</small><b>{d.label}</b>
                </button>
              ))}
            </div>
            <p className="cal-tz">{free} open times this week · shown in your time zone</p>
            <div className="cal-list">
              {days[dayIdx]?.slots.filter(s => !s.past).map(s => slotButton(s, true))}
              {days[dayIdx] && !days[dayIdx].slots.some(s => !s.past) && <p className="cal-tz">No times left on this day. Try another.</p>}
            </div>
          </div>
        ) : (
          <div className="cal-week" style={{ gridTemplateRows: `auto repeat(${rows.length}, minmax(30px, 1fr))` }}>
            <div className="cal-corner">{free} open</div>
            {days.map(d => (
              <div key={d.key} className={'cal-head' + (d.key === todayKey ? ' today' : '')}><small>{d.weekday}</small><b>{d.label}</b></div>
            ))}
            {rows.map((r, ri) => [
              <div key={'t' + ri} className="cal-time">{fmtTime(r)}</div>,
              ...days.map(d => <div key={d.key + ri} className="cal-cell">{slotButton(d.slots[ri])}</div>)
            ])}
          </div>
        )}
        {panel}
      </div>
    </WindowFrame>
  );
}
