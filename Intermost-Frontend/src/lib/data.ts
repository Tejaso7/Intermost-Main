// Comprehensive data from intermost.in

// ============================================
// COUNTRIES DATA
// ============================================

export interface University {
  name: string;
  description: string;
  tuition: string;
  hostelMess: string;
  otherCost?: string;
  website?: string;
  location?: string;
  image: string;
  recognition: string[];
  isTopRated?: boolean;
}

export interface CountryData {
  id: string;
  name: string;
  slug: string;
  code: string;
  flagUrl: string;
  heroImage: string;
  tagline: string;
  duration: string;
  degreeAwarded: string;
  medium: string;
  tuitionRange: string;
  eligibility: string[];
  benefits: string[];
  universities: University[];
  faqs: { question: string; answer: string }[];
  recognition: string[];
}

export const countriesData: CountryData[] = [
  {
    id: '1',
    name: 'Russia',
    slug: 'russia',
    code: 'ru',
    flagUrl: '/flags/russia.png',
    heroImage: '/images/countries/russia.jpg',
    tagline: 'World-class medical education with global recognition at affordable costs.',
    duration: '6 Years',
    degreeAwarded: 'MD',
    medium: 'English',
    tuitionRange: '$4,000–6,000/year',
    eligibility: [
      '10+2 with Physics, Chemistry, Biology',
      'Minimum 50% marks in PCB',
      'NEET qualification mandatory',
      'Minimum age: 17 years by December 31st'
    ],
    benefits: [
      'Globally Recognized - NMC and WHO approved degrees',
      'English Medium - No language barrier for Indian students',
      'Affordable - Low tuition fees compared to India',
      'Safe Environment - Friendly for international students'
    ],
    universities: [
      {
        name: 'Bashkir State Medical University',
        description: 'One of the oldest medical institutions in Russia with global recognition.',
        tuition: '$4,000–6,000/year',
        hostelMess: '$600–1,200/year',
        website: 'https://bashgmu.ru/en/',
        location: 'Ufa, Russia',
        image: '/images/russia/bashkir.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'Moscow Engineering Physics Institute (MEPhI)',
        description: 'Known for its excellence in engineering and medicine, offering world-class education.',
        tuition: '$4,000–6,000/year',
        hostelMess: '$600–1,200/year',
        website: 'https://mephi.ru/',
        location: 'Moscow, Russia',
        image: '/images/russia/mas.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'Ryazan State Medical University',
        description: 'Offers high-quality medical education with strong clinical exposure.',
        tuition: '$4,000–6,000/year',
        hostelMess: '$600–1,200/year',
        website: 'https://en.rsma.ru/',
        location: 'Ryazan, Russia',
        image: '/images/russia/rya.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'Yaroslavl State Medical University',
        description: 'One of the oldest medical institutions in Russia with global recognition.',
        tuition: '$4,000–6,000/year',
        hostelMess: '$600–1,200/year',
        website: 'https://ysmu.in/',
        location: 'Yaroslavl Oblast, Russia',
        image: '/images/russia/yaro.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'North Caucasian State Academy',
        description: 'One of the oldest medical institutions in Russia with global recognition.',
        tuition: '$4,000–6,000/year',
        hostelMess: '$600–1,200/year',
        website: 'https://ncsa.ru/en/',
        location: 'Karachay-Cherkessia, Russia',
        image: '/images/russia/north.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'Ivanovo State Medical University',
        description: 'One of the oldest medical institutions in Russia with global recognition.',
        tuition: '$4,000–6,000/year',
        hostelMess: '$600–1,200/year',
        website: 'https://www.ivgmu.com/',
        location: 'Ivanovo Oblast, Russia',
        image: '/images/russia/iva.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'Voronezh State Medical University',
        description: 'Offers excellent infrastructure and research facilities for aspiring doctors.',
        tuition: '$4,000–6,000/year',
        hostelMess: '$600–1,200/year',
        website: 'https://vsmu.ru/',
        location: 'Voronezh, Russia',
        image: '/images/russia/var.jpg',
        recognition: ['NMC', 'WHO']
      }
    ],
    faqs: [
      {
        question: 'Is MBBS from Russia valid in India?',
        answer: 'Yes, MBBS degrees from NMC-approved Russian medical universities are valid in India. After completing your degree, you need to clear the Foreign Medical Graduates Examination (FMGE) to practice in India.'
      },
      {
        question: 'What is the duration of MBBS in Russia?',
        answer: 'The MBBS program in Russia typically lasts for 6 years, which includes 5 years of academic study and 1 year of internship.'
      },
      {
        question: 'Is NEET required for MBBS in Russia?',
        answer: 'Yes, since 2018, NEET qualification is mandatory for Indian students who wish to pursue MBBS abroad, including in Russia.'
      }
    ],
    recognition: ['NMC', 'WHO']
  },
  {
    id: '2',
    name: 'Georgia',
    slug: 'georgia',
    code: 'ge',
    flagUrl: '/flags/georgia.png',
    heroImage: '/images/countries/georgia.jpg',
    tagline: 'European standard medical education in a safe and friendly environment.',
    duration: '6 Years',
    degreeAwarded: 'MD',
    medium: 'English',
    tuitionRange: '$4,800–8,000/year',
    eligibility: [
      'PCB minimum 50%',
      'NEET Qualified (2023/2024/2025)',
      'Valid Passport minimum for 1 Year'
    ],
    benefits: [
      'Globally Recognized - NMC and WHO approved degrees',
      'English Medium - No language barrier',
      'European Education Standard',
      'USMLE Preparation available',
      'Safe Environment'
    ],
    universities: [
      {
        name: 'Caucasus University',
        description: 'Private university in Tbilisi offering NMC-approved MBBS with modern facilities.',
        tuition: '$5,500/year',
        hostelMess: '$2,500–3,000/year',
        otherCost: '$200 – TRC & Documentation',
        image: '/images/georgia/caucasus.jpg',
        recognition: ['NMC', 'FAIMER', 'USMLE', 'WFME', 'ECFMG', 'WHO'],
        isTopRated: true
      },
      {
        name: 'East European University',
        description: 'Focus on practical medical training with international partnerships.',
        tuition: '$5,500/year',
        hostelMess: '$2,500–3,000/year',
        otherCost: '$200 – TRC & Documentation',
        image: '/images/georgia/east.jpg',
        recognition: ['NMC', 'FAIMER', 'USMLE', 'WFME', 'ECFMG', 'WHO']
      },
      {
        name: 'International Black Sea University',
        description: 'Focus on practical medical training with international partnerships.',
        tuition: '$4,800/year',
        hostelMess: '$2,500–3,000/year',
        otherCost: '$200 – TRC & Documentation',
        image: '/images/georgia/gnuu.webp',
        recognition: ['NMC', 'FAIMER', 'USMLE', 'WFME', 'ECFMG', 'WHO']
      },
      {
        name: 'Alte University',
        description: 'Affordable English-medium MBBS program with strong clinical exposure.',
        tuition: '$5,500/year',
        hostelMess: '$2,500–3,000/year',
        otherCost: '$200 – TRC & Documentation',
        image: '/images/georgia/altee.jpg',
        recognition: ['NMC', 'FAIMER', 'USMLE', 'WFME', 'ECFMG', 'WHO']
      },
      {
        name: 'Georgian National University (SEU)',
        description: 'Modern infrastructure with European-standard medical education.',
        tuition: '$5,500/year',
        hostelMess: '$2,500–3,000/year',
        otherCost: '$200 – TRC & Documentation',
        image: '/images/georgia/gnu.jpg',
        recognition: ['NMC', 'FAIMER', 'USMLE', 'WFME', 'ECFMG', 'WHO']
      },
      {
        name: 'Batumi International University',
        description: 'Coastal university with modern campus and international faculty.',
        tuition: '$4,800/year',
        hostelMess: '$2,500–3,000/year',
        otherCost: '$200 – TRC & Documentation',
        image: '/images/georgia/bau.jpg',
        recognition: ['NMC', 'FAIMER', 'USMLE', 'WFME', 'ECFMG', 'WHO']
      },
      {
        name: 'Tbilisi State Medical University',
        description: "Georgia's Biggest medical Universities offering European Standard.",
        tuition: '$8,000/year',
        hostelMess: '$2,500–3,000/year',
        otherCost: '$200 – TRC & Documentation',
        image: '/images/georgia/tib.jpg',
        recognition: ['NMC', 'FAIMER', 'USMLE', 'WFME', 'ECFMG', 'WHO']
      }
    ],
    faqs: [
      {
        question: 'What is the MBBS duration in Georgia?',
        answer: '6 years total duration (5 years academic + 1 year internship). Clinical training starts from 3rd year.'
      },
      {
        question: 'Is Georgia safe for Indian students?',
        answer: 'Yes, Georgia ranks among the safest countries in Europe. Universities provide 24/7 security on campus.'
      },
      {
        question: 'What is the medium of instruction?',
        answer: 'All NMC-approved universities teach entirely in English. Local language classes are optional.'
      },
      {
        question: 'Can I practice in India after graduation?',
        answer: 'Yes, after clearing FMGE/NExT exam. Georgian degrees are recognized by NMC and WHO.'
      }
    ],
    recognition: ['NMC', 'WHO', 'WFME', 'ECFMG', 'FAIMER', 'USMLE']
  },
  {
    id: '3',
    name: 'Uzbekistan',
    slug: 'uzbekistan',
    code: 'uz',
    flagUrl: '/flags/uzbekistan.png',
    heroImage: '/images/countries/uzbekistan.jpg',
    tagline: 'Affordable medical education with rich cultural experience in the heart of Central Asia.',
    duration: '6 Years',
    degreeAwarded: 'MD',
    medium: 'English',
    tuitionRange: '$3,500/year',
    eligibility: [
      '10+2 with Physics, Chemistry, Biology',
      'Minimum 50% marks in PCB',
      'NEET qualification',
      'Minimum age: 17 years by December 31st'
    ],
    benefits: [
      'Low Tuition Fees',
      'Safe Environment',
      'USMLE & NEXT Preparation',
      'English Medium instruction'
    ],
    universities: [
      {
        name: 'Andijan State Medical University',
        description: 'Established in 1955, offering quality medical education with global recognition.',
        tuition: '$3,500–4,500/year',
        hostelMess: '$3,000/year',
        website: 'http://www.adti.uz/',
        location: 'Yu. Otabekov 1, Andijan city',
        image: '/images/uzbekistan/uz1.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'Tashkent State Medical University',
        description: 'Prestigious university located in the capital city, known for its strong academic curriculum.',
        tuition: '$3,500–4,500/year',
        hostelMess: '$3,000/year',
        website: 'https://tma.uz/en/',
        location: 'Tashkent',
        image: '/images/uzbekistan/uz2.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'Samarkand State Medical Institute',
        description: 'Historic university offering modern medical education in a culturally rich city.',
        tuition: '$3,500–4,500/year',
        hostelMess: '$3,000/year',
        website: 'https://www.sammu.uz/en',
        location: 'Samarkand',
        image: '/images/uzbekistan/uz3.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'Bukhara State Medical Institute',
        description: 'Known for its traditional values and modern teaching techniques in a UNESCO World Heritage City.',
        tuition: '$3,500–4,500/year',
        hostelMess: '$3,000/year',
        website: 'https://bsmiuz.com/',
        location: 'Bukhara',
        image: '/images/uzbekistan/uz4.jpg',
        recognition: ['NMC', 'WHO']
      },
      {
        name: 'Fergana Medical Institute of Public Health',
        description: 'Specializes in public health and preventive medicine programs.',
        tuition: '$3,500–4,500/year',
        hostelMess: '$3,000/year',
        website: 'https://www.fmiph.uz/',
        location: 'Fergana',
        image: '/images/uzbekistan/uz5.jpg',
        recognition: ['NMC', 'WHO']
      }
    ],
    faqs: [
      {
        question: 'Is MBBS from Uzbekistan valid in India?',
        answer: 'Yes, MBBS degrees from NMC-approved Uzbekistani medical universities are valid in India. After completing your degree, you need to clear the Foreign Medical Graduates Examination (FMGE) to practice in India.'
      },
      {
        question: 'What is the duration of MBBS in Uzbekistan?',
        answer: 'The MBBS program in Uzbekistan typically lasts for 6 years, which includes 5 years of academic study and 1 year of internship.'
      },
      {
        question: 'Is NEET required for MBBS in Uzbekistan?',
        answer: 'Yes, since 2018, NEET qualification is mandatory for Indian students who wish to pursue MBBS abroad, including in Uzbekistan.'
      }
    ],
    recognition: ['NMC', 'WHO']
  },
  {
    id: '4',
    name: 'Nepal',
    slug: 'nepal',
    code: 'np',
    flagUrl: '/flags/nepal.png',
    heroImage: '/images/countries/nepal.jpg',
    tagline: 'Quality medical education with no language barrier and same Indian curriculum.',
    duration: '5.5 Years',
    degreeAwarded: 'MBBS',
    medium: 'English',
    tuitionRange: '₹50-65 Lakhs (Full Course)',
    eligibility: [
      'Minimum 50% marks in each subject: Physics, Chemistry, and Biology in 10+2 (Current Year)',
      'NEET Passed mandatory 50 percentile',
      'Minimum 17 Year age'
    ],
    benefits: [
      'NMC Approved',
      'No Language Barrier',
      'Same Indian Curriculum',
      'Close to India - Easy travel'
    ],
    universities: [
      {
        name: 'Devdaha Medical College & Research Institute Pvt.Ltd',
        description: 'Premier medical institution with international collaborations and modern facilities.',
        tuition: '₹50 Lakh (Full Course) - ₹25 Lakh 1st installment',
        hostelMess: '₹10-12 Lakh (Full Course)',
        image: '/images/nepal/dev.jpg',
        recognition: ['NMC', 'WHO'],
        isTopRated: true
      },
      {
        name: 'B&C Medical College Teaching Hospital & Research Center',
        description: "Nepal's oldest university with 60+ Years of medical education legacy.",
        tuition: '₹55 Lakh (Full Course) - ₹25 Lakh 1st installment',
        hostelMess: '₹10-12 Lakh (Full Course)',
        image: '/images/nepal/bc.jpg',
        recognition: ['NMC', 'MEC']
      },
      {
        name: 'Chitwan Medical College & Hospital',
        description: 'Focus on community medicine and practical healthcare training.',
        tuition: '₹60 Lakh (Full Course) - ₹25 Lakh 1st installment, Discount ₹3 Lakh if 200+ marks in NEET',
        hostelMess: '₹2.75-3 Lakh (Full Course)',
        image: '/images/nepal/chitwan.jpg',
        recognition: ['NMC', 'FAIMER']
      },
      {
        name: 'Kathmandu Medical College & Hospital',
        description: 'Focus on community medicine and practical healthcare training.',
        tuition: '₹50 Lakh (Full Course) - ₹25 Lakh 1st installment',
        hostelMess: '₹8-10 Lakh (Full Course)',
        image: '/images/nepal/kat.jpg',
        recognition: ['NMC', 'FAIMER']
      },
      {
        name: 'Janaki Medical College & Teaching Hospital',
        description: 'Focus on community medicine and practical healthcare training.',
        tuition: '₹5-8 Lakh (Full Course) - ₹25 Lakh 1st installment',
        hostelMess: '₹2.5-3 Lakh (Full Course)',
        image: '/images/nepal/janaki.jpg',
        recognition: ['NMC', 'FAIMER']
      }
    ],
    faqs: [
      {
        question: 'Is NEET required for MBBS in Nepal?',
        answer: 'Yes, NEET qualification is mandatory for Indian students seeking admission in Nepalese medical colleges.'
      },
      {
        question: 'What is the duration of MBBS in Nepal?',
        answer: 'The MBBS program in Nepal spans 5.5 Years (4.5 Years academic + 1 Year internship).'
      },
      {
        question: 'Are Nepalese degrees valid in India?',
        answer: 'Yes, degrees from NMC-approved colleges are valid. Graduates need to clear FMGE to practice in India.'
      }
    ],
    recognition: ['NMC']
  },
  {
    id: '5',
    name: 'Kazakhstan',
    slug: 'kazakhstan',
    code: 'kz',
    flagUrl: '/flags/kazakhstan.png',
    heroImage: '/images/countries/kazakhstan.jpg',
    tagline: 'Affordable medical education with NMC approval and Indian food available.',
    duration: '5.5 Years',
    degreeAwarded: 'MD',
    medium: 'English',
    tuitionRange: '$3,700–6,383/year',
    eligibility: [
      '50% in PCB in 10+2',
      'NEET qualification mandatory',
      'Minimum 17 years age'
    ],
    benefits: [
      'NMC Approved',
      'Affordable & Safe',
      'Indian Food Available',
      'English Medium'
    ],
    universities: [
      {
        name: 'Al-Farabi Kazakh National University',
        description: 'Focus on community medicine and practical healthcare training.',
        tuition: '$4,681/year',
        hostelMess: '$600–800/year + Mess $120/month',
        otherCost: '$250 Registration',
        image: '/images/Kazakhstan/alf.jpg',
        recognition: ['NMC', 'FAIMER']
      },
      {
        name: 'Kazakh National Medical University',
        description: 'Focus on community medicine and practical healthcare training.',
        tuition: '$6,383/year',
        hostelMess: '$800–1,200/year + Mess $120/month',
        otherCost: '$250 Registration',
        image: '/images/Kazakhstan/kazak.jpg',
        recognition: ['NMC', 'FAIMER']
      },
      {
        name: 'Kazakh-Russian Medical University',
        description: 'Focus on community medicine and practical healthcare training.',
        tuition: '$4,500/year',
        hostelMess: '$800–900/year + Mess $120/month',
        otherCost: '$250 Registration',
        image: '/images/Kazakhstan/kaz-r.jpg',
        recognition: ['NMC', 'FAIMER']
      },
      {
        name: 'West Kazakhstan Marat Ospanov State Medical University',
        description: 'Focus on community medicine and practical healthcare training.',
        tuition: '$3,700/year',
        hostelMess: '$600–800/year + Mess $120/month',
        otherCost: '$250 Registration',
        image: '/images/Kazakhstan/west.jpg',
        recognition: ['NMC', 'FAIMER']
      }
    ],
    faqs: [
      {
        question: 'Is NEET required for MBBS in Kazakhstan?',
        answer: 'Yes, NEET qualification is mandatory for Indian students seeking admission in Kazakhstan medical colleges.'
      },
      {
        question: 'What is the duration of MBBS in Kazakhstan?',
        answer: 'The MBBS program in Kazakhstan spans 5.5 years (4.5 years academic + 1 year internship).'
      },
      {
        question: 'Are Kazakhstani degrees valid in India?',
        answer: 'Yes, degrees from NMC-approved colleges are valid. Graduates need to clear FMGE to practice in India.'
      }
    ],
    recognition: ['NMC', 'WHO']
  },
  {
    id: '6',
    name: 'Tajikistan',
    slug: 'tajikistan',
    code: 'tj',
    flagUrl: '/flags/tajikistan.png',
    heroImage: '/images/countries/tajikistan.jpg',
    tagline: 'Affordable living with FMGE focused curriculum and English medium instruction.',
    duration: '5.5 Years',
    degreeAwarded: 'MD',
    medium: 'English',
    tuitionRange: '$3,000/year',
    eligibility: [
      '50% in PCB in 10+2',
      'NEET qualification mandatory',
      'Minimum 17 years age'
    ],
    benefits: [
      'Affordable Living',
      'FMGE Focused',
      'English Medium',
      'Safe Environment'
    ],
    universities: [
      {
        name: 'Tajik National University',
        description: 'Premier medical institution with international collaborations and modern facilities.',
        tuition: '$6,000–7,000/year',
        hostelMess: '$1,200–1,500/year',
        image: '/images/tajik/tajik.jpg',
        recognition: ['NMC', 'WHO'],
        isTopRated: true
      }
    ],
    faqs: [
      {
        question: 'Is NEET required for MBBS in Tajikistan?',
        answer: 'Yes, NEET qualification is mandatory for Indian students seeking admission in Tajikistan medical colleges.'
      },
      {
        question: 'What is the duration of MBBS in Tajikistan?',
        answer: 'The MBBS program in Tajikistan spans 5.5 years (4.5 years academic + 1 year internship).'
      },
      {
        question: 'Are Tajikistan degrees valid in India?',
        answer: 'Yes, degrees from NMC-approved colleges are valid. Graduates need to clear FMGE to practice in India.'
      }
    ],
    recognition: ['NMC', 'WHO']
  }
];

