'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Globe, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  BookOpen, 
  Compass, 
  Award,
  Zap,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { countriesApi } from '@/lib/services';
import { getCountryFlag } from '@/lib/utils';
import toast from 'react-hot-toast';

// Comprehensive fallback static data for countries
const fallbackCountriesData = [
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
      '100% visa success rate and simple process',
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
  },
  {
    _id: 'nepal-id',
    name: 'Nepal',
    slug: 'nepal',
    code: 'NP',
    flag_url: 'https://flagcdn.com/w80/np.png',
    pricing: {
      tuition_fee: '₹45,00,000 - 55,00,000 (Total Package)',
      hostel_fee: 'Included in package or ₹8,000/Month',
      living_cost: '₹10,000 / Month',
      total_course_fee: '₹50 - 60 Lakhs',
      currency: 'INR'
    },
    eligibility: {
      academic: '12th Standard with PCB (minimum 50% in PCB)',
      minimum_marks: '50% aggregate in 12th PCB',
      neet_required: true,
      age_requirement: 'Minimum 17 years of age',
      other_requirements: ['Passport or Voter Card', 'Nepal Medical Council Entrance (MECEE) is required if NEET qualified score is low']
    },
    course_details: {
      duration: '5.5 Years (including internship)',
      medium: 'English & Hindi',
      degree_awarded: 'MBBS',
      recognition: ['NMC', 'WHO', 'Nepal Medical Council', 'FAIMER', 'ECFMG']
    },
    advantages: [
      'No passport or visa required for Indian students',
      'Same syllabus, books, and study pattern as India',
      'Indian doctors teaching in several top colleges',
      'Excellent clinical exposure due to identical patient demographics',
      'Hindi/Nepali spoken widely, no local language barrier'
    ]
  },
  {
    _id: 'kazakhstan-id',
    name: 'Kazakhstan',
    slug: 'kazakhstan',
    code: 'KZ',
    flag_url: 'https://flagcdn.com/w80/kz.png',
    pricing: {
      tuition_fee: '₹3,00,000 / Year',
      hostel_fee: '₹45,000 / Year',
      living_cost: '₹9,000 / Month',
      total_course_fee: '₹18 - 25 Lakhs',
      currency: 'INR'
    },
    eligibility: {
      academic: '12th PCB with 50% marks',
      minimum_marks: '50% for General, 40% for Reserved',
      neet_required: true,
      age_requirement: 'Must be 17 years by Dec 31st',
      other_requirements: ['Valid Passport', 'Apostilled educational certificates']
    },
    course_details: {
      duration: '5 Years',
      medium: 'English Medium',
      degree_awarded: 'MD (Equivalent to MBBS)',
      recognition: ['NMC', 'WHO', 'Ministry of Education & Science, Kazakhstan', 'FAIMER', 'ECFMG']
    },
    advantages: [
      'Shorter course duration (5 Years) saving tuition & hostel expenses',
      'Fully English-taught programs recognized globally',
      'Modern learning centers and highly qualified professors',
      'Favorable student-to-teacher ratio in labs',
      'Affordable direct flights from major Indian cities'
    ]
  }
];

