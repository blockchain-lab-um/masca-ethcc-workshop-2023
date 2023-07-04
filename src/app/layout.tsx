import '../styles/globals.css';

import AnalyticsWrapper from '@/components/AnalyticsWrapper';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ethcc.masca.io'),
  title: {
    default: 'Masca',
    template: '%s | EthCC[6] Masca',
  },
  description: '',
  keywords: ['ethcc', 'masca', 'decentralized identity'],
  openGraph: {
    title: 'Masca EthCC Workshop',
    description: '',
    locale: 'en_US',
    url: 'https://ethcc.masca.io',
    siteName: 'Masca',
    images: [
      {
        url: 'https://ethcc.masca.io/api/og',
        width: 1920,
        height: 1080,
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  twitter: {
    title: 'Masca',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/favicon.ico',
  },
  manifest: null,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <main>{children}</main>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