// ============================================
// TEAM MEMBERS DATA
// ============================================

export interface TeamMember {
  name: string;
  designation: string;
  region: string;
  phone: string;
  image?: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Mr. Nilesh Kulkarni',
    designation: 'President of Intermost India',
    region: 'India',
    phone: '+91 91583 74434',
    image: '/images/team/nilesh.jpg'
  },
  {
    name: 'Mr. Vinay Singh',
    designation: 'Uttar Pradesh Head',
    region: 'Uttar Pradesh, India',
    phone: '+91 90585 01818',
    image: '/images/team/vinay.jpg'
  },
  {
    name: 'Dr. Nikhil Chauhan',
    designation: 'Punjab - Himachal Pradesh Head',
    region: 'Punjab & Himachal Pradesh, India',
    phone: '+91 98880 13647',
    image: '/images/team/nikhil.jpg'
  },
  {
    name: 'Dr. Mohit Gurra',
    designation: 'Haryana Head',
    region: 'Haryana, India',
    phone: '+91 88140 47009',
    image: '/images/team/mohit.jpg'
  },
  {
    name: 'Dr. Dibya Giri Ranjan',
    designation: 'Odisha Head',
    region: 'Odisha, India',
    phone: '+91 97763 63007',
    image: '/images/team/dibya.jpg'
  },
  {
    name: 'Dr. Nilutpal Mondal',
    designation: 'West Bengal Head',
    region: 'West Bengal, India',
    phone: '+91 96352 20301',
    image: '/images/team/nilutpal.jpg'
  },
  {
    name: 'Dr. Rahul Gautam',
    designation: 'Delhi-NCR Head',
    region: 'Delhi-NCR, India',
    phone: '+91 98375 33887',
    image: '/images/team/rahul.jpg'
  }
];

