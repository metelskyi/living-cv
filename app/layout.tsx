import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ModeProvider } from '@/components/providers/ModeProvider';
import { KonamiEasterEgg } from '@/components/easter-egg/KonamiEasterEgg';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://cv-ihor-metelskyi.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ihor Metelskyi — Software QA Engineer | Living CV',
    template: '%s',
  },
  description:
    'Experienced QA Engineer with 7+ years in IT. iGaming, E-Commerce, IoT. This is not a PDF — it is a Living CV.',
  keywords: [
    'Ihor Metelskyi',
    'QA Engineer',
    'Software QA',
    'iGaming testing',
    'IoT testing',
    'Manual testing',
    'Living CV',
  ],
  authors: [{ name: 'Ihor Metelskyi' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Ihor Metelskyi — Software QA Engineer | Living CV',
    description:
      'Not a PDF. A Living CV. 7+ years in IT — iGaming, E-Commerce, IoT.',
    siteName: 'Ihor Metelskyi — Living CV',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ihor Metelskyi — Software QA Engineer | Living CV',
    description:
      'Not a PDF. A Living CV. 7+ years in IT — iGaming, E-Commerce, IoT.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e1a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ModeProvider>
            {children}
            <KonamiEasterEgg />
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
