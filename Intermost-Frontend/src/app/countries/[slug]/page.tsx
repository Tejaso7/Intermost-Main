import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CountryDetail from '@/components/countries/CountryDetail';
import { countriesApi } from '@/lib/services';

interface CountryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  try {
    const country = await countriesApi.getBySlug(params.slug);
    
    return {
      title: country.seo?.title || `MBBS in ${country.name} | Intermost Study Abroad`,
      description: country.seo?.description || `Study MBBS in ${country.name} at NMC & WHO approved universities.`,
      keywords: country.seo?.keywords?.join(', '),
      openGraph: {
        title: country.seo?.title || `MBBS in ${country.name}`,
        description: country.seo?.description || `Study MBBS in ${country.name}`,
        images: [country.banner_image || country.hero_image || '/images/og-default.jpg'],
      },
    };
  } catch {
    return {
      title: 'Country Not Found | Intermost Study Abroad',
    };
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  try {
    const country = await countriesApi.getBySlug(params.slug);
    const colleges = await import('@/lib/services').then(m => m.collegesApi.getByCountry(params.slug)).catch(() => []);
    
    return <CountryDetail country={country} colleges={colleges} />;
  } catch {
    notFound();
  }
}
