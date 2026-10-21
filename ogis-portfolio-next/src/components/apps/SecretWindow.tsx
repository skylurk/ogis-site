'use client';

import { useEffect, useRef, useState } from 'react';
import { SECRET } from '@/data/secret';
import { JUNK_ICONS } from '@/lib/icons';
import { useApps, useDesktop, type Win } from '../desktop/DesktopContext';
import { Svg } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';

type Phase = 'locked' | 'cracking' | 'busted';

/** The "Homework" folder: a fake lock, then a gentle lesson in curiosity and IT security. */
export default function SecretWindow({ win }: { win: Win }) {
  const apps = useApps();
  const { close } = useDesktop();
  const [phase, setPhase] = useState<Phase>('locked');
  const timer = useRef<number>(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  // Opening it again from the desktop shows the lock again, for anyone who missed the joke.
  useEffect(() => { setPhase('locked'); }, [win.nonce]);

  const tryOpen = () => {
    setPhase('cracking');
    timer.current = window.setTimeout(() => setPhase('busted'), 1800);
  };

  return (
    <WindowFrame win={win} w={460} h={590}>
      {phase !== 'busted' ? (
        <div className={'secret-lock' + (phase === 'cracking' ? ' cracking' : '')}>
          <div className="secret-padlock" aria-hidden="true">
            <svg viewBox="0 0 64 64"><path d="M20 28v-8a12 12 0 0 1 24 0v8" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="shackle" /><rect x="14" y="28" width="36" height="28" rx="7" fill="currentColor" /><circle cx="32" cy="42" r="4" fill="var(--win-solid)" /></svg>
          </div>
          <h2>{SECRET.lockedTitle}</h2>
          <p className="secret-hint">{phase === 'cracking' ? SECRET.wrong : SECRET.hint}</p>
          {phase === 'locked' && (
            <div className="btnrow">
              <button className="btn" onClick={() => close(win.id)}>Cancel</button>
              <button className="btn primary" onClick={tryOpen} autoFocus>Guess the password</button>
            </div>
          )}
        </div>
      ) : (
        <div className="secret-reveal">
          <p className="secret-busted">{SECRET.busted} <span aria-hidden="true">👀</span></p>
          <p className="secret-lede">{SECRET.lede}</p>
          <h3>{SECRET.insideTitle}</h3>
          <ul className="secret-files">
            {SECRET.files.map(f => <li key={f.name}><Svg html={JUNK_ICONS[f.icon]} /><span>{f.name}</span></li>)}
          </ul>
          <p className="secret-pitch">{SECRET.pitch}</p>
          <div className="btnrow">
            <button className="btn primary" onClick={() => apps.services('support')}>Protect my team</button>
            <button className="btn" onClick={() => apps.calendar('Security for our team')}>Book a call</button>
          </div>
        </div>
      )}
    </WindowFrame>
  );
}
