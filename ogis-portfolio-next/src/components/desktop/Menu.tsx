'use client';

import { useLayoutEffect, useRef, useState } from 'react';

export type MenuItem = [label: string, kbd: string, run: (() => void) | null] | '-';

export default function Menu({ items, x, y, onClose }: { items: MenuItem[]; x: number; y: number; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(x);
  useLayoutEffect(() => { const w = ref.current?.offsetWidth ?? 0; setLeft(Math.max(8, Math.min(x, window.innerWidth - w - 8))); }, [x]);
  return (
    <div className="menu" role="menu" ref={ref} style={{ left, top: y }}>
      {items.map((it, i) => it === '-' ? <hr key={i} /> : (
        <button key={i} role="menuitem" disabled={!it[2]} onClick={() => { onClose(); it[2]?.(); }}>
          <span>{it[0]}</span>{it[1] && <kbd>{it[1]}</kbd>}
        </button>
      ))}
    </div>
  );
}
