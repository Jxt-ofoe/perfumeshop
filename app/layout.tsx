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
    default: 'Charlene Luxe | Luxury Fragrance',
    template: '%s | Charlene Luxe',
  },
  description:
    'Discover luxury fragrances from the heart of Ghana. Hand-crafted scents for the discerning. Each flacon is a testament to heritage and avant-garde composition.',
  keywords: [
    'luxury perfume',
    'artisanal fragrance',
    'luxury fragrance',
    'niche perfume',
    'Ghana',
    'eau de parfum',
  ],
  openGraph: {
    title: 'Charlene Luxe | Luxury Fragrance',
    description: 'Discover artisanal luxury fragrance from the heart of Grasse.',
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
