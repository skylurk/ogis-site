'use client';

import { useEffect, useRef } from 'react';
import { OWNER } from '@/data/portfolio';
import { useClock } from './useClock';
import { usePhone } from './usePhone';

export default function LockScreen({ locked, onUnlock }: { locked: boolean; onUnlock: () => void }) {
  const now = useClock();
  const phone = usePhone();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (locked) setTimeout(() => ref.current?.focus(), 50); }, [locked]);
  return (
    <div ref={ref} className={'lock' + (locked ? '' : ' gone')} role="button" tabIndex={0} aria-label="Unlock" onClick={onUnlock}>
      <div className="ldate">{now?.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <div className="ltime">{now?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, '')}</div>
      <div className="who">
        <div className="avatar">{OWNER.initials}</div>
        <div className="name">{OWNER.name} · {OWNER.studio}</div>
        <div className="hint">{phone ? 'Tap to open' : 'Tech support · Development · NGO software · Click to enter'}</div>
        <a className="lock-simple" href="/simple" onClick={e => e.stopPropagation()}>Prefer a simple page? Open the simple view</a>
      </div>
    </div>
  );
}
