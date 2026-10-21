// Everything a visitor reads lives here. Edit this file to update the site.
import type { GlyphKey } from '@/lib/icons';
import { type Junk, TRASH } from './trash';

export type ServiceId = 'support' | 'dev' | 'ngo';
export type Service = { id: ServiceId; name: string; icon: GlyphKey; tagline: string; items: [string, string][]; orgs: string[] };
export type Work = { org: string; role: string; years: string; from: number; kind: 'emp' | 'con'; ngo?: boolean; c: [string, string]; body: string; hl: string[] };
export type VizKind = 'map' | 'geo' | 'term' | 'db' | 'qr' | 'road';
export type Project = { id: string; name: string; glyph: GlyphKey; kind: string; status?: string; g: [string, string]; viz: VizKind; body: string; tags: string[] };

export const OWNER = {
  name: 'David',
  studio: 'Ogis Creatives',
  initials: 'D',
  role: 'Software developer, UI/UX designer & tech support',
  city: 'Kenya',
  email: 'david@ogiscreatives.com',
  phone: '+254 700 350 655',
  whatsapp: 'https://wa.me/254700350655',
  languages: ['English', 'Kiswahili', 'Dholuo'],
  bio: 'I build websites, apps and internal tools, design the interfaces people use them through, and keep the systems underneath running. Years of hands-on tech support mean I fix the hardware and software problems that get in the way, too. I work with companies and with NGOs.',
  specs: [
    ['Services', 'Tech support · Development · NGO software'],
    ['Experience', 'Since 2018, across 9 organisations'],
    ['Languages', 'English, Kiswahili, Dholuo'],
    ['Based in', 'Kenya · remote support anywhere']
  ] as [string, string][]
};

export const SERVICES: Service[] = [
  { id: 'support', name: 'Tech Support', icon: 'support', tagline: 'Keep your people working and your systems running, on site or remotely.',
    items: [['Desktop & remote user support', 'Windows, macOS, printers, phones'], ['Hardware & software repair', 'Troubleshooting, upgrades, data recovery'], ['Email management', 'Google Workspace, Microsoft 365, migrations'], ['Servers & networking', 'Set-up, administration, Wi-Fi and LAN'], ['Cloud infrastructure', 'Accounts, backups, access control'], ['Data security & system audits', 'Find weak spots before they cost you'], ['IT budgeting & procurement', 'Buy the right kit once']],
    orgs: ['Afrigroup Kenya Limited', 'Haussmann Group Africa', 'Africaworks', 'Helping Hand for Relief & Development'] },
  { id: 'dev', name: 'Development Services', icon: 'dev', tagline: 'Websites, apps and internal tools, designed and built end to end.',
    items: [['Websites & web apps', 'React, PHP, WordPress, Wix, Framer'], ['Mobile apps', 'Flutter, Swift & SwiftUI, Kotlin'], ['Desktop apps', 'Windows and macOS'], ['UI/UX design', 'Figma prototypes, brand guidelines'], ['Payment gateways & integrations', 'Connect the tools you already use'], ['Databases & back ends', 'Node.js, Flask, MongoDB, Firebase, Supabase'], ['SaaS research & rollout', 'Pick, set up and train']],
    orgs: ['NRG Radio Group', 'Kasas Kenya', 'Acuvera Systems Limited', 'Rafiki Africa'] },
  { id: 'ngo', name: 'NGO Software Services', icon: 'ngo', tagline: 'Technology for organisations doing good, sized for NGO budgets and field realities.',
    items: [['Websites that people find', 'Easy to update, with SEO built in'], ['Field data collection apps', 'Android & iOS with GPS and offline capture'], ['CRM & reporting tools', 'Track programmes, donors and beneficiaries'], ['Email & workspace set-up', 'Google Workspace or Microsoft 365 for teams'], ['IT budgeting & procurement', 'Plans that fit a grant line'], ['Brand & social media design', 'From logo to campaign graphics'], ['Remote support for country teams', 'One contact for every office']],
    orgs: ['Helping Hand for Relief & Development', 'SomaSawa'] }
];

