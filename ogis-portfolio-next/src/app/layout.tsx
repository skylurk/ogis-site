import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-jb' });

export const metadata: Metadata = {
  title: 'David · Ogis Creatives',
  description: 'Tech support, development services and NGO software services by David at Ogis Creatives, Kenya.',
  openGraph: {
    title: 'David · Ogis Creatives',
    description: 'Tech support, development services and NGO software services.',
    type: 'website'
  }
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="locked">{children}</body>
    </html>
  );
}
