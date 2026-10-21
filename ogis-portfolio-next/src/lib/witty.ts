// Replies for things people type into the Terminal that aren't commands.
// Each rule matches the whole line (lowercased, punctuation trimmed). `fixes` become
// the suggestions offered by `fuck`, so a reply can point somewhere useful.

export type Witty = { match: RegExp; reply: string | ((m: RegExpMatchArray) => string); fixes?: string[] };

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const WITTY: Witty[] = [
  // Swearing at the terminal (or at David)
  { match: /^(fuck|screw|damn) (you|u|off|this|it|david|ogis)\b.*$/, reply: m => m[2] === 'david' || m[2] === 'ogis'
      ? 'Easy there. I think you meant: hire David.'
      : 'Rude. Let’s turn that energy into something productive.', fixes: ['hire', 'services'] },
  { match: /^(wtf|omg|ugh|argh+)$/, reply: 'Breathe. Then type help.', fixes: ['help'] },

  // Hiring, money and availability
  { match: /^sudo hire( david| ogis| him)?$/, reply: 'No sudo needed. David is happy to be hired by anyone.', fixes: ['hire'] },
  { match: /^(how much|price|prices|pricing|rates?|cost|quote|budget)\b.*$/, reply: 'Depends on the job. NGO budgets welcome. Ask for a quote:', fixes: ['hire'] },
  { match: /^(is david )?(available|free|busy)\??$/, reply: 'Available for new work right now. Usually replies within a day.', fixes: ['hire'] },
  { match: /^(i need|help me with|can you (build|make|fix)) (.+)$/, reply: m => `David can probably help with ${m[4]}. Tell him about it:`, fixes: ['hire'] },
  { match: /^(are you )?hiring\??$/, reply: 'David isn’t hiring. But you can hire David.', fixes: ['hire'] },

  // Greetings, manners, feelings
  { match: /^(hi|hello|hey|yo|sup|hola|howdy)( there| david)?$/, reply: () => `${greeting()}! I’m David’s terminal. Type help to look around.`, fixes: ['help'] },
  { match: /^(jambo|habari|habari yako|mambo|niaje|sasa)$/, reply: m => ({ jambo: 'Jambo! Habari gani?', habari: 'Nzuri sana, asante!', 'habari yako': 'Nzuri sana, asante!', mambo: 'Poa sana!', niaje: 'Poa! Karibu.', sasa: 'Fiti! Karibu.' } as Record<string, string>)[m[1]], fixes: ['whoami'] },
  { match: /^(asante|asante sana)$/, reply: 'Karibu sana!' },
  { match: /^(thanks|thank you|thx|ty|cheers)( david)?$/, reply: 'You’re welcome. Come back any time.' },
  { match: /^(sorry|my bad|oops)$/, reply: 'No harm done. It’s a terminal, not a judge.' },
  { match: /^(lol|lmao|haha+|hehe+)$/, reply: 'Glad someone’s having fun in here.' },
  { match: /^i love (you|this|it|david)$/, reply: 'That’s sweet. David loves good clients too.', fixes: ['hire'] },
  { match: /^(bye|goodbye|see ya|later|cya)$/, reply: 'Leaving so soon? Type exit to close, or hire to stay in touch.', fixes: ['exit', 'hire'] },
  { match: /^(yes|no|maybe|ok|okay)$/, reply: 'Decisive. I like it. Now try a command, like help.', fixes: ['help'] },

  // About this place
  { match: /^(who are you|what are you|what is this|whats this|what is this place)$/, reply: 'A pretend Mac running David’s portfolio. Everything here is real work, the Mac is the costume.', fixes: ['whoami', 'help'] },
  { match: /^(where are you|where is david|location)$/, reply: 'Kenya. Remote support reaches the rest of the world.', fixes: ['contact'] },
  { match: /^(is this real|are you real|are you (an )?ai|are you human)$/, reply: 'The terminal is fake. David is real, and so is his work.', fixes: ['projects'] },

  // The "Homework" folder
  { match: /^(cd|ls|cat|sudo cat|sudo cd|unzip)( -\w+)? ["']?(~\/)?homework\/?["']?$/, reply: 'Nice try. That folder is password protected, and the password is “hire David”. (Curious clicks are how break-ins start. David can help with that.)', fixes: ['open Homework', 'services'] },
  { match: /^(sudo )?rm( -\w+)? ["']?homework\/?["']?$/, reply: 'Deleting the evidence? It’s backed up in three places, one of them off-site. David insists. Want backups like that?', fixes: ['services'] },
  { match: /^(sudo )?(crack|hack|bruteforce|john|hashcat)( -\w+)? ["']?homework["']?$/, reply: 'Brute-forcing a portfolio? Bold. Point that energy at your own network: David runs security audits.', fixes: ['services'] },

  // Classic jokes
  { match: /^make me a (sandwich|coffee|tea)$/, reply: m => `What? Make your own ${m[1]}.`, fixes: ['sudo make me a sandwich'] },
  { match: /^sudo make me a (sandwich|coffee|tea)$/, reply: 'Okay.' },
  { match: /^(coffee|brew coffee|make coffee)$/, reply: '418 I’m a teapot. Try: cat .coffee', fixes: ['cat .coffee'] },
  { match: /^(:q!?|:wq!?|:x|exit vim|how do i exit vim)$/, reply: 'You’re not in vim. But congratulations, you escaped anyway.' },
  { match: /^(42|meaning of life|what is the meaning of life)\??$/, reply: '42. Also: good software, delivered on time.' },
  { match: /^hack( the)? (planet|nasa|mainframe|pentagon|this|david)?$/, reply: 'Access denied. Nice try, though. David does security audits if you need one.', fixes: ['services'] },
  { match: /^(rm -rf|kill|delete|destroy) (david|ogis)$/, reply: 'David has backups. He also does backups for other people.', fixes: ['services'] },
  { match: /^ping david$/, reply: 'pong. David is online and replies within a day.', fixes: ['contact'] },
  { match: /^(sing|dance|tell me a joke|joke)$/, reply: 'Why did the developer go broke? He used up all his cache. Type hire to help.', fixes: ['hire'] },
  { match: /^(sudo su|su|su root|sudo -i)$/, reply: 'You’re a guest here. The root password is “hire David”.', fixes: ['hire'] },
  { match: /^(xyzzy|plugh)$/, reply: 'Nothing happens.' },
  { match: /^(hello world|print\(?["']?hello world["']?\)?)$/, reply: 'Hello, World! Every great career starts here. David’s started in 2016.', fixes: ['career'] }
];

/** Rotating replies for commands with no rule and no close typo. `{cmd}` is the command. */
export const NOT_FOUND_QUIPS = [
  'I looked everywhere for {cmd}. Even in the Trash.',
  '{cmd}? Not installed. David installs things, though.',
  'That’s not a command, but it would make a great band name.',
  '{cmd} is not a thing here. Yet.',
  'My manual has no page for {cmd}. Try help.',
  'Even sudo can’t find {cmd}.'
];
