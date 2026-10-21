// The Wi-Fi and Battery jokes, shared by the desktop menu bar and the iPhone Control Center.

export const BATTERY = {
  level: 100,
  title: 'Coffee: 100%',
  lines: ['Power Source: Kenyan AA beans', 'Running since 2018, no shutdowns'],
  cta: 'Low on energy? Book a call'
};

export type Network = { name: string; strength: 1 | 2 | 3; connected?: boolean; action: { help: 'wifi' } | { toast: string } };

export const NETWORKS: Network[] = [
  { name: 'OgisCreatives-5G', strength: 3, connected: true, action: { toast: 'Connected. Strong signal, low latency, good vibes.' } },
  { name: 'NRG-Radio-Guest', strength: 2, action: { toast: 'That one’s for the radio studio. David set it up, though.' } },
  { name: 'Your-Office-WiFi', strength: 1, action: { help: 'wifi' } },
  { name: 'FBI_Surveillance_Van_3', strength: 3, action: { toast: 'Nice try.' } }
];
export const WIFI_HELP = 'Wi-Fi keeps dropping? Ask the Help Desk';