// ============================================
// ALUMNI DATA
// ============================================

export interface Alumni {
  name: string;
  university: string;
  batch: string;
  testimonial: string;
  currentRole?: string;
  image: string;
}

export const alumniData: Alumni[] = [
  {
    name: 'Dr. Priyanka',
    university: 'Dnipro State',
    batch: '2018',
    testimonial: "Intermost made my dream of studying medicine abroad come true. Their guidance from application to visa was impeccable. The university has excellent facilities and clinical exposure.",
    currentRole: 'Graduated from International Medical University, Bishkek, Kyrgyzstan, currently doing internship. FMGE 2024',
    image: '/images/dr/priya.jpg'
  },
  {
    name: 'Dr. Zainab',
    university: 'Dnipro State',
    batch: '2024',
    testimonial: "Studying in Ukraine through Intermost was the best decision. Their team helped me with every step, even after arrival. The quality of medical education here is world-class at a fraction of Indian private college costs.",
    currentRole: 'Recently cleared FMGE exam in first attempt.',
    image: '/images/dr/zainab.jpg'
  },
  {
    name: 'Dr. Sumant',
    university: 'Dnipro State',
    batch: '2020',
    testimonial: "The affordable fees and excellent clinical exposure in Dnipro were exactly what I needed. Intermost's local support team in Ukraine made the transition smooth. I'm grateful for their honest counseling.",
    currentRole: 'Pass FMGE Exam: 2020, MBBS MD (Physician) DSMU PG Resident 3rd year at MS Orthopedics Mahatma Gandhi Memorial Govt Medical College and Hospital, Jamshedpur',
    image: '/images/dr/sumant.jpg'
  },
  {
    name: 'Vishal Srivastava',
    university: 'Alte University',
    batch: '2024',
    testimonial: "The support I received made everything easier—from the admission process to settling abroad. I'm grateful to be pursuing my dream at Alte University.",
    currentRole: 'Lala Lajpat Rai Hospital (Hallett Hospital)',
    image: '/images/dr/vishal.jpg'
  },
  {
    name: 'Shubhangi',
    university: 'SEU',
    batch: '2025',
    testimonial: "Choosing SEU was a turning point in my career. Thankful for the transparent and smooth guidance I received through every step.",
    image: '/images/dr/shubhangi.jpg'
  },
  {
    name: 'Dr. Abinash',
    university: 'DSMA',
    batch: '2018',
    testimonial: "My FMGE journey was successful thanks to solid guidance and preparation. Working as a GDMO now has been a fulfilling experience in public service.",
    currentRole: '2019 FMGE Passed, GDMO at PHC (N) Dengausta, Ganjam, Odisha since 2021',
    image: '/images/dr/abinash.jpg'
  },
  {
    name: 'Dr. Lalit',
    university: 'Dnipro State',
    batch: '2020',
    testimonial: "Medical education in Ukraine shaped me into the professional I am today. I'm currently working as a surgery resident and pursuing specialization.",
    currentRole: 'Resident - General Surgery, Metro Hospital Faridabad',
    image: '/images/dr/lalit.jpg'
  },
  {
    name: 'Dr. Sandeep',
    university: 'Mari State',
    batch: '2021',
    testimonial: "Studying in Russia gave me solid clinical exposure. I'm proud to now serve patients back home in Rajasthan as part of a reputed hospital.",
    currentRole: 'PARAS Hospital, Tapukhara Bhiwadi, Rajasthan',
    image: '/images/dr/sandeep.jpg'
  },
  {
    name: 'Dr. Amit',
    university: 'Andijan State',
    batch: '2024',
    testimonial: "The journey through Andijan State Medical University has been truly transformative. The support from Intermost ensured a smooth process throughout.",
    image: '/images/dr/amit.jpg'
  }
];

