import { Navbar } from '@/components/Navbar';
import '../styles/globals.css';

import { Metadata } from 'next';
import { Cabin } from 'next/font/google';
import { Ubuntu } from 'next/font/google';
import clsx from 'clsx';
import AnalyticsWrapper from '@/components/AnalyticsWrapper';

const cabin = Cabin({ subsets: ['latin'], display: 'swap' });
const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  display: 'swap',
  weight: ['400', '500', '700'],
  subsets: ['latin-ext'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ethcc.masca.io'),
  title: {
    default: 'Masca EthCC[6]',
    template: '%s | Masca EthCC[6] ',
  },
  description:
    'A dApp built for demonstration purposes at EthCC[6] workshop Decentralized Identity meets MetaMask.',
  keywords: ['ethcc', 'masca', 'decentralized identity'],
  openGraph: {
    title: 'Masca EthCC[6] Workshop',
    description:
      'Claim your unique EthCC[6] Verifiable Credential from Masca team and chat with other participants.',
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
      <body className={clsx(`${cabin.className} ${ubuntu.variable}`)}>
        <main className="flex h-screen w-full flex-col">
          <div className="flex-none">
            <Navbar />
          </div>
          <div className="flex h-full flex-1 flex-col overflow-auto">
            {children}
          </div>
        </main>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
