// The Help Desk conversation and the everyday phrases visitors use to describe problems.
// Edit the wording here; the Help Desk window and Spotlight both read from this file.
import type { ServiceId } from './portfolio';

export type HelpAction =
  | { type: 'mail'; subject: string }
  | { type: 'service'; id: ServiceId }
  | { type: 'project'; id: string }
  | { type: 'career'; org: string }
  | { type: 'quote' }
  | { type: 'resume' };

export type HelpOption = { label: string; next?: string; action?: HelpAction };
export type HelpNode = { bot: string[]; options: HelpOption[] };

const START_OVER: HelpOption = { label: 'Something else', next: 'start' };

export const HELP: Record<string, HelpNode> = {
  start: {
    bot: ['Hi! I’m David’s help desk.', 'What’s going on? Pick one, or just type it in your own words.'],
    options: [
      { label: 'My computer is slow or broken', next: 'computer' },
      { label: 'Our email or Wi-Fi isn’t working', next: 'network' },
      { label: 'I need a website or app', next: 'build' },
      { label: 'We’re an NGO', next: 'ngo' },
      { label: 'How much does it cost?', next: 'cost' },
      { label: 'Just looking around', next: 'browse' }
    ]
  },
  computer: {
    bot: ['Annoying, but usually fixable.', 'David repairs hardware and software and recovers lost files. A lot of it can be done remotely, so he may not even need to visit.'],
    options: [
      { label: 'Can he fix it remotely?', next: 'remote' },
      { label: 'I lost important files', next: 'recovery' },
      { label: 'Tell David about it', action: { type: 'mail', subject: 'Computer problem' } },
      START_OVER
    ]
  },
  remote: {
    bot: ['Often, yes. With your permission, David connects to your computer over the internet and fixes it while you watch.', 'If something needs replacing, he tells you what and why before anything is bought.'],
    options: [{ label: 'Ask for remote help', action: { type: 'mail', subject: 'Remote support request' } }, { label: 'See Tech Support', action: { type: 'service', id: 'support' } }, START_OVER]
  },
  recovery: {
    bot: ['First: stop using that drive if you can. Every new file makes recovery harder.', 'Then tell David what happened and when. Data recovery is one of his specialities.'],
    options: [{ label: 'Tell David what happened', action: { type: 'mail', subject: 'Data recovery' } }, START_OVER]
  },
  network: {
    bot: ['Email and Wi-Fi problems tend to stop a whole office at once. David sets up and fixes both.', 'Which one is it?'],
    options: [{ label: 'Email', next: 'email' }, { label: 'Wi-Fi or internet', next: 'wifi' }, START_OVER]
  },
  email: {
    bot: ['David sets up Google Workspace and Microsoft 365, moves your old mail across, and gets everyone signed in properly.', 'He’s done this for Afrigroup Kenya, Africaworks and Helping Hand for Relief & Development.'],
    options: [{ label: 'Get help with email', action: { type: 'mail', subject: 'Email set-up' } }, { label: 'See Tech Support', action: { type: 'service', id: 'support' } }, START_OVER]
  },
  wifi: {
    bot: ['Weak signal in some rooms? Drops every afternoon? It’s usually router placement, old equipment or too many devices on one network.', 'David can check your setup and plan a fix that fits your budget.'],
    options: [{ label: 'Get help with Wi-Fi', action: { type: 'mail', subject: 'Wi-Fi problems' } }, START_OVER]
  },
  build: {
    bot: ['Nice. What are you thinking of?'],
    options: [{ label: 'A website', next: 'website' }, { label: 'A mobile app', next: 'app' }, { label: 'A tool for our team', next: 'tool' }, START_OVER]
  },
  website: {
    bot: ['David designs and builds websites that are easy for you to update, and makes sure people can find them on Google.', 'He looks after SomaSawa’s website and built the NRG Radio stations’ sites.'],
    options: [{ label: 'Estimate the size', action: { type: 'quote' } }, { label: 'Start a website', action: { type: 'mail', subject: 'New website' } }, START_OVER]
  },
  app: {
    bot: ['David builds apps for Android and iPhone.', 'Flight Bag, for example, shows where flight crews are and collects data in the field.'],
    options: [{ label: 'See Flight Bag', action: { type: 'project', id: 'flightbag' } }, { label: 'Estimate the size', action: { type: 'quote' } }, { label: 'Start an app', action: { type: 'mail', subject: 'New app' } }, START_OVER]
  },
  tool: {
    bot: ['Spreadsheets getting out of hand? David builds tools for teams: visitor check-in, reporting, payments, databases.'],
    options: [{ label: 'See Ingia (visitor check-in)', action: { type: 'project', id: 'ingia' } }, { label: 'Estimate the size', action: { type: 'quote' } }, { label: 'Describe what you need', action: { type: 'mail', subject: 'A tool for our team' } }, START_OVER]
  },
  ngo: {
    bot: ['Then you’re in the right place. A good part of David’s work is for non-profits.', 'He plans around grant budgets, sets up tools field teams can actually use, and supports country offices remotely.'],
    options: [{ label: 'What NGO services include', action: { type: 'service', id: 'ngo' } }, { label: 'Who he’s worked with', action: { type: 'career', org: 'Helping Hand for Relief & Development' } }, { label: 'Talk to David', action: { type: 'mail', subject: 'NGO enquiry' } }, START_OVER]
  },
  cost: {
    bot: ['Honest answer: it depends on the job.', 'The Quote Calculator sizes it up in under a minute, and NGO budgets are always welcome.'],
    options: [{ label: 'Open the Quote Calculator', action: { type: 'quote' } }, { label: 'Ask for a quote', action: { type: 'mail', subject: 'Quote request' } }, START_OVER]
  },
  browse: {
    bot: ['Enjoy! A few good places to start:', 'Tip: press ⌘K (or Ctrl+K) anywhere and type what you need, in plain words.'],
    options: [{ label: 'See Flight Bag', action: { type: 'project', id: 'flightbag' } }, { label: 'What David offers', action: { type: 'service', id: 'dev' } }, { label: 'His résumé', action: { type: 'resume' } }, START_OVER]
  },
  unknown: {
    bot: ['I’m not sure I understood that one, but David will.', 'Want to send it to him?'],
    options: [{ label: 'Send it to David', action: { type: 'mail', subject: 'Question from the website' } }, START_OVER]
  },
  hello: {
    bot: ['Hello! 👋 What can David help with today?'],
    options: []
  },
  thanks: {
    bot: ['You’re welcome! Anything else?'],
    options: []
  }
};