export const WORK: Work[] = [
  { org: 'NRG Radio Group', role: 'Software Developer', years: '2022 – Present', from: 2022, kind: 'emp', c: ['#ff6b5a', '#c3283d'],
    body: "Developing and maintaining the websites for the group's radio stations, designing and building applications for the company, and keeping its infrastructure running smoothly.", hl: ['Station websites', 'Company applications', 'Infrastructure'] },
  { org: 'Acuvera Systems Limited', role: 'Senior Software Developer', years: '2019 – Present', from: 2019, kind: 'con', c: ['#5b8cff', '#2c3fb8'],
    body: "Designing, building and maintaining the company's products, including learning management systems, visitor management systems and e-commerce platforms.", hl: ['LMS', 'Visitor management', 'E-commerce'] },
  { org: 'Africaworks', role: 'ICT Officer', years: '2022 – Present', from: 2022, kind: 'con', c: ['#ffb547', '#d9741c'],
    body: 'Daily tech operations: researching and rolling out software, building payment gateways, integrating management and operations software, email management and desktop support.', hl: ['Payment gateways', 'Software integration', 'Desktop support'] },
  { org: 'Helping Hand for Relief & Development', role: 'Tech Support', years: '2019 – Present', from: 2019, kind: 'con', ngo: true, c: ['#ff8fb0', '#c92f62'],
    body: 'Tech lead for the East African branch: email management, desktop support, IT budgeting and acquisition, server administration, networking and integrations.', hl: ['Server administration', 'Networking', 'IT budgeting'] },
  { org: 'SomaSawa', role: 'Website Developer', years: '2021 – Present', from: 2021, kind: 'con', ngo: true, c: ['#7fdc9b', '#23935a'],
    body: "Designing and maintaining the NGO's website, running its search engine optimisation and keeping the site running smoothly.", hl: ['Web design', 'SEO', 'Maintenance'] },
  { org: 'Kasas Kenya', role: 'Software Developer', years: '2019 – 2022', from: 2019, kind: 'emp', c: ['#48c6ef', '#1a6fb3'],
    body: 'Designed and built a range of software products, including an aircraft and crew management system, and maintained the existing applications. Also researched and rolled out SaaS tools.', hl: ['Aircraft & crew management', 'SaaS rollout', 'App maintenance'] },
  { org: 'Haussmann Group Africa', role: 'Technical Support Officer', years: '2019', from: 2019, kind: 'emp', c: ['#a58bff', '#5a3cc9'],
    body: "Kept the organisation's processes running: user support, SaaS research and rollout, and building tools for reporting, quantity surveying and project management. Also oversaw accounting and admin integrations.", hl: ['User support', 'Reporting tools', 'Accounting integrations'] },
  { org: 'Afrigroup Kenya Limited', role: 'IT Associate', years: '2018 – 2019', from: 2018, kind: 'emp', c: ['#6fd3c4', '#16847a'],
    body: 'Technical support for the team, responsible for hardware, software and cloud infrastructure: desktop support, email management, data security and more.', hl: ['Desktop support', 'Email', 'Data security'] },
  { org: 'Rafiki Africa', role: 'Software Developer & Designer', years: '2018 – 2019', from: 2018, kind: 'con', c: ['#ffd25e', '#e09a12'],
    body: "Kept the organisation's online presence strong and visible on search engines. Project lead for the design and development of its own mobile app, and designer of everything from the logo and brand guidelines to social media material.", hl: ['Mobile app lead', 'Brand guidelines', 'SEO'] }
];

export const CLIENTS = ['Blue Ocean Safaris', 'Soin Insurance Brokers', 'Kivu Aviation Limited'];

export const TRAINING: [string, string, string][] = [
  ['2016', 'ICT Management', 'Institute of Advanced Technology'],
  ['2019', 'Fundamentals of Digital Marketing', 'Google for Africa']
];

export const SKILLS: [string, string][] = [
  ['Languages', 'C/C++, Python, Dart, JavaScript, PHP, HTML/CSS, Kotlin, Swift'],
  ['Frameworks', 'React, Flutter, SwiftUI, Flask'],
  ['Design', 'Figma, Adobe Suite, Framer, WordPress, Wix, Weebly, Joomla'],
  ['CAD & 3D', 'AutoCAD, ArchiCAD, 3ds Max, Blender'],
  ['Systems', 'Server administration, networking, cloud, database administration, data recovery, system auditing'],
  ['Support', 'Remote user support, email management, CRM management, Windows & Google scripting'],
  ['Productivity', 'Microsoft Office, LibreOffice, Asana, Trello, Jira, Monday']
];

