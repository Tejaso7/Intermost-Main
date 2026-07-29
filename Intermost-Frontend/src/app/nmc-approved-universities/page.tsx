import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, CheckCircle, AlertTriangle, FileText, ExternalLink, HelpCircle } from 'lucide-react';
import JsonLdSchema from '@/components/seo/JsonLdSchema';

export const metadata: Metadata = {
  title: 'NMC Approved Medical Universities Checklist 2026 | Intermost Study Abroad',
  description:
    'Complete guide and verification checklist for Indian students studying MBBS abroad according to National Medical Commission (NMC) regulations & NExT guidelines.',
  alternates: {
    canonical: 'https://intermost.in/nmc-approved-universities',
  },
};

const nmcCriteria = [
  {
    title: '54 Months Minimum Course Duration',
    description: 'The MBBS course duration must be at least 54 months (4.5 years) excluding internship.',
  },
  {
    title: '12 Months Mandatory Internship in Host Country',
    description: 'Students must complete 12 months of clinical internship in the same foreign medical institution.',
  },
  {
    title: '100% English Medium Instruction',
    description: 'The entire course syllabus and clinical examination must be conducted in English.',
  },
  {
    title: 'License to Practice in Host Country',
    description: 'The degree must grant full license and registration to practice medicine in the country of study.',
  },
  {
    title: 'NMC / FMGE / NExT Eligibility',
    description: 'Must be qualified in NEET-UG in the year of admission or preceding 2 years.',
  },
];

const faqs = [
  {
    question: 'How do I check if a foreign medical university is NMC compliant?',
    answer: 'Verify that the university adheres to the NMC Foreign Medical Graduate Licentiate (FMGL) Regulations 2021: 54 months duration, 12 months internship in the same university, English medium instruction, and license to practice in host country.',
  },
  {
    question: 'Is NEET qualification mandatory for studying MBBS abroad?',
    answer: 'Yes, NEET qualification is 100% mandatory for Indian citizens seeking MBBS admission in foreign medical universities to be eligible for FMGE/NExT screening.',
  },
  {
    question: 'What happens if I study at a non-NMC compliant university?',
    answer: 'Degrees from non-compliant universities will not be recognized in India, making the graduate ineligible to appear for NExT / FMGE or practice medicine in India.',
  },
];

export default function NmcChecklistPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <JsonLdSchema type="FAQPage" data={faqs} />
      <JsonLdSchema type="Organization" />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-800 to-secondary-600 text-white relative">
        <div className="container-custom relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase mb-4 border border-white/20">
            <Shield className="w-4 h-4 text-green-400" />
            NMC Compliance & Verification
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            NMC Approved Universities Checklist
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto">
            Essential guidelines and official checklist for Indian NEET students and parents researching foreign medical universities.
          </p>
        </div>
      </section>

      {/* Checklist Content */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          {/* Advisory Alert */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-2xl mb-12 shadow-sm">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-900 text-lg">NMC Advisory Notice for Students & Parents</h3>
                <p className="text-amber-800 text-sm mt-1 leading-relaxed">
                  The National Medical Commission (NMC) advises all Indian students to verify university compliance with FMGL Regulations 2021 before paying fees. Always request written verification of course duration and clinical internship details.
                </p>
              </div>
            </div>
          </div>

          {/* Criteria Cards */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            5 Key NMC Gazette Rules (FMGL Regulations)
          </h2>
          <div className="space-y-4 mb-12">
            {nmcCriteria.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Verification CTA */}
          <div className="bg-white p-8 rounded-3xl border border-primary-200 shadow-lg text-center space-y-4 mb-12">
            <h3 className="text-xl font-bold text-gray-900">Need University Verification Help?</h3>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">
              Our expert counselors evaluate university syllabi, clinical hospital attachments, and FMGL compliance to ensure your degree is 100% valid in India.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 justify-center">
              <Link href="/apply" className="btn-primary">
                Request Free Verification
              </Link>
              <Link href="/compare" className="btn-outline">
                Compare Universities
              </Link>
            </div>
          </div>

          {/* FAQs */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions by Parents
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary-600 shrink-0" />
                  {faq.question}
                </h4>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