/** Everyday words mapped to a Help Desk answer. Used by the Help Desk text box and by Spotlight. */
export type Intent = { node: string; label: string; sub: string; words: string[] };
export const INTENTS: Intent[] = [
  { node: 'recovery', label: 'Recover lost or deleted files', sub: 'Tech Support', words: ['lost', 'deleted', 'recover', 'recovery', 'backup', 'files', 'photos', 'data', 'corrupt'] },
  { node: 'computer', label: 'Fix a slow or broken computer', sub: 'Tech Support', words: ['slow', 'broken', 'laptop', 'computer', 'pc', 'mac', 'virus', 'crash', 'freeze', 'frozen', 'repair', 'fix', 'screen', 'printer', 'keyboard', 'wont start', 'won’t start'] },
  { node: 'remote', label: 'Get help remotely', sub: 'Tech Support', words: ['remote', 'remotely', 'anydesk', 'teamviewer', 'online help'] },
  { node: 'email', label: 'Sort out our email', sub: 'Tech Support', words: ['email', 'gmail', 'outlook', 'office 365', 'microsoft 365', 'google workspace', 'inbox', 'spam'] },
  { node: 'wifi', label: 'Fix Wi-Fi or internet', sub: 'Tech Support', words: ['wifi', 'wi-fi', 'internet', 'network', 'router', 'connection', 'signal', 'lan'] },
  { node: 'website', label: 'Get a website', sub: 'Development', words: ['website', 'site', 'web', 'seo', 'wordpress', 'domain', 'landing page', 'blog', 'online shop', 'ecommerce'] },
  { node: 'app', label: 'Build a mobile app', sub: 'Development', words: ['app', 'android', 'iphone', 'ios', 'mobile', 'play store', 'app store'] },
  { node: 'tool', label: 'A system or tool for our team', sub: 'Development', words: ['tool', 'system', 'database', 'spreadsheet', 'excel', 'crm', 'payments', 'mpesa', 'm-pesa', 'visitor', 'inventory', 'reporting', 'dashboard', 'automate'] },
  { node: 'ngo', label: 'Technology for our NGO', sub: 'NGO Software Services', words: ['ngo', 'charity', 'non-profit', 'nonprofit', 'donor', 'donors', 'grant', 'foundation', 'relief', 'beneficiaries', 'field team'] },
  { node: 'cost', label: 'How much will it cost?', sub: 'Quotes', words: ['price', 'cost', 'how much', 'quote', 'budget', 'rates', 'pay', 'cheap', 'afford', 'estimate'] },
  { node: 'hello', label: 'Say hello', sub: 'Help Desk', words: ['hi', 'hello', 'hey', 'jambo', 'habari', 'mambo'] },
  { node: 'thanks', label: 'Say thanks', sub: 'Help Desk', words: ['thanks', 'thank you', 'asante'] }
];

/** Finds the intents a sentence is about, best match first. Matches whole words and phrases. */
export function matchIntents(text: string): Intent[] {
  const t = ' ' + text.toLowerCase().replace(/[^\p{L}\p{N}\s'’-]/gu, ' ').replace(/\s+/g, ' ') + ' ';
  return INTENTS
    .map(i => ({ i, score: i.words.reduce((n, w) => n + (t.includes(' ' + w + ' ') || (w.length > 4 && t.includes(' ' + w)) ? w.length : 0), 0) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.i);
}

/* ---------- Quote Calculator ---------- */
export type QuoteService = 'support' | 'website' | 'app' | 'tool';
export const QUOTE_SERVICES: [QuoteService, string][] = [['support', 'Support'], ['website', 'Website'], ['app', 'App'], ['tool', 'Tool']];
export const QUOTE_TEAMS = ['1–10', '10–50', '50+'];
export const QUOTE_WHEN = ['Any time', 'This month', 'This week'];
/** Typical timelines by service and size (small, medium, large). */
export const QUOTE_TIMELINE: Record<QuoteService, [string, string, string]> = {
  support: ['1–3 days', '1–2 weeks', 'Ongoing support plan'],
  website: ['1–2 weeks', '3–5 weeks', '6+ weeks'],
  app: ['4–6 weeks', '2–3 months', '3+ months'],
  tool: ['2–3 weeks', '1–2 months', '2+ months']
};
const BASE: Record<QuoteService, number> = { support: 0, website: 1, app: 2, tool: 1 };
export function quoteSize(service: QuoteService, team: number): 0 | 1 | 2 {
  const score = BASE[service] + team;
  return score <= 1 ? 0 : score <= 2 ? 1 : 2;
}
export const SIZE_NAMES = ['Small', 'Medium', 'Large'];
