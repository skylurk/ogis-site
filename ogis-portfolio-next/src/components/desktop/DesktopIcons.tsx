'use client';

import { useEffect, useState } from 'react';
import { DESKTOP_ITEMS } from '@/data/portfolio';
import { isCoarse, useApps } from './DesktopContext';
import { ItemIcon } from './Icons';

export default function DesktopIcons() {
  const apps = useApps();
  const [sel, setSel] = useState<number | null>(null);
  useEffect(() => {
    const off = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest('.dicon')) setSel(null); };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, []);
  return (
    <div className="icons">
      {DESKTOP_ITEMS.map((it, i) => (
        <button key={it.name} className={'dicon' + (sel === i ? ' sel' : '')}
          onClick={() => { setSel(i); if (isCoarse()) apps.openItem(it); }}
          onDoubleClick={() => apps.openItem(it)}
          onKeyDown={e => { if (e.key === 'Enter') apps.openItem(it); }}>
          <div className="img"><ItemIcon it={it} /></div><span>{it.name}</span>
        </button>
      ))}
    </div>
  );
}