export const PROJECTS: Project[] = [
  { id: 'flightbag', name: 'Flight Bag', glyph: 'plane', kind: 'Aviation operations · web console + Android & iOS', g: ['#4fc3f7', '#1452a8'], viz: 'map',
    body: 'A flight management app that streamlines day-to-day processes for aviation companies. Location features show where each flight crew is. Crews collect data on the mobile app, and the operations team reviews it in a web console.',
    tags: ['React', 'Flutter', 'Firebase', 'Node.js', 'ArcGIS', 'GeoJSON', 'Bootstrap'] },
  { id: 'ingia', name: 'Ingia', glyph: 'pin', kind: 'Visitor management system', g: ['#7ee0a1', '#1d8f58'], viz: 'geo',
    body: 'Secure check-in and check-out for visitors. Geofencing is accurate to a 20-metre radius, so people can only sign in when they are actually at the gate.',
    tags: ['AngularJS', 'Node.js', 'Express', 'MongoDB', 'GeoJSON'] },
  { id: 'ccartings', name: 'C-Cartings', glyph: 'car', kind: 'Vehicle diagnostics · Windows & macOS', g: ['#9fb3c8', '#2b4466'], viz: 'term',
    body: 'A desktop diagnostics app for the BMW 3 Series (E90–E93), talking to the car through a K+DCAN USB cable. It scans all 16 control units, reads and clears fault codes (saving a report first), shows live data and includes a simulator mode for working without the car.',
    tags: ['C# / .NET', 'Desktop', 'K+DCAN', 'Diagnostics'] },
  { id: 'ogisdb', name: 'Ogis DB Studio', glyph: 'db', kind: 'Desktop database workspace', g: ['#ffb36b', '#e0532c'], viz: 'db',
    body: 'A desktop workspace for browsing and editing Firebase databases, with a project tree, draggable tabs, resizable columns and a document details pane. Sign-in uses your own Google OAuth client, so credentials never pass through the interface.',
    tags: ['Electron', 'React', 'TypeScript', 'Vite', 'Tailwind', 'Firebase'] },
  { id: 'qr', name: 'Fogedit QR', glyph: 'qr', kind: 'Free QR code generator', g: ['#3a3f4b', '#111318'], viz: 'qr',
    body: 'A free, permanent QR code generator. The link is encoded directly into the code: no redirect, no short link, no expiry. Everything runs in the browser, with no accounts or tracking, and logos never leave your device.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'SEO'] },
  { id: 'aviation', name: 'Fogedit Aviation', glyph: 'prop', kind: 'Aviation maintenance & operations platform', status: 'In development', g: ['#9b8cff', '#3a2a8a'], viz: 'road',
    body: 'A multi-company platform for aviation maintenance and operations, built around clear workflows, traceable records and permission-controlled AI assistance. It brings together inventory, requisitions, purchase orders and airworthiness records.',
    tags: ['Next.js', 'NestJS', 'Supabase', 'Tailwind', 'shadcn/ui'] }
];

/* ---------- Finder folders ---------- */
export type FolderName = 'Services' | 'Projects' | 'Career' | 'NGO Work' | 'Trash';
export type Item =
  | { type: 'folder'; name: FolderName }
  | { type: 'service'; name: string; ref: Service }
  | { type: 'project'; name: string; ref: Project }
  | { type: 'work'; name: string; ref: Work }
  | { type: 'pdf'; name: string }
  | { type: 'file'; name: string }
  | { type: 'junk'; name: string; ref: Junk }
  | { type: 'app'; name: string; icon: 'about' | 'mail' | 'site' | 'helpdesk' | 'quote' | 'calendar' | 'settings' };

export const FOLDERS: Record<FolderName, Item[]> = {
  Services: SERVICES.map(s => ({ type: 'service', name: s.name, ref: s })),
  Projects: PROJECTS.map(p => ({ type: 'project', name: p.name, ref: p })),
  Career: WORK.map(w => ({ type: 'work', name: w.org, ref: w })),
  'NGO Work': [{ type: 'service', name: SERVICES[2].name, ref: SERVICES[2] }, ...WORK.filter(w => w.ngo).map(w => ({ type: 'work' as const, name: w.org, ref: w }))],
  Trash: TRASH.map(j => ({ type: 'junk', name: j.name, ref: j }))
};
export const FOLDER_NOTES: Record<FolderName, string> = {
  Services: 'Open a service to see what it includes',
  Projects: 'Products we have designed and built',
  Career: 'Each folder opens that chapter in Career',
  'NGO Work': 'Software and support for non-profits',
  Trash: 'Things David throws out for clients. Open one to see what replaced it'
};
export const DESKTOP_ITEMS: Item[] = [
  { type: 'app', icon: 'helpdesk', name: 'Help Desk' }, { type: 'app', icon: 'calendar', name: 'Book a Call' }, { type: 'app', icon: 'quote', name: 'Quote Calculator' },
  { type: 'folder', name: 'Services' }, { type: 'folder', name: 'Projects' }, { type: 'folder', name: 'Career' }, { type: 'folder', name: 'NGO Work' },
  { type: 'pdf', name: 'David Résumé.pdf' }, { type: 'app', icon: 'about', name: 'About David' }, { type: 'app', icon: 'mail', name: 'Contact' },
  { type: 'app', icon: 'site', name: 'About This Site' }
];