// ============================================
// OFFICE LOCATIONS DATA
// ============================================

export interface Office {
  name: string;
  type: 'head' | 'regional';
  address: string;
  phone: string;
  email: string;
  country: string;
  image_url?: string;
}

export const offices: Office[] = [
  {
    name: 'UAE Head Office',
    type: 'head',
    address: 'Ekam Marketing and Innovation Solutions FZ-LLC, UAE',
    phone: '+971 542183166',
    email: 'admissionintermost@gmail.com',
    country: 'UAE'
  },
  {
    name: 'India Head Office - Agra',
    type: 'head',
    address: 'Shop no -1, First floor, Vinayak Mall, Deewani Crossing (Lotus Hospital Building), M G Road Agra, 282002 (U.P), India',
    phone: '+91 9058501818',
    email: 'admissionintermost@gmail.com',
    country: 'India'
  },
  {
    name: 'India Delhi Office',
    type: 'regional',
    address: '3 G.F., B.D Chamber, 10/54, Desh Bandhu Gupta Road, Karol Bagh, New Delhi - 110005',
    phone: '+91 9837533887',
    email: 'admissionintermost@gmail.com',
    country: 'India'
  },
  {
    name: 'India Kerala Office',
    type: 'regional',
    address: 'C/O KlickEdu, 1st Floor, MS Building, behind New Theatre, Aristo, Thampanoor, Thiruvananthapuram, Kerala, 695012',
    phone: '+91 8111996000',
    email: 'admissionintermost@gmail.com',
    country: 'India'
  },
  {
    name: 'India Jodhpur Office',
    type: 'regional',
    address: 'C/O H.K.Hi-Tech College 4-7, Above Reliance Smart Point, Main PAL Road Jodhpur-342008',
    phone: '+91 6367644472',
    email: 'admissionintermost@gmail.com',
    country: 'India'
  }
];

