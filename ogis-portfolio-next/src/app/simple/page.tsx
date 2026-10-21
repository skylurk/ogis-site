import type { Metadata } from 'next';
import { CASE_STUDIES } from '@/data/caseStudies';
import { CLIENTS, OWNER, PROJECTS, SERVICES, SKILLS, TRAINING, WORK } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'David · Ogis Creatives (simple view)',
  description: 'Tech support, development and NGO software services by David at Ogis Creatives, Kenya. Services, case studies, experience and contact details on one page.'
};

/** The whole portfolio as one plain, accessible page: no desktop, no animation, just content. */
export default function SimpleView() {
  return (
    <div className="simple">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="s-header">
        <p className="s-eyebrow">{OWNER.studio}</p>
        <h1>{OWNER.name}</h1>
        <p className="s-lede">{OWNER.role}, based in {OWNER.city}. {OWNER.bio}</p>
        <nav aria-label="Sections" className="s-nav">
          <a href="#services">Services</a><a href="#projects">Case studies</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
          <a href="/" className="s-back">Open the desktop version</a>
        </nav>
      </header>

      <main id="main">
        <section id="services" aria-labelledby="h-services">
          <h2 id="h-services">Services</h2>
          {SERVICES.map(s => (
            <article key={s.id} className="s-card">
              <h3>{s.name}</h3>
              <p>{s.tagline}</p>
              <ul>{s.items.map(([t, d]) => <li key={t}><strong>{t}.</strong> {d}</li>)}</ul>
              <p className="s-meta">Done for: {s.orgs.join(', ')}</p>
            </article>
          ))}
        </section>

        <section id="projects" aria-labelledby="h-projects">
          <h2 id="h-projects">Case studies</h2>
          {PROJECTS.map(p => {
            const cs = CASE_STUDIES[p.id];
            return (
              <article key={p.id} className="s-card" aria-labelledby={`p-${p.id}`}>
                <p className="s-eyebrow">{p.kind}{p.status ? ` · ${p.status}` : ''}</p>
                <h3 id={`p-${p.id}`}>{p.name}: {cs?.headline ?? p.kind}</h3>
                {cs ? <>
                  <h4>The problem</h4>{cs.problem.map(t => <p key={t}>{t}</p>)}
                  <h4>What we built</h4>{cs.approach.map(t => <p key={t}>{t}</p>)}
                  <ul>{cs.highlights.map(h => <li key={h}>{h}</li>)}</ul>
                  <blockquote>{cs.principle}</blockquote>
                  <dl className="s-facts">{cs.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                </> : <p>{p.body}</p>}
              </article>
            );
          })}
        </section>

        <section id="experience" aria-labelledby="h-exp">
          <h2 id="h-exp">Experience</h2>
          <ol className="s-timeline">
            {WORK.map(w => (
              <li key={w.org}>
                <h3>{w.role}, {w.org}</h3>
                <p className="s-meta">{w.years} · {w.kind === 'emp' ? 'Employment' : 'Consultancy'}{w.ngo ? ' · Non-profit' : ''}</p>
                <p>{w.body}</p>
              </li>
            ))}
          </ol>
          <h3>Also worked with</h3>
          <p>{CLIENTS.join(', ')}</p>
          <h3>Training</h3>
          <ul>{TRAINING.map(([y, t, s]) => <li key={t}>{y}: {t}, {s}</li>)}</ul>
          <h3>Skills</h3>
          <dl className="s-facts">{SKILLS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <h3>Languages</h3>
          <p>{OWNER.languages.join(', ')}</p>
        </section>

        <section id="contact" aria-labelledby="h-contact" className="s-contact">
          <h2 id="h-contact">Contact</h2>
          <p>David usually replies within a day.</p>
          <ul>
            <li>Email: <a href={`mailto:${OWNER.email}`}>{OWNER.email}</a></li>
            <li>Phone: <a href={`tel:${OWNER.phone.replace(/\s/g, '')}`}>{OWNER.phone}</a></li>
            <li>WhatsApp: <a href={OWNER.whatsapp}>{OWNER.phone}</a></li>
          </ul>
        </section>
      </main>

      <footer className="s-footer"><a href="/">Back to the desktop version</a></footer>
    </div>
  );
}
