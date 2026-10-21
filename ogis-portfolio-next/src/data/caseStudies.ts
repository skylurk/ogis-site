// Case studies for each project, shown in the project window and on the simple view.
// Written from what each project does. Add real outcomes (numbers, client quotes) under `results` when you have them.

export type CaseStudy = {
  headline: string;
  problem: string[];
  approach: string[];
  highlights: string[];
  principle: string;
  facts: [string, string][];
  results?: string[];
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  flightbag: {
    headline: 'Knowing where every crew is, without a single phone call',
    problem: [
      'Aviation operators run on paperwork and phone calls. Where is the crew for the early Kisumu rotation? Has today’s flight log been filled in? The answers live in WhatsApp threads and in the heads of whoever happens to be on shift.',
      'Every gap means a call, and every call means someone stops what they are doing.'
    ],
    approach: [
      'Flight Bag splits the job in two. Crews carry a mobile app on Android or iPhone that collects flight data where the work happens, with their location attached.',
      'The operations team gets a web console that turns those submissions into a live picture: who is where, what has been filed and what is still missing.'
    ],
    highlights: [
      'Crew locations plotted on a map using GeoJSON and ArcGIS layers',
      'Firebase keeps the console and every phone in sync',
      'One Flutter codebase for both Android and iPhone',
      'A React web console built for the operations desk'
    ],
    principle: 'Collect data where the work happens. Review it where the decisions are made.',
    facts: [['Platforms', 'Android, iPhone, web console'], ['Built with', 'Flutter, React, Firebase, Node.js, ArcGIS'], ['David’s role', 'Design and development']]
  },
  ingia: {
    headline: 'A visitor book that knows whether you’re really at the gate',
    problem: [
      'Paper visitor books are easy to fake and impossible to search. Anyone can write any name at any time, and when security needs to know who was on site at 3pm, someone flips through pages.',
      'Sign-in apps are better, until someone checks in from the car park, or from home.'
    ],
    approach: [
      'Ingia (Kiswahili for “come in”) moves sign-in to the visitor’s phone and only allows it inside a geofence accurate to about 20 metres around the entrance.',
      'Every check-in and check-out is timestamped, so the log answers questions instead of raising them.'
    ],
    highlights: [
      'A GeoJSON geofence drawn around each entrance',
      'Check-ins from outside the fence are blocked, not just flagged',
      'A clear, searchable record of who came and went',
      'Built on MongoDB, Express, AngularJS and Node.js'
    ],
    principle: 'Security that doesn’t feel like security.',
    facts: [['Type', 'Visitor management system'], ['Built with', 'AngularJS, Node.js, Express, MongoDB, GeoJSON'], ['Accuracy', 'About 20 metres']]
  },
  ccartings: {
    headline: 'A BMW diagnostic tool that won’t let you make things worse',
    problem: [
      'Diagnostic software for older BMWs is powerful, cryptic and unforgiving. Clear the wrong fault codes and the evidence of what went wrong is gone for good.',
      'Most tools assume you already know exactly what you are doing.'
    ],
    approach: [
      'C-Cartings wraps the same diagnostic jobs, sent to the car through a K+DCAN USB cable, in a calm desktop app for Windows and macOS.',
      'It scans all 16 control units on an E90-family 3 Series, explains what it finds, and builds guardrails into every risky step.'
    ],
    highlights: [
      'Before clearing faults it asks, saves a report, then re-reads the module to show which faults come straight back',
      'VIN checks catch typos, like the letters I, O and Q that never appear in a VIN',
      'A simulator mode with clearly marked demo faults, so you can learn without the car',
      'New vehicles are added as data, not as new screens'
    ],
    principle: 'Make the safe thing the default thing.',
    facts: [['Platforms', 'Windows and macOS'], ['Supports', 'BMW 3 Series E90, E91, E92, E93 (2005–2013)'], ['Built with', 'C# and .NET']]
  },
  ogisdb: {
    headline: 'A better window into Firebase',
    problem: [
      'Firebase’s web console is fine for a quick look and painful for real work: one document at a time, tabs that forget where you were, columns you can’t resize.',
      'Teams end up exporting data to spreadsheets just to read it.'
    ],
    approach: [
      'Ogis DB Studio is a desktop workspace for Firebase databases. A project tree on the left, draggable tabs across the top, a table you can resize and reorder, and a details pane for the document you’re looking at.',
      'It feels like a native Mac app because it is one, packaged with Electron.'
    ],
    highlights: [
      'Signs in with your own Google OAuth client, so credentials never pass through the app’s interface',
      'Draggable workspace tabs and resizable, reorderable columns',
      'Built and validated in stages, with release notes for every version',
      'Electron, React, TypeScript and Vite, styled with Tailwind'
    ],
    principle: 'Tools for developers deserve the same care as tools for customers.',
    facts: [['Platform', 'macOS desktop app'], ['Built with', 'Electron, React, TypeScript, Vite, Tailwind'], ['Works with', 'Firebase and Firestore']]
  },
  qr: {
    headline: 'A QR code that will still work in ten years',
    problem: [
      'Most “free” QR generators hide a short link inside the code that redirects through their servers. When the free trial ends or the company folds, every printed code stops working: menus, flyers, signboards, posters.',
      'For an NGO with thousands of printed leaflets, that is a quiet disaster.'
    ],
    approach: [
      'Fogedit QR encodes your link directly into the code. No redirect, no short link, no expiry.',
      'It runs entirely in your browser: no accounts, no tracking, and any logo you add never leaves your device.'
    ],
    highlights: [
      'Nothing to break: the code is the link',
      'Private by design: no server ever sees what you encode',
      'Saved codes stay on your own device',
      'Built with Next.js and tuned so people find it on search engines'
    ],
    principle: 'The most reliable server is no server at all.',
    facts: [['Price', 'Free, permanently'], ['Built with', 'Next.js, TypeScript, Tailwind'], ['Accounts needed', 'None']]
  },
  aviation: {
    headline: 'Maintenance records that can survive an audit',
    problem: [
      'Aircraft maintenance is a paper trail by law: inventory, requisitions, purchase orders and airworthiness records. Many operators still juggle spreadsheets and ageing tools, and an audit means days of digging.',
      'When records live in five places, nobody is sure which one is right.'
    ],
    approach: [
      'Fogedit Aviation is a platform for several aviation companies at once, built around clear workflows and traceable records. Every change has an owner and a history.',
      'AI assistance is permission-controlled, so it can help find and summarise records without seeing anything it shouldn’t.'
    ],
    highlights: [
      'Inventory, requisitions, purchase orders and airworthiness records in one place',
      'Each operator’s records kept separate from day one',
      'Sign-in with multifactor authentication and private file storage',
      'The owner reviews every screen and workflow; early demos use fictional data'
    ],
    principle: 'In aviation, “who changed this, and when?” is not a nice-to-have.',
    facts: [['Status', 'In development'], ['Built with', 'Next.js, NestJS, Supabase, Tailwind, shadcn/ui'], ['For', 'Aviation maintenance and operations teams']]
  }
};
