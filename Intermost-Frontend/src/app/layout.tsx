import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import ScrollEnhancements from '@/components/common/ScrollEnhancements';

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

import { coreApi } from '@/lib/services';

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = null;
  try {
    settings = await coreApi.getSettings();
  } catch (error) {
    console.debug('Failed to fetch site settings for layout metadata, using default fallbacks.');
  }

  const title = settings?.seo?.title || settings?.meta_title || 'Intermost Study Abroad - Your Gateway to Global Medical Education';
  const description = settings?.seo?.description || settings?.meta_description || 'Get guaranteed MBBS admission in WHO & NMC approved medical universities abroad. Study MBBS in Russia, Georgia, Nepal, Uzbekistan, and more.';
  const keywords = settings?.seo?.keywords || settings?.meta_keywords || 'MBBS abroad, study medicine abroad, MBBS in Russia, MBBS in Georgia, medical universities abroad, NMC approved universities';
  
  const ogTitle = settings?.seo?.og_title || settings?.meta_title || 'Intermost Study Abroad - Your Gateway to Global Medical Education';
  const ogDescription = settings?.seo?.og_description || settings?.meta_description || 'Get guaranteed MBBS admission in WHO & NMC approved medical universities abroad.';
  const canonicalUrl = settings?.seo?.canonical_url || 'https://intermost.in/';
  const robotsVal = settings?.seo?.robots || 'index, follow, max-image-preview:large';

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Intermost Ventures LLP' }],
    metadataBase: new URL(canonicalUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'website',
      locale: 'en_IN',
      siteName: settings?.site_name || 'Intermost Study Abroad',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
    },
    robots: robotsVal,
  };
}

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
        <ScrollEnhancements />
        <AnalyticsTracker />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
