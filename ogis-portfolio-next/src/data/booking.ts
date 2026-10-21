// Book a Call: David's working hours and how open slots are generated.
// Slots are suggestions; David confirms each request by email. Change the hours here.

export const BOOKING = {
  timeZone: 'Africa/Nairobi',
  zoneLabel: 'Nairobi (EAT)',
  utcOffsetHours: 3, // Kenya has no daylight saving
  days: [1, 2, 3, 4, 5], // Monday to Friday
  startHour: 9,
  endHour: 17,
  breakHours: [13], // lunch
  slotMinutes: 30,
  weeksAhead: 3,
  noticeHours: 3, // earliest bookable time from now
  busyShare: 0.32, // share of slots shown as already taken, so the week looks real
  methods: ['Google Meet', 'WhatsApp call', 'Phone call'] as const
};

export type Slot = { start: Date; busy: boolean; past: boolean };
export type Day = { key: string; date: Date; weekday: string; label: string; slots: Slot[] };

/** A stable pseudo-random number in [0, 1) for a string, so busy slots don't jump around between visits. */
function hash01(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 10000) / 10000;
}

/** The calendar date in Nairobi for a moment in time, as UTC-midnight. */
export function nairobiDay(t: number) {
  const d = new Date(t + BOOKING.utcOffsetHours * 3600_000);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Monday of the Nairobi week containing `t`, as UTC-midnight. */
export function weekStart(t: number) {
  const day = nairobiDay(t), dow = new Date(day).getUTCDay();
  return day - ((dow + 6) % 7) * 86_400_000;
}

/** The working days of one week (weekOffset 0 = this week), each with its slots. */
export function weekDays(now: number, weekOffset: number): Day[] {
  const monday = weekStart(now) + weekOffset * 7 * 86_400_000;
  return BOOKING.days.map(dow => {
    const day = monday + (dow - 1) * 86_400_000;
    const date = new Date(day);
    const slots: Slot[] = [];
    for (let m = BOOKING.startHour * 60; m < BOOKING.endHour * 60; m += BOOKING.slotMinutes) {
      if (BOOKING.breakHours.includes(Math.floor(m / 60))) continue;
      const start = new Date(day + (m - BOOKING.utcOffsetHours * 60) * 60_000);
      const tooSoon = start.getTime() < now + BOOKING.noticeHours * 3600_000;
      slots.push({ start, past: tooSoon, busy: !tooSoon && hash01(`${day}-${m}`) < BOOKING.busyShare });
    }
    return {
      key: String(day), date, slots,
      weekday: date.toLocaleDateString('en', { weekday: 'short', timeZone: 'UTC' }),
      label: date.toLocaleDateString('en', { day: 'numeric', timeZone: 'UTC' })
    };
  });
}

export const fmtTime = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
export const fmtLong = (d: Date) => d.toLocaleString([], { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' });
export const fmtNairobi = (d: Date) => d.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: BOOKING.timeZone });
export const visitorZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ');