// ============================================
// RECOGNITIONS DATA
// ============================================

export interface Recognition {
  name: string;
  fullName: string;
  logo: string;
}

export const recognitions: Recognition[] = [
  { name: 'WHO', fullName: 'World Health Organization', logo: '/images/logo/WHo.png' },
  { name: 'WFME', fullName: 'World Federation for Medical Education', logo: '/images/logo/WFME-logo.png' },
  { name: 'ECFMG', fullName: 'Educational Commission for Foreign Medical Graduates', logo: '/images/logo/ecfmg.png' },
  { name: 'FAIMER', fullName: 'Foundation for Advancement of International Medical Education and Research', logo: '/images/logo/faimer.png' },
  { name: 'USMLE', fullName: 'United States Medical Licensing Examination', logo: '/images/logo/usmle.png' },
  { name: 'NMC', fullName: 'National Medical Commission', logo: '/images/logo/NMC.jpg' }
];

// ============================================
// NEWS/EVENTS DATA
// ============================================

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  image?: string;
  type: 'seminar' | 'opening' | 'general';
}

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: '15th June - Seminar in Panipat',
    date: '2025-06-15',
    description: 'We Invite you all to join our program for MBBS Abroad EXPO.',
    location: 'Arya Bal Bharti Public School, GT Road, Panipat, India',
    image: '/images/news/panipat.jpg',
    type: 'seminar'
  },
  {
    id: '2',
    title: '14th June - Seminar Kolkata',
    date: '2025-06-14',
    description: 'A Seminar at Kolkata Connecting for Future of the Student to go Abroad.',
    location: 'Hotel Hindusthan International, Kolkata, India',
    image: '/images/kalkata/1.jpg',
    type: 'seminar'
  },
  {
    id: '3',
    title: '27th May - Seminar Lucknow MBBS',
    date: '2025-05-27',
    description: 'Students registered for abroad studies.',
    location: 'Lucknow, India',
    image: '/images/news/lucknow.jpg',
    type: 'seminar'
  },
  {
    id: '4',
    title: '23rd May - ERA University Lucknow',
    date: '2025-05-23',
    description: 'A Team of members from ERA University Lucknow Connecting for Future of the Student to go Abroad.',
    location: 'Lucknow, India',
    image: '/images/kanpur/team.jpg',
    type: 'seminar'
  },
  {
    id: '5',
    title: '18th May - Grand Opening In India',
    date: '2025-05-18',
    description: 'A major initiative is underway in Agra with the establishment of a new office, featuring the involvement of top-tier members.',
    location: 'Agra, India',
    image: '/images/news/new1.jpg',
    type: 'opening'
  }
];