export default function CountryComparisonPage() {
  const [countries, setCountries] = useState<any[]>(fallbackCountriesData);
  const [col1Country, setCol1Country] = useState<string>('russia');
  const [col2Country, setCol2Country] = useState<string>('georgia');
  const [col3Country, setCol3Country] = useState<string>(''); // Optional third country
  const [loading, setLoading] = useState<boolean>(true);

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<'col1' | 'col2' | 'col3' | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await countriesApi.getAll({ active: true });
        if (data && data.length > 1) {
          // Map API data structure to our comparison dashboard structure
          const mapped = data.map((c: any) => ({
            _id: c._id || c.id,
            name: c.name,
            slug: c.slug,
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
          
          // Set initial selectors to first two fetched countries if available
          if (mapped[0]) setCol1Country(mapped[0].slug);
          if (mapped[1]) setCol2Country(mapped[1].slug);
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
    setOpenDropdown(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 overflow-hidden relative">
      {/* Premium Decorative Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-secondary-600/15 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Decision Helper
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-primary-400 bg-clip-text text-transparent mb-6"
          >
            Compare MBBS Destinations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg leading-relaxed"
          >
            Analyze global medical courses side-by-side. Compare total fees, eligibility, course duration, and global university recognition lists instantly.
          </motion.p>
        </div>

        {/* Dropdown selectors row */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 md:p-6 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Column 1 Selector */}
            <div className="relative">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Column 1 Country</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'col1' ? null : 'col1')}
                className="w-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-3 rounded-xl flex items-center justify-between transition-all"
              >
                {c1 ? (
                  <div className="flex items-center gap-3">
                    <span className="relative w-6 h-4 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={c1.flag_url} alt={c1.name} className="object-cover w-full h-full" />
                    </span>
                    <span className="font-semibold text-slate-200">MBBS in {c1.name}</span>
                  </div>
                ) : (
                  <span className="text-slate-500">Select Country</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === 'col1' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'col1' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-20 left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto"
                  >
                    {countries.map(c => (
                      <button
                        key={c.slug}
                        onClick={() => handleSelectCountry('col1', c.slug)}
                        className={`w-full text-left px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 flex items-center gap-3 transition-colors ${col1Country === c.slug ? 'bg-primary-950/40 text-primary-400' : 'text-slate-300'}`}
                      >
                        <span className="relative w-6 h-4 rounded-sm overflow-hidden flex-shrink-0">
                          <img src={c.flag_url} alt={c.name} className="object-cover w-full h-full" />
                        </span>
                        <span>MBBS in {c.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Column 2 Selector */}
            <div className="relative">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Column 2 Country</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'col2' ? null : 'col2')}
                className="w-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-3 rounded-xl flex items-center justify-between transition-all"
              >
                {c2 ? (
                  <div className="flex items-center gap-3">
                    <span className="relative w-6 h-4 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={c2.flag_url} alt={c2.name} className="object-cover w-full h-full" />
                    </span>
                    <span className="font-semibold text-slate-200">MBBS in {c2.name}</span>
                  </div>
                ) : (
                  <span className="text-slate-500">Select Country</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === 'col2' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'col2' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-20 left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto"
                  >
                    {countries.map(c => (
                      <button
                        key={c.slug}
                        onClick={() => handleSelectCountry('col2', c.slug)}
                        className={`w-full text-left px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 flex items-center gap-3 transition-colors ${col2Country === c.slug ? 'bg-primary-950/40 text-primary-400' : 'text-slate-300'}`}
                      >
                        <span className="relative w-6 h-4 rounded-sm overflow-hidden flex-shrink-0">
                          <img src={c.flag_url} alt={c.name} className="object-cover w-full h-full" />
                        </span>
                        <span>MBBS in {c.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Column 3 Selector (Optional) */}
            <div className="relative">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Column 3 Country (Optional)</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'col3' ? null : 'col3')}
                  className="w-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-3 rounded-xl flex items-center justify-between transition-all"
                >
                  {c3 ? (
                    <div className="flex items-center gap-3">
                      <span className="relative w-6 h-4 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={c3.flag_url} alt={c3.name} className="object-cover w-full h-full" />
                      </span>
                      <span className="font-semibold text-slate-200">MBBS in {c3.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">Add Country to Compare</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === 'col3' ? 'rotate-180' : ''}`} />
                </button>
                {c3 && (
                  <button
                    onClick={() => {
                      setCol3Country('');
                      setOpenDropdown(null);
                    }}
                    className="px-3 bg-red-950/40 border border-red-900/40 text-red-400 rounded-xl hover:bg-red-900/60 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <AnimatePresence>
                {openDropdown === 'col3' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-20 left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto"
                  >
                    {countries.map(c => (
                      <button
                        key={c.slug}
                        onClick={() => handleSelectCountry('col3', c.slug)}
                        className={`w-full text-left px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 flex items-center gap-3 transition-colors ${col3Country === c.slug ? 'bg-primary-950/40 text-primary-400' : 'text-slate-300'}`}
                      >
                        <span className="relative w-6 h-4 rounded-sm overflow-hidden flex-shrink-0">
                          <img src={c.flag_url} alt={c.name} className="object-cover w-full h-full" />
                        </span>
                        <span>MBBS in {c.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Comparison grid dashboard */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Column 1 Card */}
            {c1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-2xl flex flex-col hover:border-slate-700 transition-all group"
              >
                {/* Brand glowing line */}
                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-8 rounded shadow-sm overflow-hidden flex-shrink-0">
                    <img src={c1.flag_url} alt={c1.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">MBBS in {c1.name}</h3>
                    <span className="text-xs text-slate-400 font-semibold tracking-wider">Premium Destination</span>
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                  {/* Category: Pricing */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-primary-400 font-semibold mb-3">
                      <DollarSign className="w-4 h-4" />
                      <span>FEES & BUDGET</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between"><span className="text-slate-400">Total Course Fee:</span> <span className="font-bold text-white">{c1.pricing.total_course_fee}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Tuition Fee:</span> <span className="text-slate-200">{c1.pricing.tuition_fee}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Hostel Fee:</span> <span className="text-slate-200">{c1.pricing.hostel_fee}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Avg. Living Cost:</span> <span className="text-slate-200">{c1.pricing.living_cost}</span></li>
                    </ul>
                  </div>

                  {/* Category: Course Details */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-3">
                      <Clock className="w-4 h-4" />
                      <span>COURSE STRUCTURE</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between"><span className="text-slate-400">Course Duration:</span> <span className="font-semibold text-slate-200">{c1.course_details.duration}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Medium of Study:</span> <span className="font-semibold text-slate-200">{c1.course_details.medium}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Degree Conferred:</span> <span className="font-semibold text-slate-200 text-right">{c1.course_details.degree_awarded}</span></li>
                    </ul>
                  </div>

                  {/* Category: Eligibility */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-violet-400 font-semibold mb-3">
                      <GraduationCap className="w-4 h-4" />
                      <span>ELIGIBILITY REQUIREMENTS</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between items-center"><span className="text-slate-400">NEET Required:</span> <span className="font-semibold flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4" /> Yes</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Min. PCB Marks:</span> <span className="font-semibold text-slate-200">{c1.eligibility.minimum_marks}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Age Requirement:</span> <span className="font-semibold text-slate-200 text-right">{c1.eligibility.age_requirement}</span></li>
                    </ul>
                  </div>

                  {/* Category: Recognition */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">
                      <Award className="w-4 h-4" />
                      <span>GLOBAL RECOGNITION</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c1.course_details.recognition.map((rec: string) => (
                        <span key={rec} className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-xs font-semibold">
                          {rec.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Advantages list */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-orange-400 font-semibold mb-3">
                      <Zap className="w-4 h-4" />
                      <span>PROS & HIGHLIGHTS</span>
                    </div>
                    <ul className="space-y-2">
                      {c1.advantages.slice(0, 3).map((adv: string, idx: number) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80">
                  <Link 
                    href={`/apply?country=${c1.name}`}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all"
                  >
                    <span>Apply for {c1.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Column 2 Card */}
            {c2 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-2xl flex flex-col hover:border-slate-700 transition-all group"
              >
                {/* Brand glowing line */}
                <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-8 rounded shadow-sm overflow-hidden flex-shrink-0">
                    <img src={c2.flag_url} alt={c2.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">MBBS in {c2.name}</h3>
                    <span className="text-xs text-slate-400 font-semibold tracking-wider">Premium Destination</span>
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                  {/* Category: Pricing */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-primary-400 font-semibold mb-3">
                      <DollarSign className="w-4 h-4" />
                      <span>FEES & BUDGET</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between"><span className="text-slate-400">Total Course Fee:</span> <span className="font-bold text-white">{c2.pricing.total_course_fee}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Tuition Fee:</span> <span className="text-slate-200">{c2.pricing.tuition_fee}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Hostel Fee:</span> <span className="text-slate-200">{c2.pricing.hostel_fee}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Avg. Living Cost:</span> <span className="text-slate-200">{c2.pricing.living_cost}</span></li>
                    </ul>
                  </div>

                  {/* Category: Course Details */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-3">
                      <Clock className="w-4 h-4" />
                      <span>COURSE STRUCTURE</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between"><span className="text-slate-400">Course Duration:</span> <span className="font-semibold text-slate-200">{c2.course_details.duration}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Medium of Study:</span> <span className="font-semibold text-slate-200">{c2.course_details.medium}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Degree Conferred:</span> <span className="font-semibold text-slate-200 text-right">{c2.course_details.degree_awarded}</span></li>
                    </ul>
                  </div>

                  {/* Category: Eligibility */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-violet-400 font-semibold mb-3">
                      <GraduationCap className="w-4 h-4" />
                      <span>ELIGIBILITY REQUIREMENTS</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between items-center"><span className="text-slate-400">NEET Required:</span> <span className="font-semibold flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4" /> Yes</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Min. PCB Marks:</span> <span className="font-semibold text-slate-200">{c2.eligibility.minimum_marks}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Age Requirement:</span> <span className="font-semibold text-slate-200 text-right">{c2.eligibility.age_requirement}</span></li>
                    </ul>
                  </div>

                  {/* Category: Recognition */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">
                      <Award className="w-4 h-4" />
                      <span>GLOBAL RECOGNITION</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c2.course_details.recognition.map((rec: string) => (
                        <span key={rec} className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-xs font-semibold">
                          {rec.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Advantages list */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-orange-400 font-semibold mb-3">
                      <Zap className="w-4 h-4" />
                      <span>PROS & HIGHLIGHTS</span>
                    </div>
                    <ul className="space-y-2">
                      {c2.advantages.slice(0, 3).map((adv: string, idx: number) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80">
                  <Link 
                    href={`/apply?country=${c2.name}`}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    <span>Apply for {c2.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Column 3 Card */}
            {c3 ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-2xl flex flex-col hover:border-slate-700 transition-all group"
              >
                {/* Brand glowing line */}
                <div className="w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-8 rounded shadow-sm overflow-hidden flex-shrink-0">
                    <img src={c3.flag_url} alt={c3.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">MBBS in {c3.name}</h3>
                    <span className="text-xs text-slate-400 font-semibold tracking-wider">Premium Destination</span>
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                  {/* Category: Pricing */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-primary-400 font-semibold mb-3">
                      <DollarSign className="w-4 h-4" />
                      <span>FEES & BUDGET</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between"><span className="text-slate-400">Total Course Fee:</span> <span className="font-bold text-white">{c3.pricing.total_course_fee}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Tuition Fee:</span> <span className="text-slate-200">{c3.pricing.tuition_fee}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Hostel Fee:</span> <span className="text-slate-200">{c3.pricing.hostel_fee}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Avg. Living Cost:</span> <span className="text-slate-200">{c3.pricing.living_cost}</span></li>
                    </ul>
                  </div>

                  {/* Category: Course Details */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-3">
                      <Clock className="w-4 h-4" />
                      <span>COURSE STRUCTURE</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between"><span className="text-slate-400">Course Duration:</span> <span className="font-semibold text-slate-200">{c3.course_details.duration}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Medium of Study:</span> <span className="font-semibold text-slate-200">{c3.course_details.medium}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Degree Conferred:</span> <span className="font-semibold text-slate-200 text-right">{c3.course_details.degree_awarded}</span></li>
                    </ul>
                  </div>

                  {/* Category: Eligibility */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-violet-400 font-semibold mb-3">
                      <GraduationCap className="w-4 h-4" />
                      <span>ELIGIBILITY REQUIREMENTS</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between items-center"><span className="text-slate-400">NEET Required:</span> <span className="font-semibold flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4" /> Yes</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Min. PCB Marks:</span> <span className="font-semibold text-slate-200">{c3.eligibility.minimum_marks}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Age Requirement:</span> <span className="font-semibold text-slate-200 text-right">{c3.eligibility.age_requirement}</span></li>
                    </ul>
                  </div>

                  {/* Category: Recognition */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">
                      <Award className="w-4 h-4" />
                      <span>GLOBAL RECOGNITION</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c3.course_details.recognition.map((rec: string) => (
                        <span key={rec} className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-xs font-semibold">
                          {rec.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Advantages list */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2 text-orange-400 font-semibold mb-3">
                      <Zap className="w-4 h-4" />
                      <span>PROS & HIGHLIGHTS</span>
                    </div>
                    <ul className="space-y-2">
                      {c3.advantages.slice(0, 3).map((adv: string, idx: number) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80">
                  <Link 
                    href={`/apply?country=${c3.name}`}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all"
                  >
                    <span>Apply for {c3.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="hidden md:flex bg-slate-900/10 border-2 border-dashed border-slate-800/60 rounded-3xl p-6 items-center justify-center flex-col text-slate-500 h-full min-h-[400px]">
                <Globe className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
                <p className="font-medium">Choose a third country</p>
                <p className="text-xs text-slate-600 mt-1">Select from the dropdown above to compare three side-by-side</p>
              </div>
            )}

          </div>
        )}

        {/* Disclaimer / Guidance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 text-slate-400 text-xs md:text-sm flex gap-4 items-start"
        >
          <ShieldAlert className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="font-semibold text-slate-300 mb-1">Important Guidance for MBBS Students</p>
            <p className="leading-relaxed">
              All fees and figures mentioned above are approximate and subject to change based on university regulations, foreign exchange rates, and personal living expenses. Ensure you check and verify each university's specific requirements, official language mediums, and recognition under the National Medical Commission (NMC) guidelines before proceeding with any overseas admission.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
