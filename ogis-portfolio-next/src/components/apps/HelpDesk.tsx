'use client';

import { useEffect, useRef, useState } from 'react';
import { HELP, type HelpAction, type HelpOption, matchIntents } from '@/data/helpdesk';
import { OWNER, PROJECTS, WORK } from '@/data/portfolio';
import { SVG } from '@/lib/icons';
import { useApps, type Win } from '../desktop/DesktopContext';
import { Svg } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';

type Msg = { id: number; from: 'bot' | 'me'; text: string };
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A Messages-style chat that answers everyday problems with plain-language replies. */
export default function HelpDesk({ win }: { win: Win }) {
  const apps = useApps();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [node, setNode] = useState('start');
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const seq = useRef(0), timers = useRef<number[]>([]), log = useRef<HTMLDivElement>(null);
  const lastAsk = useRef('');

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, reduced() ? 0 : ms)); };
  const add = (from: Msg['from'], t: string) => setMsgs(m => [...m, { id: seq.current++, from, text: t }]);

  /** Shows the bot's lines one at a time with a typing indicator, then that step's options. */
  const goTo = (id: string) => {
    const n = HELP[id] ?? HELP.unknown;
    setNode(id); setTyping(true);
    let delay = 450;
    n.bot.forEach((line, i) => {
      later(() => { add('bot', line); if (i === n.bot.length - 1) setTyping(false); }, delay);
      delay += Math.min(1500, 500 + line.length * 9);
    });
  };

  const perform = (a: HelpAction) => {
    switch (a.type) {
      case 'mail': return apps.mail(a.subject, lastAsk.current ? `Hi ${OWNER.name},\n\n${lastAsk.current}\n\n` : undefined);
      case 'service': return apps.services(a.id);
      case 'project': { const p = PROJECTS.find(x => x.id === a.id); return p && apps.project(p); }
      case 'career': return apps.career(Math.max(0, WORK.findIndex(w => w.org === a.org)));
      case 'quote': return apps.quote();
      case 'resume': return apps.resume();
    }
  };
  const choose = (o: HelpOption) => {
    add('me', o.label);
    if (o.next) { if (o.next === 'start') lastAsk.current = ''; return goTo(o.next); }
    if (o.action) {
      const where = { mail: 'Opening Mail with a note for David.', service: 'Opening that for you.', project: 'Opening the project.', career: 'Opening Career.', quote: 'Opening the Quote Calculator.', resume: 'Opening his résumé.' }[o.action.type];
      later(() => add('bot', where), 300);
      later(() => perform(o.action!), 650);
    }
  };
  const ask = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    later(() => add('me', t), 0);
    const hit = matchIntents(t)[0];
    if (!hit || (hit.node !== 'hello' && hit.node !== 'thanks')) lastAsk.current = t;
    goTo(hit ? hit.node : 'unknown');
  };

  // Start the conversation, or jump to a topic when opened from Spotlight.
  useEffect(() => {
    if (win.props.ask) { if (!msgs.length) later(() => add('bot', 'Hi! I’m David’s help desk.'), 0); ask(win.props.ask); }
    else if (win.props.node) goTo(win.props.node);
    else if (!msgs.length) goTo('start');
  }, [win.nonce]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduced() ? 'auto' : 'smooth' }); }, [msgs, typing]);

  const options = HELP[node]?.options.length ? HELP[node].options : HELP.start.options;

  return (
    <WindowFrame win={win} w={440} h={600}>
      <div className="hd">
        <div className="hd-head">
          <div className="avatar">{OWNER.initials}</div>
          <b>{OWNER.name} · Help Desk</b>
          <small>Usually replies within a day</small>
        </div>
        <div className="hd-log" ref={log} aria-live="polite">
          {msgs.map((m, i) => (
            <div key={m.id} className={`bub ${m.from}${msgs[i - 1]?.from !== m.from ? ' first' : ''}`}>{m.text}</div>
          ))}
          {typing && <div className="bub bot typing" aria-label="Typing"><i /><i /><i /></div>}
        </div>
        {!typing && (
          <div className="hd-chips">
            {options.map(o => <button key={o.label} className="hd-chip" onClick={() => choose(o)}>{o.label}</button>)}
          </div>
        )}
        <form className="hd-input" onSubmit={e => { e.preventDefault(); ask(text); setText(''); }}>
          <input aria-label="Describe your problem" placeholder="Describe it in your own words…" value={text} onChange={e => setText(e.target.value)} />
          <button type="submit" aria-label="Send" disabled={!text.trim()}><Svg html={SVG.up} /></button>
        </form>
      </div>
    </WindowFrame>
  );
}