// ============================================
// STATS DATA
// ============================================

export const stats = {
  studentsPlaced: '5953+',
  partnerUniversities: '35+',
  yearsExperience: '21+',
  visaSuccessRate: '99%'
};

// ============================================
// WHY CHOOSE US DATA
// ============================================

export const whyChooseUs = [
  {
    title: 'Recognized Partners',
    description: 'Official representatives of top medical universities recognized by WHO, MCI, and other global medical councils.',
    icon: 'Award'
  },
  {
    title: 'Affordable Education',
    description: 'Low tuition fees starting at ₹1.5 lakh per semester with options for easy installment payments.',
    icon: 'Wallet'
  },
  {
    title: 'Personalized Support',
    description: 'Dedicated counselors for each student from application to graduation and beyond.',
    icon: 'Users'
  },
  {
    title: 'Global Network',
    description: 'Strong presence in multiple countries ensuring smooth transition and ongoing support.',
    icon: 'Globe'
  }
];

// ============================================
// COMPANY INFO
// ============================================

export const companyInfo = {
  name: 'Intermost Study Abroad',
  legalName: 'Intermost Ventures LLP',
  uaeEntity: 'Ekam Marketing and Innovation Solutions FZ-LLC',
  tagline: 'Your trusted partner for global medical education since 2004.',
  phone: '+91 9058501818',
  whatsapp: '+91 9158374434',
  email: 'admissionintermost@gmail.com',
  social: {
    facebook: 'https://www.facebook.com/intermoststudyabroad',
    instagram: 'https://www.instagram.com/intermoststudyabroad/',
    youtube: 'http://www.youtube.com/@IntermostStudyAbroad',
    whatsapp: 'https://wa.me/919158374434'
  },
  websites: ['https://www.intermost.eu', 'https://www.intermost.in'],
  officeHours: 'Monday to Saturday: 9:30 AM - 6:30 PM',
  globalPresence: ['UAE', 'India', 'Georgia', 'Ukraine', 'Uzbekistan'],
  organizations: [
    { country: 'India', name: 'Intermost Ventures (Agra)' },
    { country: 'UAE', name: 'Ekam Marketing and Innovation Solutions FZ-LLC, UAE' },
    { country: 'Georgia', name: 'DSA-ISM joint Venture LLC, Georgia' },
    { country: 'Ukraine', name: 'PE "Intermost" Company, Ukraine' },
    { country: 'Uzbekistan', name: '"KONARK PHARM" LLC FE, Uzbekistan' }
  ]
};

// ============================================
// JOURNEY STEPS
// ============================================

export const journeySteps = [
  {
    step: 1,
    title: 'Counseling & Selection',
    description: 'Our expert counselors guide you in selecting the perfect medical university based on your academic profile, budget, and career aspirations.'
  },
  {
    step: 2,
    title: 'Admission Process',
    description: 'We handle all documentation, university applications, and entrance procedures to ensure smooth admission to your chosen medical program.'
  },
  {
    step: 3,
    title: 'Clinical Excellence',
    description: 'Gain hands-on experience with state-of-the-art facilities and expert faculty, preparing you for a successful medical career worldwide.'
  }
];

// ============================================
// MISSION & VISION
// ============================================

export const aboutContent = {
  mission: "At Intermost Ventures, we're committed to transforming medical education by connecting aspiring doctors with world-class institutions. Our mission is to empower the next generation of healthcare professionals through accessible, high-quality global education.",
  vision: "To be the premier gateway for medical education abroad, recognized for our integrity, expertise, and commitment to student success in the global healthcare community.",
  globalPresence: "With strategic offices in UAE, India, Georgia, Ukraine and Uzbekistan, we serve students across South Asia, Middle East, and Africa, providing end-to-end support for their medical education journey."
};
