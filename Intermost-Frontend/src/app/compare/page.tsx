'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  ShieldAlert, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { countriesApi } from '@/lib/services';
import { getCountryFlag } from '@/lib/utils';
import toast from 'react-hot-toast';
import ComparisonCard, { type CountryData } from '@/components/compare/ComparisonCard';

// Comprehensive fallback static data for countries
const fallbackCountriesData: CountryData[] = [
  {
    _id: 'russia-id',
    name: 'Russia',
    slug: 'russia',
    code: 'RU',
    flag_url: 'https://flagcdn.com/w80/ru.png',
    pricing: {
      tuition_fee: '₹3,50,000 / Year',
      hostel_fee: '₹50,000 / Year',
      living_cost: '₹10,000 / Month',
      total_course_fee: '₹22 - 30 Lakhs',
      currency: 'INR'
    },
    eligibility: {
      academic: '12th Standard with Physics, Chemistry & Biology',
      minimum_marks: '50% for General, 40% for SC/ST/OBC',
      neet_required: true,
      age_requirement: 'Minimum 17 years by Dec 31st of admission year',
      other_requirements: ['Valid Indian Passport', 'Medical fitness certificate']
    },
    course_details: {
      duration: '6 Years',
      medium: 'English Medium',
      degree_awarded: 'MD Physician (Equivalent to MBBS in India)',
      recognition: ['NMC (National Medical Commission)', 'WHO (World Health Organization)', 'Ministry of Education, Russia', 'FAIMER', 'ECFMG']
    },
    advantages: [
      'Extremely subsidized and affordable fee structure',
      'No donation or entrance test required',
      'High standard of living with globally recognized degrees',
      'Bilingual options and fully English courses',
      'Excellent clinical exposure in state hospitals'
    ]
  },
  {
    _id: 'georgia-id',
    name: 'Georgia',
    slug: 'georgia',
    code: 'GE',
    flag_url: 'https://flagcdn.com/w80/ge.png',
    pricing: {
      tuition_fee: '₹5,000 - 8,000 USD / Year',
      hostel_fee: '₹1,500 - 2,500 USD / Year',
      living_cost: '₹250 - 350 USD / Month',
      total_course_fee: '₹28 - 45 Lakhs',
      currency: 'INR'
    },
    eligibility: {
      academic: '10+2 with Physics, Chemistry & Biology',
      minimum_marks: '50% for all categories',
      neet_required: true,
      age_requirement: 'At least 17 years old by admission date',
      other_requirements: ['Valid Passport', 'Birth certificate in English']
    },
    course_details: {
      duration: '6 Years',
      medium: '100% English Medium',
      degree_awarded: 'MD (Equivalent to MBBS)',
      recognition: ['NMC', 'WHO', 'WFME (World Federation for Medical Education)', 'FAIMER', 'ECFMG', 'AMSE (Europe)']
    },
    advantages: [
      'European standard curriculum and lifestyle',
      'WFME recognition makes licensing exams in US/Europe easy',
      'Extremely safe country for international students',
      'High visa approval rate and streamlined process',
      'No language barrier - English is widely spoken in universities'
    ]
  },
  {
    _id: 'uzbekistan-id',
    name: 'Uzbekistan',
    slug: 'uzbekistan',
    code: 'UZ',
    flag_url: 'https://flagcdn.com/w80/uz.png',
    pricing: {
      tuition_fee: '₹2,50,000 / Year',
      hostel_fee: '₹40,000 / Year',
      living_cost: '₹8,000 / Month',
      total_course_fee: '₹16 - 22 Lakhs',
      currency: 'INR'
    },
    eligibility: {
      academic: 'Completed 12th with PCB stream',
      minimum_marks: '50% for General, 40% for Reserved',
      neet_required: true,
      age_requirement: 'Min 17 years by December 31st',
      other_requirements: ['Valid Passport', 'Negative HIV test certificate']
    },
    course_details: {
      duration: '6 Years',
      medium: 'English Medium',
      degree_awarded: 'MD (Equivalent to MBBS)',
      recognition: ['NMC', 'WHO', 'Ministry of Higher Education, Uzbekistan', 'FAIMER']
    },
    advantages: [
      'Highly affordable tuition fee structures',
      'Close proximity to India (only 3 hours flight)',
      'Similar climate and friendly culture',
      'Modern infrastructure and clinical labs',
      'Large community of Indian students already studying'
    ]
  }
];

