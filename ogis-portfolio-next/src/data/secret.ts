// The "Homework" folder: it looks like something it isn't, and catches the curious.
import type { JunkIcon } from '@/lib/icons';

export const SECRET = {
  name: 'Homework',
  lockedTitle: '“Homework” is password protected',
  hint: 'Password hint: the thing every small office forgets until it’s too late.',
  wrong: 'Wrong. The password was “backups”. Opening anyway, because this folder has terrible security…',
  busted: 'Busted.',
  lede: 'You just opened a folder called “Homework” on a stranger’s computer. Honestly? That’s how most office security problems start: one curious click.',
  insideTitle: 'Here’s what was actually inside:',
  files: [
    { name: 'How to stop staff opening folders like this.pdf', icon: 'doc' },
    { name: 'Backups that actually restore.zip', icon: 'zip' },
    { name: 'Wi-Fi that reaches the back office.docx', icon: 'wifi' },
    { name: 'Grant budget that balances.xlsx', icon: 'sheet' },
    { name: 'Passwords NOT on sticky notes.txt', icon: 'sticky' }
  ] as { name: string; icon: JunkIcon }[],
  pitch: 'David trains teams not to click things like this, and locks down whatever they click anyway. Your curiosity is safe with him. Your network will be too.'
};
