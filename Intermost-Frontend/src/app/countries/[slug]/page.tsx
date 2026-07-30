import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CountryDetail from '@/components/countries/CountryDetail';
import JsonLdSchema from '@/components/seo/JsonLdSchema';
import { countriesApi, collegesApi } from '@/lib/services';
import type { Country } from '@/lib/api';

interface CountryPageProps {
  params: { slug: string };
}

const fallbackCountriesMap: Record<string, Partial<Country>> = {
  russia: {
    _id: 'russia',
    name: 'Russia',
    slug: 'russia',
    code: 'ru',
    flag_url: 'https://flagcdn.com/w80/ru.png',
    hero_image: '/images/countries/russia.jpg',
    banner_image: '/images/countries/russia.jpg',
    hero_video: 'https://intermost-media-uploads.s3.ap-southeast-2.amazonaws.com/static/video/video/russia/russia.mp4',
    overview: {
      title: 'Why Study MBBS in Russia?',
      description: 'Russia is one of the top choices for Indian medical aspirants, offering world-class infrastructure, highly experienced faculty, and globally recognized medical degrees at an affordable cost.',
      highlights: [
        { title: 'NMC & WHO Approved', description: 'Degrees recognized globally by WHO, NMC, ECFMG, and FAIMER.' },
        { title: 'Direct Admission', description: 'Simple admission process based on 10+2 PCB marks & NEET score.' },
        { title: '100% English Medium', description: 'Complete 6-year program taught entirely in English.' },
        { title: 'Affordable Tuition', description: 'Complete tuition program starting from 18 Lakhs total fee.' },
      ]
    },
    course_details: {
      duration: '6 Years',
      medium: 'English',
      degree_awarded: 'MD (Doctor of Medicine)',
      recognition: ['NMC', 'WHO', 'ECFMG', 'FAIMER']
    },
    pricing: {
      tuition_fee: '$3,500 - $6,000 / Year',
      hostel_fee: '$600 - $1,200 / Year',
      living_cost: '$150 - $200 / Month',
      total_course_fee: 'Starting from 18 Lakhs',
      currency: 'USD'
    },
    eligibility: {
      academic: '50% in 10+2 with Physics, Chemistry, Biology',
      minimum_marks: '50% for General, 40% for Reserved categories',
      neet_required: true,
      age_requirement: 'Minimum 17 Years'
    },
    faqs: [
      { question: 'Is Russian MBBS degree valid in India?', answer: 'Yes, MBBS degrees from NMC-approved Russian medical universities are valid worldwide and in India after passing NEXT / FMGE.' },
      { question: 'What is the medium of instruction in Russia?', answer: 'The medium of instruction is 100% English for the full 6-year duration.' },
      { question: 'What is the tuition cost of studying MBBS in Russia?', answer: 'Starting tuition fee from $3,500 / Year, with complete program starting from 18 Lakhs.' }
    ]
  },
  georgia: {
    _id: 'georgia',
    name: 'Georgia',
    slug: 'georgia',
    code: 'ge',
    flag_url: 'https://flagcdn.com/w80/ge.png',
    hero_image: '/images/countries/georgia.jpg',
    banner_image: '/images/countries/georgia.jpg',
    hero_video: 'https://intermost-media-uploads.s3.ap-southeast-2.amazonaws.com/static/video/video/georgia/georgia.mp4',
    overview: {
      title: 'Why Study MBBS in Georgia?',
      description: 'Georgia offers European-standard medical education with state-of-the-art facilities, excellent safety standards, and high USMLE/PLAB success rates.',
      highlights: [
        { title: 'European Curriculum', description: 'High quality European standard medical curriculum.' },
        { title: 'Safe & Peaceful', description: 'Georgia is ranked among the top safest countries globally.' },
        { title: '100% English Medium', description: 'All classes and practical clinical training conducted in English.' },
        { title: 'WFME & NMC Recognized', description: 'Graduates eligible for USMLE, PLAB, NEXT, and global practice.' }
      ]
    },
    course_details: {
      duration: '6 Years',
      medium: 'English',
      degree_awarded: 'MD (Doctor of Medicine)',
      recognition: ['NMC', 'WHO', 'WFME', 'FAIMER']
    },
    pricing: {
      tuition_fee: '$4,800 - $8,000 / Year',
      hostel_fee: '$2,500 - $3,000 / Year',
      total_course_fee: 'Starting from $4,800 / Year',
      currency: 'USD'
    },
    eligibility: {
      academic: '50% in 10+2 with Physics, Chemistry, Biology',
      minimum_marks: '50% in PCB aggregate',
      neet_required: true,
      age_requirement: 'Minimum 17 Years'
    },
    faqs: [
      { question: 'Why choose Georgia for MBBS?', answer: 'Georgia provides European education quality, high safety standards, and USMLE preparation support.' }
    ]
  },
  uzbekistan: {
    _id: 'uzbekistan',
    name: 'Uzbekistan',
    slug: 'uzbekistan',
    code: 'uz',
    flag_url: 'https://flagcdn.com/w80/uz.png',
    hero_image: '/images/countries/uzbekistan.jpg',
    banner_image: '/images/countries/uzbekistan.jpg',
    hero_video: 'https://intermost-media-uploads.s3.ap-southeast-2.amazonaws.com/static/video/video/uzbekistan/uzbekistan.mp4',
    overview: {
      title: 'Why Study MBBS in Uzbekistan?',
      description: 'Uzbekistan is a top choice for Indian students offering highly affordable tuition fees, government universities like Andijan State Medical University, and direct flight connectivity from Delhi.',
      highlights: [
        { title: 'Highly Affordable', description: 'Starting tuition fee from $3,500 / Year.' },
        { title: 'Indian Mess & Food', description: 'Dedicated Indian mess and accommodation in hostels.' },
        { title: 'Government Universities', description: 'Study in government universities like Andijan State Medical University.' },
        { title: 'Close to India', description: 'Just 3 hours flight time from New Delhi.' }
      ]
    },
    course_details: {
      duration: '6 Years',
      medium: 'English',
      degree_awarded: 'MD (Doctor of Medicine)',
      recognition: ['NMC', 'WHO', 'FAIMER']
    },
    pricing: {
      tuition_fee: '$3,500 - $4,500 / Year',
      hostel_fee: '$600 - $1,000 / Year',
      total_course_fee: 'Starting from $3,500 / Year',
      currency: 'USD'
    },
    eligibility: {
      academic: '50% in 10+2 with PCB',
      minimum_marks: '50% for General category',
      neet_required: true,
      age_requirement: 'Minimum 17 Years'
    },
    faqs: [
      { question: 'Are Indian foods available in Uzbekistan hostels?', answer: 'Yes, Indian mess facilities serving vegetarian and non-vegetarian Indian food are available.' }
    ]
  },
  nepal: {
    _id: 'nepal',
    name: 'Nepal',
    slug: 'nepal',
    code: 'np',
    flag_url: 'https://flagcdn.com/w80/np.png',
    hero_image: '/images/countries/nepal.jpg',
    banner_image: '/images/countries/nepal.jpg',
    hero_video: 'https://intermost-media-uploads.s3.ap-southeast-2.amazonaws.com/static/video/video/nepal/nepal.mp4',
    overview: {
      title: 'Why Study MBBS in Nepal?',
      description: 'Nepal offers a medical curriculum closely matching India (AIIMS pattern), no visa requirement for Indian citizens, and top colleges like Chitwan Medical College & Hospital.',
      highlights: [
        { title: 'Same Curriculum', description: 'Syllabus closely aligned with NMC and AIIMS pattern.' },
        { title: 'No Visa Needed', description: 'Indian citizens can study and travel without a visa.' },
        { title: 'Top Institutions', description: 'Colleges like Chitwan Medical College & Hospital.' },
        { title: 'Identical Clinical Exposure', description: 'Disease patterns and clinical cases identical to India.' }
      ]
    },
    course_details: {
      duration: '5.5 Years',
      medium: 'English',
      degree_awarded: 'MBBS',
      recognition: ['NMC', 'WHO']
    },
    pricing: {
      tuition_fee: '₹50 - 65 Lakhs Total',
      hostel_fee: '₹5 - 12 Lakhs Total',
      total_course_fee: '₹50 - 65 Lakhs (Full Program)',
      currency: 'INR'
    },
    eligibility: {
      academic: '50% in 10+2 with PCB',
      minimum_marks: '50% in PCB',
      neet_required: true,
      age_requirement: 'Minimum 17 Years'
    },
    faqs: [
      { question: 'Do Indian passport holders need a visa for Nepal?', answer: 'No visa is required for Indian citizens entering or studying in Nepal.' }
    ]
  },
  kazakhstan: {
    _id: 'kazakhstan',
    name: 'Kazakhstan',
    slug: 'kazakhstan',
    code: 'kz',
    flag_url: 'https://flagcdn.com/w80/kz.png',
    hero_image: '/images/countries/kazakhstan.jpg',
    banner_image: '/images/countries/kazakhstan.jpg',
    hero_video: 'https://intermost-media-uploads.s3.ap-southeast-2.amazonaws.com/static/video/video/kazakhstan/kazakhstan.mp4',
    overview: {
      title: 'Why Study MBBS in Kazakhstan?',
      description: 'Kazakhstan offers 5-year MBBS programs in WHO & NMC approved medical institutes with low tuition fees and affordable living costs.',
      highlights: [
        { title: '5 Year Program', description: 'Complete MBBS in 5 years plus internship.' },
        { title: 'Low Living Expenses', description: 'Monthly living expenses under $150.' },
        { title: 'NMC & WHO Approved', description: 'Recognized by major global medical councils.' }
      ]
    },
    course_details: {
      duration: '5.5 Years',
      medium: 'English',
      degree_awarded: 'MD',
      recognition: ['NMC', 'WHO']
    },
    pricing: {
      tuition_fee: '$3,500 - $4,500 / Year',
      hostel_fee: '$600 - $1,200 / Year',
      total_course_fee: 'Starting from $3,500 / Year',
      currency: 'USD'
    },
    eligibility: {
      academic: '50% in 10+2 PCB',
      minimum_marks: '50%',
      neet_required: true,
      age_requirement: 'Minimum 17 Years'
    },
    faqs: []
  },
  tajikistan: {
    _id: 'tajikistan',
    name: 'Tajikistan',
    slug: 'tajikistan',
    code: 'tj',
    flag_url: 'https://flagcdn.com/w80/tj.png',
    hero_image: '/images/countries/tajikistan.jpg',
    banner_image: '/images/countries/tajikistan.jpg',
    hero_video: 'https://intermost-media-uploads.s3.ap-southeast-2.amazonaws.com/static/video/video/tajikistan/tajikistan.mp4',
    overview: {
      title: 'Why Study MBBS in Tajikistan?',
      description: 'Tajikistan offers affordable medical education with peaceful atmosphere and government recognized universities.',
      highlights: [
        { title: 'Affordable Fees', description: 'Tuition starting from $3,000 per year.' },
        { title: 'NMC & WHO Listed', description: 'Globally valid medical degree.' }
      ]
    },
    course_details: {
      duration: '5.5 Years',
      medium: 'English',
      degree_awarded: 'MD',
      recognition: ['NMC', 'WHO']
    },
    pricing: {
      tuition_fee: '$3,000 - $4,000 / Year',
      hostel_fee: '$600 - $1,000 / Year',
      total_course_fee: 'Starting from $3,000 / Year',
      currency: 'USD'
    },
    eligibility: {
      academic: '50% in 10+2 PCB',
      minimum_marks: '50%',
      neet_required: true,
      age_requirement: 'Minimum 17 Years'
    },
    faqs: []
  }
};

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  const canonicalUrl = `https://intermost.in/countries/${slug}`;
  try {
    const country = await countriesApi.getBySlug(slug);
    const countryName = country.name || slug.toUpperCase();
    return {
      title: country.seo?.title || `MBBS in ${countryName} 2026 - Fees, NMC Recognition & Admission | Intermost`,
      description: country.seo?.description || `Study MBBS in ${countryName} at WHO & NMC approved universities. Complete fee structure, NEET cutoff, eligibility, and admission process for Indian students.`,
      keywords: country.seo?.keywords?.join(', ') || `MBBS in ${countryName}, MBBS in ${countryName} fees, NMC approved universities in ${countryName}, NEET cutoff for MBBS in ${countryName}`,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'en-IN': `https://intermost.in/countries/${slug}`,
          'en': `https://intermost.eu/countries/${slug}`,
        },
      },
      openGraph: {
        title: country.seo?.title || `MBBS in ${countryName} | Intermost`,
        description: country.seo?.description || `Study MBBS in ${countryName}`,
        url: canonicalUrl,
        images: [country.banner_image || country.hero_image || '/images/og-default.jpg'],
      },
    };
  } catch {
    const fallback = fallbackCountriesMap[slug];
    if (fallback) {
      return {
        title: `MBBS in ${fallback.name} 2026 - Fees & NMC Recognition | Intermost`,
        description: `Study MBBS in ${fallback.name} at NMC & WHO approved medical universities. Fees, eligibility, and NEET guidelines.`,
        alternates: {
          canonical: canonicalUrl,
        },
      };
    }
    return {
      title: 'Country Not Found | Intermost Study Abroad',
    };
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const slug = params.slug.toLowerCase();
  
  let country: Country | null = null;
  let colleges: any[] = [];

  try {
    country = await countriesApi.getBySlug(slug);
  } catch (error) {
    console.warn(`Failed to fetch country '${slug}' from API, using fallback data.`, error);
  }

  // If API failed or returned null, try static fallback map
  if (!country) {
    const fallback = fallbackCountriesMap[slug];
    if (fallback) {
      country = fallback as Country;
    }
  }

  if (!country) {
    notFound();
  }

  try {
    colleges = await collegesApi.getByCountry(slug);
  } catch {
    colleges = [];
  }

  return (
    <>
      {country.faqs && country.faqs.length > 0 && (
        <JsonLdSchema type="FAQPage" data={country.faqs} />
      )}
      <CountryDetail country={country} colleges={colleges} />
    </>
  );
}