export default function CountryComparisonPage() {
  const [countries, setCountries] = useState<CountryData[]>(fallbackCountriesData);
  const [col1Country, setCol1Country] = useState<string>('russia');
  const [col2Country, setCol2Country] = useState<string>('georgia');
  const [col3Country, setCol3Country] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await countriesApi.getAll({ active: true });
        if (data && data.length > 1) {
          const mapped: CountryData[] = data.map((c: any) => ({
            _id: c._id || c.id,
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
            code: c.code || 'UN',
            flag_url: c.flag_url || getCountryFlag(c.code || 'in'),
            pricing: {
              tuition_fee: c.pricing?.tuition_fee || 'Contact Us',
              hostel_fee: c.pricing?.hostel_fee || 'Contact Us',
              living_cost: c.pricing?.living_cost || 'Contact Us',
              total_course_fee: c.pricing?.total_course_fee || 'Contact Us',
              currency: c.pricing?.currency || 'INR'
            },
            eligibility: {
              academic: c.eligibility?.academic || '12th Standard with PCB',
              minimum_marks: c.eligibility?.minimum_marks || '50% in PCB',
              neet_required: c.eligibility?.neet_required !== false,
              age_requirement: c.eligibility?.age_requirement || '17+ years',
              other_requirements: c.eligibility?.other_requirements || ['Valid Passport']
            },
            course_details: {
              duration: c.course_details?.duration || '6 Years',
              medium: c.course_details?.medium || 'English Medium',
              degree_awarded: c.course_details?.degree_awarded || 'MD (Equivalent to MBBS)',
              recognition: c.course_details?.recognition || ['NMC', 'WHO']
            },
            advantages: c.advantages || ['Globally recognized degree', 'High quality education']
          }));
          setCountries(mapped);
          
          if (mapped[0]) setCol1Country(mapped[0].slug);
          if (mapped[1]) setCol2Country(mapped[1].slug);
        } else if (data && data.length === 1) {
          setCountries([
            ...data.map((c: any) => ({...c, slug: c.slug || c.name.toLowerCase()})),
            ...fallbackCountriesData.slice(0, 2)
          ]);
        }
      } catch (err) {
        console.debug('Failed to fetch dynamic country data, using premium fallbacks');
      } finally {
        setLoading(false);
      }
    };
    loadCountries();
  }, []);

  const getCountryBySlug = (slug: string) => {
    return countries.find(c => c.slug === slug) || null;
  };

  const c1 = getCountryBySlug(col1Country);
  const c2 = getCountryBySlug(col2Country);
  const c3 = col3Country ? getCountryBySlug(col3Country) : null;

  const handleSelectCountry = (column: 'col1' | 'col2' | 'col3', slug: string) => {
    if (!slug) {
      if (column === 'col3') setCol3Country('');
      return;
    }
    
    if (column === 'col1') {
      if (slug === col2Country || slug === col3Country) {
        toast.error('Country already selected in another column');
        return;
      }
      setCol1Country(slug);
    } else if (column === 'col2') {
      if (slug === col1Country || slug === col3Country) {
        toast.error('Country already selected in another column');
        return;
      }
      setCol2Country(slug);
    } else {
      if (slug === col1Country || slug === col2Country) {
        toast.error('Country already selected in another column');
        return;
      }
      setCol3Country(slug);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 overflow-hidden relative">
      {/* Decorative Light Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-secondary-200/40 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Decision Helper
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-primary-600 bg-clip-text text-transparent mb-6"
          >
            Compare MBBS Destinations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg leading-relaxed"
          >
            Analyze global medical courses side-by-side. Compare total fees, eligibility, course duration, and global university recognition lists instantly.
          </motion.p>
        </div>

        {/* Dropdown selectors row */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 md:p-6 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Column 1 Selector */}
            <div>
              <label htmlFor="col1-select" className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Column 1 Country
              </label>
              <div className="relative">
                <select
                  id="col1-select"
                  value={col1Country}
                  onChange={(e) => handleSelectCountry('col1', e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 pr-10 pl-4 py-3 rounded-xl transition-all appearance-none font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {countries.map(c => (
                    <option key={c.slug} value={c.slug}>MBBS in {c.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            {/* Column 2 Selector */}
            <div>
              <label htmlFor="col2-select" className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Column 2 Country
              </label>
              <div className="relative">
                <select
                  id="col2-select"
                  value={col2Country}
                  onChange={(e) => handleSelectCountry('col2', e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 pr-10 pl-4 py-3 rounded-xl transition-all appearance-none font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {countries.map(c => (
                    <option key={c.slug} value={c.slug}>MBBS in {c.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            {/* Column 3 Selector (Optional) */}
            <div>
              <label htmlFor="col3-select" className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Column 3 Country (Optional)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    id="col3-select"
                    value={col3Country}
                    onChange={(e) => handleSelectCountry('col3', e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 pr-10 pl-4 py-3 rounded-xl transition-all appearance-none font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select 3rd Country</option>
                    {countries.map(c => (
                      <option key={c.slug} value={c.slug}>MBBS in {c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                </div>
                {c3 && (
                  <button
                    type="button"
                    onClick={() => setCol3Country('')}
                    className="px-4 bg-red-50 border border-red-100 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="md:hidden flex items-center justify-center gap-2 mb-4 text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100 py-1.5 px-3 rounded-full w-fit mx-auto">
          <span>← Swipe horizontally to compare countries →</span>
        </div>

        {/* Comparison Dashboard (Horizontal Scrollable Table/Grid on Mobile) */}
        {loading ? (
          <div className="flex md:grid overflow-x-auto gap-6 pb-4 md:pb-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col space-y-6 animate-pulse h-[600px] w-[85vw] sm:w-[360px] md:w-auto shrink-0">
                <div className="w-full h-1 bg-slate-200 rounded-full" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-200 rounded shadow-sm shrink-0" />
                  <div className="space-y-2 flex-grow">
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-4 flex-grow">
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 rounded w-full" />
                      <div className="h-3 bg-slate-200 rounded w-5/6" />
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-slate-200 rounded-xl mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 pb-4 md:pb-0 relative scrollbar-thin">
            
            {/* Column 1 Card */}
            {c1 && (
              <ComparisonCard
                country={c1}
                accentGradient="from-blue-500 to-indigo-500"
                buttonGradient="from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                hoverColor="group-hover:text-primary-600"
                initialX={-20}
              />
            )}

            {/* Column 2 Card */}
            {c2 && (
              <ComparisonCard
                country={c2}
                accentGradient="from-purple-500 to-pink-500"
                buttonGradient="from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                hoverColor="group-hover:text-purple-600"
                initialY={20}
              />
            )}

            {/* Column 3 Card */}
            {c3 ? (
              <ComparisonCard
                country={c3}
                accentGradient="from-emerald-500 to-teal-500"
                buttonGradient="from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                hoverColor="group-hover:text-emerald-600"
                initialX={20}
              />
            ) : (
              <div className="hidden md:flex bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-6 items-center justify-center flex-col text-slate-500 h-full min-h-[400px]">
                <Globe className="w-12 h-12 text-slate-400 mb-4 animate-pulse" aria-hidden="true" />
                <p className="font-medium text-slate-600">Choose a third country</p>
                <p className="text-xs text-slate-500 mt-1">Select from the dropdown above to compare three side-by-side</p>
              </div>
            )}

          </div>
        )}

        {/* Disclaimer / Guidance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-slate-600 text-xs md:text-sm flex gap-4 items-start"
        >
          <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" aria-hidden="true" />
          <div>
            <p className="font-semibold text-slate-800 mb-1">Important Guidance for MBBS Students</p>
            <p className="leading-relaxed">
              All fees and figures mentioned above are approximate and subject to change based on university regulations, foreign exchange rates, and personal living expenses. Ensure you check and verify each university's specific requirements, official language mediums, and recognition under the National Medical Commission (NMC) guidelines before proceeding with any overseas admission.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
