import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import AnalyticsTracker from '@/components/AnalyticsTracker';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: 'Intermost Study Abroad - Your Gateway to Global Medical Education',
  description:
    'Get guaranteed MBBS admission in WHO & NMC approved medical universities abroad. Study MBBS in Russia, Georgia, Nepal, Uzbekistan, and more.',
  keywords:
    'MBBS abroad, study medicine abroad, MBBS in Russia, MBBS in Georgia, medical universities abroad, NMC approved universities',
  authors: [{ name: 'Intermost Ventures LLP' }],
  metadataBase: new URL('https://intermoststudyabroad.com'),
  openGraph: {
    title: 'Intermost Study Abroad - MBBS Overseas Education Consultants',
    description:
      'Get guaranteed MBBS admission in WHO & NMC approved medical universities abroad.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Intermost Study Abroad',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intermost Study Abroad - MBBS Overseas Education Consultants',
    description:
      'Get guaranteed MBBS admission in WHO & NMC approved medical universities abroad.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased selection:bg-primary-500/20 selection:text-primary-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#22c55e',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              },
            },
          }}
        />
        <AnalyticsTracker />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
