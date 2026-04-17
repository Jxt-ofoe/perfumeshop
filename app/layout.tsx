import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'VELOUR | Luxury Fragrance',
    template: '%s | VELOUR',
  },
  description:
    'Discover artisanal French perfumery. Hand-crafted luxury fragrances from the heart of Grasse, France. Each flacon is a testament to heritage and avant-garde composition.',
  keywords: [
    'luxury perfume',
    'artisanal fragrance',
    'French perfumery',
    'niche perfume',
    'Grasse',
    'eau de parfum',
  ],
  openGraph: {
    title: 'VELOUR | Luxury Fragrance',
    description: 'Discover artisanal French perfumery from the heart of Grasse.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#120e0a',
              border: '1px solid rgba(201,169,110,0.2)',
              color: '#f5f0e8',
              fontFamily: 'var(--font-body)',
            },
          }}
        />
      </body>
    </html>
  );
}
