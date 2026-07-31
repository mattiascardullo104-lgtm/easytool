import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'EasyTools - Tool online gratuiti per PDF, Immagini, Testo e Utility',
  description:
    'Comprimi PDF, converti immagini, genera QR code e password sicure. Oltre 25 strumenti online gratuiti che funzionano direttamente nel browser, senza registrazione.',
  keywords: [
    'strumenti online gratuiti',
    'comprimere pdf gratis',
    'convertire immagini',
    'qr code generator',
    'password generator',
    'tool pdf online',
  ],
  openGraph: {
    title: 'EasyTools - Tool online gratuiti',
    description:
      'Oltre 25 strumenti online gratuiti per PDF, immagini, testo e utility. Tutto nel browser.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
