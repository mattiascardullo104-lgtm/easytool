import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'EasyTools - Free online tools for PDF, Images, Text and Utility',
  description:
    'Compress PDFs, convert images, generate QR codes and secure passwords. 25+ free online tools that work directly in your browser, no registration needed.',
  keywords: [
    'free online tools',
    'compress pdf free',
    'image converter',
    'qr code generator',
    'password generator',
    'online pdf tools',
  ],
  openGraph: {
    title: 'EasyTools - Free online tools',
    description:
      '25+ free online tools for PDF, images, text and utility. Everything in your browser.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
