'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Shield, Award, CheckCircle2 } from 'lucide-react';
import { getS3AssetUrl } from '@/lib/utils';

const recognitions = [
  {
    name: 'WHO',
    fullName: 'World Health Organization',
    description: 'Globally recognized medical standards',
    logo: getS3AssetUrl('images/logo/WHo.png'),
  },
  {
    name: 'NMC',
    fullName: 'National Medical Commission',
    description: 'India\'s medical education authority',
    logo: getS3AssetUrl('images/logo/NMC.jpg'),
  },
  {
    name: 'WFME',
    fullName: 'World Federation for Medical Education',
    description: 'International quality assurance',
    logo: getS3AssetUrl('images/logo/WFME-logo.png'),
  },
  {
    name: 'ECFMG',
    fullName: 'Educational Commission for Foreign Medical Graduates',
    description: 'US medical certification pathway',
    logo: getS3AssetUrl('images/logo/ecfmg.png'),
  },
  {
    name: 'FAIMER',
    fullName: 'Foundation for Advancement of International Medical Education',
    description: 'Medical education research',
    logo: getS3AssetUrl('images/logo/faimer.png'),
  },
];

const trustFactors = [
  { icon: Shield, text: 'Trusted & Transparent Admission Guidance' },
  { icon: Award, text: 'NMC & WHO Approved Universities' },
  { icon: CheckCircle2, text: 'Transparent Fee Structure' },
];

export default function RecognitionSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Trusted Globally
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Our <span className="text-primary-600">Recognitions</span>
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
            All partner universities are recognized by leading international medical education bodies
          </p>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Resume recognitions animation" : "Pause recognitions animation"}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-300 shadow-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              {isPaused ? '▶ Resume Marquee' : '❚❚ Pause Marquee'}
            </button>
          </div>
        </motion.div>

        {/* Recognition Logos - Scrolling Marquee */}
        <div className="relative marquee-mask">
          {/* Scrolling container */}
          <div className={`flex animate-marquee ${isPaused ? '[animation-play-state:paused]' : ''}`}>
            {/* First set */}
            <div className="flex space-x-10 items-center px-6">
              {recognitions.map((item, index) => (
                <motion.div
                  key={`first-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex-shrink-0 group transition-all duration-300"
                >
                  <div className="bg-white/80 backdrop-blur-lg border border-gray-200/60 border-t-2 border-t-primary-500/30 shadow-sm hover:shadow-xl hover:border-primary-300/50 transition-all duration-300 p-5 w-52 h-44 flex flex-col items-center justify-center rounded-2xl group-hover:-translate-y-1">
                    <div className="relative w-24 h-16 mb-2 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-50 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">{item.name}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-base mt-1">{item.name}</h3>
                    <p className="text-gray-500 text-[11px] font-medium text-center line-clamp-1">{item.fullName}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex space-x-10 items-center px-6">
              {recognitions.map((item, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 group transition-all duration-300"
                >
                  <div className="bg-white/80 backdrop-blur-lg border border-gray-200/60 border-t-2 border-t-primary-500/30 shadow-sm hover:shadow-xl hover:border-primary-300/50 transition-all duration-300 p-5 w-52 h-44 flex flex-col items-center justify-center rounded-2xl group-hover:-translate-y-1">
                    <div className="relative w-24 h-16 mb-2 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-50 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">{item.name}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-base mt-1">{item.name}</h3>
                    <p className="text-gray-500 text-[11px] font-medium text-center line-clamp-1">{item.fullName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          {trustFactors.map((factor, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-white/70 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-white/50 relative overflow-hidden group hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <factor.icon className="w-5 h-5 text-green-500 relative z-10" aria-hidden="true" />
              <span className="text-gray-700 font-medium relative z-10">{factor.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Add marquee animation styles */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
