// The Trash: the kind of thing David throws out for clients, and what replaces it.
import type { JunkIcon } from '@/lib/icons';

export type Junk = { name: string; icon: JunkIcon; found: string; fix: string };

export const TRASH: Junk[] = [
  { name: 'printer-driver-2009.exe', icon: 'exe',
    found: 'On every PC in a twelve-person office, still trying to install itself every morning.',
    fix: 'One current driver, installed once, that works on every machine.' },
  { name: 'passwords (sticky note).jpg', icon: 'sticky',
    found: 'Stuck to a monitor. The monitor faced the window.',
    fix: 'A password manager the whole team actually uses, and two-step sign-in on email.' },
  { name: 'website-final-FINAL-v3.psd', icon: 'doc',
    found: 'The design for a website nobody could update without phoning the agency.',
    fix: 'A site the staff edit themselves, set up so people can find it on Google.' },
  { name: 'backup (DO NOT DELETE).zip', icon: 'zip',
    found: 'The only backup, saved on the same drive it was backing up.',
    fix: 'Three copies, one of them off-site, checked every month.' },
  { name: 'inventory-v47-REAL.xlsx', icon: 'sheet',
    found: 'Forty-seven versions of one spreadsheet, emailed back and forth.',
    fix: 'One shared system that remembers who changed what, and when.' },
  { name: 'wifi password is on the fridge.txt', icon: 'wifi',
    found: 'The office Wi-Fi password, also enjoyed by the neighbours.',
    fix: 'A separate guest network, and a password that isn’t the company name.' }
];

export const EMPTY_TRASH_REPLIES = [
  'These stay as a warning to others.',
  'Some things can’t be deleted. Like David’s commitment to backups.',
  'Emptied. Just kidding. Every file here was replaced with something better.',
  'Are you sure? These are basically museum pieces.'
];
