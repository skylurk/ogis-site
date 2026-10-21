import type { ReactNode } from 'react';
import { FolderName, Item, Project, Work } from '@/data/portfolio';
import { folderSVG, GLYPH, GlyphKey, SVG, Tint } from '@/lib/icons';

/** Renders one of the static SVG strings from lib/icons without adding a layout box. */
export function Svg({ html }: { html: string }) {
  return <span className="svgwrap" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function AppIcon({ k, className = '' }: { k: GlyphKey; className?: string }) {
  return <div className={`app-icon ai-${k} ${className}`} dangerouslySetInnerHTML={{ __html: GLYPH[k] }} />;
}

export function ProjIcon({ p }: { p: Project }) {
  return <div className="app-icon" style={{ background: `linear-gradient(150deg,${p.g[0]},${p.g[1]})` }} dangerouslySetInnerHTML={{ __html: GLYPH[p.glyph] }} />;
}

export const initials = (s: string) => s.replace(/&/g, '').split(/\s+/).filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');

export function OrgDot({ w, className = 'orgdot' }: { w: Work; className?: string }) {
  return <span className={className} style={{ background: `linear-gradient(150deg,${w.c[0]},${w.c[1]})` }}>{initials(w.org)}</span>;
}

export const FOLDER_STYLE: Record<Exclude<FolderName, 'Trash'>, [Tint, GlyphKey]> = {
  Services: ['green', 'support'], Projects: ['blue', 'dev'], Career: ['orange', 'career'], 'NGO Work': ['pink', 'ngo']
};

export function FolderIcon({ name }: { name: FolderName }) {
  const [tint, sym]: [Tint, GlyphKey?] = name === 'Trash' ? ['blue'] : FOLDER_STYLE[name];
  return <Svg html={folderSVG(tint, sym)} />;
}

export function ItemIcon({ it }: { it: Item }): ReactNode {
  switch (it.type) {
    case 'folder': return <FolderIcon name={it.name} />;
    case 'project': return <ProjIcon p={it.ref} />;
    case 'service': return <AppIcon k={it.ref.icon} />;
    case 'work': return <Svg html={folderSVG(it.ref.ngo ? 'pink' : it.ref.kind === 'emp' ? 'teal' : 'orange')} />;
    case 'pdf': return <Svg html={SVG.pdf} />;
    case 'file': return <Svg html={SVG.file} />;
    case 'app': return <AppIcon k={it.icon} />;
  }
}
