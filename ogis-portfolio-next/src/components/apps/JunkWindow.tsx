'use client';

import { TRASH } from '@/data/trash';
import { JUNK_ICONS } from '@/lib/icons';
import { useApps, type Win } from '../desktop/DesktopContext';
import { Svg } from '../desktop/Icons';
import WindowFrame from '../desktop/WindowFrame';

/** A Quick Look-style card for a file in the Trash: what David found, and what replaced it. */
export default function JunkWindow({ win }: { win: Win }) {
  const apps = useApps();
  const j = TRASH.find(t => t.name === win.props.junk);
  if (!j) return null;
  return (
    <WindowFrame win={win} w={420} h={430}>
      <div className="junk">
        <div className="junk-icon"><Svg html={JUNK_ICONS[j.icon]} /></div>
        <h2>{j.name}</h2>
        <p className="junk-where">Kind: Bad idea · Where from: a client’s office</p>
        <dl>
          <dt>Found</dt><dd>{j.found}</dd>
          <dt className="fixed">Replaced with</dt><dd>{j.fix}</dd>
        </dl>
        <div className="btnrow">
          <button className="btn primary" onClick={() => apps.calendar('Tidying up our IT')}>Got one of these? Book a call</button>
          <button className="btn" onClick={() => apps.finder('Trash')}>Back to Trash</button>
        </div>
      </div>
    </WindowFrame>
  );
}
