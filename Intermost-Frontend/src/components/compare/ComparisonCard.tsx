'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  DollarSign, 
  Clock, 
  GraduationCap, 
  CheckCircle2, 
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';

export interface CountryData {
  _id: string;
  name: string;
  slug: string;
  code?: string;
  flag_url: string;
  pricing: {
    tuition_fee: string;
    hostel_fee: string;
    living_cost: string;
    total_course_fee: string;
    currency: string;
  };
  eligibility: {
    academic: string;
    minimum_marks: string;
    neet_required: boolean;
    age_requirement: string;
    other_requirements?: string[];
  };
  course_details: {
    duration: string;
    medium: string;
    degree_awarded: string;
    recognition: string[];
  };
  advantages: string[];
}

interface ComparisonCardProps {
  country: CountryData;
  accentGradient: string;
  buttonGradient: string;
  hoverColor: string;
  initialX?: number;
  initialY?: number;
}

export default function ComparisonCard({
  country,
  accentGradient,
  buttonGradient,
  hoverColor,
  initialX = 0,
  initialY = 0
}: ComparisonCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: initialX, y: initialY }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col hover:border-slate-300 transition-all group w-[85vw] sm:w-[360px] md:w-auto flex-shrink-0 snap-center"
    >
      <div className={`w-full h-1 bg-gradient-to-r ${accentGradient} rounded-full mb-6`} />
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-12 h-8 rounded shadow-sm overflow-hidden flex-shrink-0 border border-slate-100">
          <img src={country.flag_url} alt={country.name} className="object-cover w-full h-full" />
        </div>
        <div>
          <h3 className={`text-2xl font-bold text-slate-900 ${hoverColor} transition-colors`}>
            MBBS in {country.name}
          </h3>
          <span className="text-xs text-slate-500 font-semibold tracking-wider">Premium Destination</span>
        </div>
      </div>

      <div className="space-y-6 flex-grow">
        {/* Fees & Budget */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-primary-600 font-semibold mb-3">
            <DollarSign className="w-4 h-4" aria-hidden="true" />
            <span>FEES & BUDGET</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-500">Total Tuition Fee:</span> <span className="font-bold text-slate-900">{country.pricing.total_course_fee}</span></li>
            <li className="flex justify-between"><span className="text-slate-500">Tuition Fee:</span> <span className="text-slate-700">{country.pricing.tuition_fee}</span></li>
            <li className="flex justify-between"><span className="text-slate-500">Hostel Fee:</span> <span className="text-slate-700">{country.pricing.hostel_fee}</span></li>
            <li className="flex justify-between"><span className="text-slate-500">Avg. Living Cost:</span> <span className="text-slate-700">{country.pricing.living_cost}</span></li>
          </ul>
        </div>

        {/* Course Structure */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-3">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>COURSE STRUCTURE</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-500">Course Duration:</span> <span className="font-semibold text-slate-800">{country.course_details.duration}</span></li>
            <li className="flex justify-between"><span className="text-slate-500">Medium of Study:</span> <span className="font-semibold text-slate-800">{country.course_details.medium}</span></li>
            <li className="flex justify-between"><span className="text-slate-500">Degree Conferred:</span> <span className="font-semibold text-slate-800 text-right">{country.course_details.degree_awarded}</span></li>
          </ul>
        </div>

        {/* Eligibility Requirements */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-violet-600 font-semibold mb-3">
            <GraduationCap className="w-4 h-4" aria-hidden="true" />
            <span>ELIGIBILITY REQUIREMENTS</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between items-center"><span className="text-slate-500">NEET Required:</span> <span className="font-semibold flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Yes</span></li>
            <li className="flex justify-between"><span className="text-slate-500">Min. PCB Marks:</span> <span className="font-semibold text-slate-800">{country.eligibility.minimum_marks}</span></li>
            <li className="flex justify-between"><span className="text-slate-500">Age Requirement:</span> <span className="font-semibold text-slate-800 text-right">{country.eligibility.age_requirement}</span></li>
          </ul>
        </div>

        {/* Global Recognition */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-3">
            <Award className="w-4 h-4" aria-hidden="true" />
            <span>GLOBAL RECOGNITION</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {country.course_details.recognition.map((rec: string) => (
              <span key={rec} className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                {rec.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Pros & Highlights */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-orange-600 font-semibold mb-3">
            <Zap className="w-4 h-4" aria-hidden="true" />
            <span>PROS & HIGHLIGHTS</span>
          </div>
          <ul className="space-y-2">
            {country.advantages.slice(0, 3).map((adv: string, idx: number) => (
              <li key={idx} className="flex gap-2 items-start text-xs text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100">
        <Link 
          href={`/apply?country=${encodeURIComponent(country.name)}`}
          className={`w-full py-3 bg-gradient-to-r ${buttonGradient} text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.02]`}
        >
          <span>Apply for {country.name}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
}
