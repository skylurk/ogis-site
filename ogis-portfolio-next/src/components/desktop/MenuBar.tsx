'use client';

import { useEffect, useState } from 'react';
import { PROJECTS, SERVICES } from '@/data/portfolio';
import { BATTERY, NETWORKS, WIFI_HELP } from '@/data/status';
import { SVG } from '@/lib/icons';
import { APP_NAMES, useApps, useDesktop } from './DesktopContext';
import { Svg } from './Icons';
import Menu, { type MenuItem } from './Menu';
import { useClock } from './useClock';

type Key = 'logo' | 'app' | 'projects' | 'services' | 'go' | 'window' | 'help' | 'battery' | 'wifi';
const TOP: [Key, string][] = [['projects', 'Projects'], ['services', 'Services'], ['go', 'Go'], ['window', 'Window'], ['help', 'Help']];

export default function MenuBar() {
  const d = useDesktop(), apps = useApps(), now = useClock();
  const [open, setOpen] = useState<{ key: Key; x: number; y: number } | null>(null);
  const active = d.wins.find(w => w.id === d.activeId);
  const appName = active ? APP_NAMES[active.app] : 'Finder';

  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest('.menu,[data-menu]')) setOpen(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('pointerdown', off);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', esc); };
  }, [open]);

  const menus = (k: Key): MenuItem[] => {
    switch (k) {
      case 'logo': return [['About This Site', '', apps.site], ['System Settings…', '', () => apps.settings()], '-',
        ['Change Wallpaper…', '', () => apps.settings('wallpaper')], ['Spotlight Search', '⌘K', () => d.setSpot(true)], ['Simple View', '', () => { window.location.href = '/simple'; }], '-',
        ['Lock Screen', '⌃⌘Q', () => d.setLocked(true)]];
      case 'battery': return [[BATTERY.title, '', null], ...BATTERY.lines.map(l => [l, '', null] as MenuItem), '-',
        [BATTERY.cta, '', () => apps.calendar('A quick call')]];
      case 'wifi': return [['Wi-Fi', '', null],
        ...NETWORKS.map(n => [`${n.connected ? '✓  ' : ''}${n.name}${n.strength === 1 ? '  (weak)' : ''}`, '',
          () => ('help' in n.action ? apps.helpdesk(n.action.help) : d.toast(n.action.toast))] as MenuItem), '-',
        [WIFI_HELP, '', () => apps.helpdesk('wifi')], ['Network Settings…', '', null]];
      case 'app': return [[`About ${appName}`, '', apps.site], '-', ['Hide Others', '⌥⌘H', null],
        [`Quit ${appName}`, '⌘Q', active ? () => d.wins.filter(w => w.app === active.app).forEach(w => d.close(w.id)) : null]];
      case 'projects': return [...PROJECTS.map(p => [p.name, '', () => apps.project(p)] as MenuItem), '-', ['All Projects', '', () => apps.finder('Projects')]];
      case 'services': return [...SERVICES.map(s => [s.name, '', () => apps.services(s.id)] as MenuItem), '-', ['Request a Service…', '', () => apps.mail('Service enquiry')]];
      case 'go': return [['Services', '', () => apps.finder('Services')], ['Projects', '', () => apps.finder('Projects')], ['Career', '', () => apps.finder('Career')], ['NGO Work', '', () => apps.finder('NGO Work')], '-', ['Help Desk', '', () => apps.helpdesk()], ['Book a Call', '', () => apps.calendar()], ['Quote Calculator', '', apps.quote], ['System Settings', '', () => apps.settings()], ['Résumé', '', apps.resume], ['Terminal', '', apps.terminal]];
      case 'window': return [['Minimize', '⌘M', active ? () => d.setMin(active.id, true) : null], '-',
        ...(d.wins.length ? d.wins.map(w => [w.title, '', () => { d.setMin(w.id, false); d.focus(w.id); }] as MenuItem) : [['No Windows', '', null] as MenuItem])];
      case 'help': return [['Ask the Help Desk', '', () => apps.helpdesk()], ['Book a Call', '', () => apps.calendar()], ['Quote Calculator', '', apps.quote], ['Simple View', '', () => { window.location.href = '/simple'; }], '-', ['How This Site Works', '', apps.site], ['Terminal Commands', '', apps.terminal], ['Contact David', '', () => apps.mail()]];
    }
  };
  const show = (key: Key, el: HTMLElement) => { const r = el.getBoundingClientRect(); setOpen({ key, x: r.left, y: r.bottom + 4 }); };
  const btn = (key: Key, label: React.ReactNode, cls = '') => (
    <button key={key} className={`mb-item ${cls} ${open?.key === key ? 'open' : ''}`} data-menu={key}
      aria-label={typeof label === 'string' ? undefined : ({ logo: 'System menu', battery: 'Battery', wifi: 'Wi-Fi' } as Record<string, string>)[key]}
      onClick={e => (open?.key === key ? setOpen(null) : show(key, e.currentTarget))}
      onMouseEnter={e => { if (open && open.key !== key) show(key, e.currentTarget); }}>{label}</button>
  );

  return (
    <>
      <nav className="menubar">
        {btn('logo', <Svg html={SVG.logo} />, 'mb-logo')}
        {btn('app', appName, 'bold')}
        {TOP.map(([k, l]) => btn(k, l, 'mb-hide'))}
        <span className="mb-spacer" />
        {btn('battery', <Svg html={SVG.battery} />, 'mb-hide')}
        {btn('wifi', <Svg html={SVG.wifi} />, 'mb-hide')}
        <button className="mb-item" aria-label="Spotlight search" onClick={() => d.setSpot(!d.spot)}><Svg html={SVG.search} /></button>
        <span className="mb-item mb-clock">{now && `${now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}  ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}</span>
      </nav>
      {open && <Menu items={menus(open.key)} x={open.x} y={open.y} onClose={() => setOpen(null)} />}
    </>
  );
}
