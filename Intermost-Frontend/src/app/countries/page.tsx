import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, ArrowRight, Clock, DollarSign, GraduationCap } from 'lucide-react';
import { countriesApi } from '@/lib/services';
import { getCountryFlag } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Study MBBS Abroad - Top Countries | Intermost Study Abroad',
  description: 'Explore top destinations for MBBS abroad - Russia, Georgia, Uzbekistan, Nepal, Kazakhstan, and more. NMC & WHO approved universities.',
};

// Fallback data for static generation
const fallbackCountries = [
  { name: 'Russia', slug: 'russia', code: 'ru', flag_url: '/flags/russia.png', total_fee: '₹25-35 Lakhs', duration: '6 Years', hero_image: '/images/countries/russia.jpg' },
  { name: 'Georgia', slug: 'georgia', code: 'ge', flag_url: '/flags/georgia.png', total_fee: '₹30-45 Lakhs', duration: '6 Years', hero_image: '/images/countries/georgia.jpg' },
  { name: 'Uzbekistan', slug: 'uzbekistan', code: 'uz', flag_url: '/flags/uzbekistan.png', total_fee: '₹20-28 Lakhs', duration: '6 Years', hero_image: '/images/countries/uzbekistan.jpg' },
  { name: 'Nepal', slug: 'nepal', code: 'np', flag_url: '/flags/nepal.png', total_fee: '₹55-60 Lakhs', duration: '5.5 Years', hero_image: '/images/countries/nepal.jpg' },
  { name: 'Kazakhstan', slug: 'kazakhstan', code: 'kz', flag_url: '/flags/kazakhstan.png', total_fee: '₹20-28 Lakhs', duration: '6 Years', hero_image: '/images/countries/kazakhstan.jpg' },
  { name: 'Tajikistan', slug: 'tajikistan', code: 'tj', flag_url: '/flags/tajikistan.png', total_fee: '₹18-25 Lakhs', duration: '6 Years', hero_image: '/images/countries/tajikistan.jpg' },
];

export default async function CountriesPage() {
  let countries = fallbackCountries;
  
  try {
    const data = await countriesApi.getAll({ active: true });
    if (data && data.length > 0) {
      countries = data.map(c => ({
        name: c.name,
        slug: c.slug,
        code: c.code,
        flag_url: c.flag_url,
        total_fee: c.pricing?.total_course_fee || 'Contact Us',
        duration: c.course_details?.duration || '6 Years',
        hero_image: c.hero_image || c.banner_image || '',
        recognition: c.course_details?.recognition || ['NMC', 'WHO'],
        is_featured: c.meta?.is_featured,
      }));
    }
  } catch (error) {
    console.error('Error fetching countries:', error);
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Study MBBS Abroad
            </h1>
            <p className="text-xl text-primary-100">
              Explore top destinations for medical education with NMC & WHO approved
              universities. Affordable fees, quality education, and excellent career prospects.
            </p>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country: any) => (
              <Link
                key={country.slug}
                href={`/countries/${country.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48">
                  <Image
                    src={country.hero_image || `/images/countries/${country.slug}.jpg`}
                    alt={`MBBS in ${country.name}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  {/* Flag */}
                  <div className="absolute top-4 left-4 w-10 h-7 rounded overflow-hidden shadow">
                    <Image
                      src={country.flag_url || `/flags/${country.slug}.png`}
                      alt={`${country.name} flag`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Featured Badge */}
                  {country.is_featured && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                      Popular
                    </span>
                  )}

                  {/* Country Name */}
                  <div className="absolute bottom-4 left-4">
                    <h2 className="text-2xl font-bold text-white">
                      MBBS in {country.name}
                    </h2>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                      <span className="text-xs text-gray-500 block">Duration</span>
                      <span className="text-sm font-semibold">{country.duration}</span>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <GraduationCap className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                      <span className="text-xs text-gray-500 block">Medium</span>
                      <span className="text-sm font-semibold">English</span>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                      <span className="text-xs text-gray-500 block">Total Fee</span>
                      <span className="text-sm font-semibold">{country.total_fee}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {(country.recognition || ['NMC', 'WHO']).slice(0, 2).map((rec: string) => (
                        <span
                          key={rec}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded"
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                    <span className="text-primary-600 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Not Sure Which Country to Choose?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Our expert counselors will help you select the best country based on 
              your NEET score, budget, and preferences. Get free guidance today!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/apply" className="btn-white">
                Get Free Counseling
              </Link>
              <a
                href="tel:+919058501818"
                className="flex items-center text-white font-semibold"
              >
                <Globe className="w-5 h-5 mr-2" />
                +91 9058501818
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
