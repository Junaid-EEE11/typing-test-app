import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TypeFlow | Realistic Typing Practice for Everyone',
  description:
    'Improve your typing speed and accuracy with realistic English sentences. Modern, privacy-focused typing practice application with accurate evaluation and analytics.',
  keywords: [
    'typing practice',
    'typing test',
    'touch typing',
    'wpm test',
    'improve typing speed',
    'realistic sentences typing',
    'typing tutor',
  ],
  authors: [{ name: 'TypeFlow Team' }],
  openGraph: {
    title: 'TypeFlow - Realistic Typing Practice',
    description: 'Master touch typing with real-world sentences and accurate progress tracking.',
    type: 'website',
    locale: 'en_US',
    siteName: 'TypeFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TypeFlow - Realistic Typing Practice',
    description: 'Master touch typing with real-world sentences and accurate progress tracking.',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-text-main selection:bg-primary selection:text-background">
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:rounded-lg focus:font-bold shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
