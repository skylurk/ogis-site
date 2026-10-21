'use client';

import { useEffect, useState } from 'react';
import { OWNER } from '@/data/portfolio';
import { useDesktop, type Win } from '../desktop/DesktopContext';
import WindowFrame from '../desktop/WindowFrame';

export default function Mail({ win }: { win: Win }) {
  const { toast } = useDesktop();
  const [subject, setSubject] = useState(win.props.subject ?? 'Project enquiry');
  const [body, setBody] = useState(win.props.body ?? `Hi ${OWNER.name},\n\n`);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (win.props.subject) setSubject(win.props.subject);
    if (win.props.body) setBody(win.props.body);
  }, [win.nonce, win.props.subject, win.props.body]);
  const href = `mailto:${OWNER.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const copy = () => navigator.clipboard?.writeText(OWNER.email).then(() => setCopied(true), () => toast('Select the address to copy it.'));
  const small = { height: 24, padding: '0 10px', fontSize: 12 };
  return (
    <WindowFrame win={win} w={580} h={470}>
      <form className="mail" onSubmit={e => e.preventDefault()}>
        <div className="row"><label>To:</label><span className="addr">{OWNER.email}</span><button type="button" className="btn" style={small} onClick={copy}>{copied ? 'Copied' : 'Copy'}</button></div>
        <div className="row"><label>Phone:</label><span className="addr">{OWNER.phone}</span><a className="btn" style={small} href={OWNER.whatsapp} target="_blank" rel="noopener">WhatsApp</a></div>
        <div className="row"><label htmlFor="mailSubj">Subject:</label><input id="mailSubj" value={subject} onChange={e => setSubject(e.target.value)} /></div>
        <textarea id="mailBody" aria-label="Message" value={body} onChange={e => setBody(e.target.value)} />
        <div className="foot"><div className="links note">Usually replies within a day</div><a className="btn primary" href={href}>Open in Mail</a></div>
      </form>
    </WindowFrame>
  );
}
