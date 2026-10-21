'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { SVG } from '@/lib/icons';
import { isPhone, useDesktop, type Win } from './DesktopContext';
import { Svg } from './Icons';
import { takeLaunchOrigin, usePhone } from './usePhone';

type Rect = { left: number; top: number; width: number; height: number };
let cascade = 0;

function initialRect(w: number, h: number): Rect {
  const vw = window.innerWidth, vh = window.innerHeight;
  const width = Math.min(w, vw - 24), height = Math.min(h, vh - 140);
  const off = (cascade++ % 7) * 26;
  return { width, height, left: Math.max(12, Math.round((vw - width) / 2 - 70 + off)), top: Math.max(38, Math.round((vh - height) / 2 - 50 + off)) };
}

type Props = { win: Win; w: number; h: number; toolbar?: ReactNode; className?: string; children: ReactNode };

export default function WindowFrame({ win, w, h, toolbar, className = '', children }: Props) {
  const { activeId, focus, close, setMin } = useDesktop();
  const [rect, setRect] = useState<Rect>(() => initialRect(w, h));
  const [opening, setOpening] = useState(true);
  const [closing, setClosing] = useState(false);
  const [anim, setAnim] = useState(false);
  const [minStyle, setMinStyle] = useState<CSSProperties | null>(null);
  const saved = useRef<Rect | null>(null);
  const el = useRef<HTMLElement>(null);
  const phone = usePhone();
  const [origin, setOrigin] = useState(() => takeLaunchOrigin());
  const [leaving, setLeaving] = useState(false);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setOpening(false)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);

  // On phones, grow out of the tapped icon again whenever the app comes back to the front.
  useEffect(() => {
    if (!phone || win.min) return;
    const o = takeLaunchOrigin();
    if (o) setOrigin(o);
    setOpening(true);
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setOpening(false)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [phone, win.min, win.nonce]);

  // Fly to the Dock when minimized; come back when restored.
  useEffect(() => {
    if (phone) return;
    if (!win.min) { setMinStyle(null); return; }
    const target = document.querySelector(`.dock-item[data-app="${win.app}"]`)?.getBoundingClientRect();
    const r = el.current!.getBoundingClientRect();
    const dx = target ? target.left + target.width / 2 - (r.left + r.width / 2) : 0;
    const dy = target ? target.top - r.top - r.height / 2 : window.innerHeight;
    setMinStyle({ transform: `translate(${dx}px, ${dy}px) scale(.08)`, opacity: 0 });
    const t = setTimeout(() => setMinStyle(s => s && { ...s, visibility: 'hidden' }), 300);
    return () => clearTimeout(t);
  }, [win.min, win.app, phone]);

  const doClose = () => { setClosing(true); setTimeout(() => close(win.id), 200); };
  const doZoom = () => {
    if (isPhone()) return;
    setAnim(true);
    if (saved.current) { setRect(saved.current); saved.current = null; }
    else { saved.current = rect; setRect({ left: 8, top: 36, width: window.innerWidth - 16, height: window.innerHeight - 36 - 98 }); }
    setTimeout(() => setAnim(false), 320);
  };

  const drag = (e: RPointerEvent<HTMLElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button,input,a,.cap,.search') || isPhone()) return;
    const bar = e.currentTarget, sx = e.clientX, sy = e.clientY, { left, top, width } = rect;
    bar.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => setRect(r => ({ ...r,
      left: Math.min(window.innerWidth - 80, Math.max(80 - width, left + ev.clientX - sx)),
      top: Math.min(window.innerHeight - 60, Math.max(32, top + ev.clientY - sy)) }));
    const up = () => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); };
    bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up);
  };
  const resize = (e: RPointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const h = e.currentTarget, sx = e.clientX, sy = e.clientY, { width, height } = rect;
    h.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => setRect(r => ({ ...r, width: Math.max(320, width + ev.clientX - sx), height: Math.max(200, height + ev.clientY - sy) }));
    const up = () => { h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); };
    h.addEventListener('pointermove', move); h.addEventListener('pointerup', up);
  };

  if (phone) {
    // iPhone layout: a full-screen app with a Home button and a home indicator to swipe up on.
    const goHome = () => { setLeaving(true); setDragY(0); setTimeout(() => { setLeaving(false); setMin(win.id, true); }, 260); };
    const swipe = (e: RPointerEvent<HTMLButtonElement>) => {
      const bar = e.currentTarget, sy = e.clientY;
      bar.setPointerCapture(e.pointerId);
      let dy = 0;
      const move = (ev: PointerEvent) => { dy = Math.min(0, ev.clientY - sy); setDragY(dy); };
      const up = () => {
        bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up);
        if (dy < -50 || Math.abs(dy) < 4) goHome(); else setDragY(0);
      };
      bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up);
    };
    const pcls = ['ios-app', className, (opening || leaving) && 'shrunk'].filter(Boolean).join(' ');
    const lift = dragY ? { transform: `translateY(${dragY}px) scale(${Math.max(.8, 1 + dragY / 900)})`, borderRadius: 32, transition: 'none' } : {};
    return (
      <section ref={el} className={pcls} aria-label={win.title} hidden={win.min}
        style={{ zIndex: win.z, transformOrigin: origin ? `${origin.x}px ${origin.y}px` : '50% 100%', ...lift }}>
        <header className="ios-nav">
          <button className="ios-back" onClick={goHome} aria-label="Back to Home"><Svg html={SVG.back} />Home</button>
          {toolbar ? <div className="tb">{toolbar}</div> : <div className="ios-title">{win.title}</div>}
        </header>
        <div className="ios-body">{children}</div>
        <button className="ios-home-ind" aria-label="Swipe up to go Home" onPointerDown={swipe} />
      </section>
    );
  }

  const cls = ['win', className, opening && 'opening', closing && 'closing', anim && 'anim', activeId !== win.id && 'inactive'].filter(Boolean).join(' ');
  return (
    <section ref={el} className={cls} aria-label={win.title} onPointerDownCapture={() => focus(win.id)}
      style={{ ...rect, zIndex: win.z, ...(minStyle ?? {}) }}>
      <header className="titlebar" onPointerDown={drag} onDoubleClick={e => { if (!(e.target as HTMLElement).closest('button,input')) doZoom(); }}>
        <div className="lights">
          <button className="c" aria-label="Close" onClick={doClose}>×</button>
          <button className="m" aria-label="Minimize" onClick={() => setMin(win.id, true)}>−</button>
          <button className="x" aria-label="Zoom" onClick={doZoom}>+</button>
        </div>
        {toolbar ? <div className="tb">{toolbar}</div> : <div className="win-title">{win.title}</div>}
      </header>
      <div className="win-body">{children}</div>
      <div className="rs" onPointerDown={resize} />
    </section>
  );
}
