'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Shield, Award, CheckCircle2 } from 'lucide-react';

const recognitions = [
  {
    name: 'WHO',
    fullName: 'World Health Organization',
    description: 'Globally recognized medical standards',
    logo: '/images/logo/WHo.png',
  },
  {
    name: 'NMC',
    fullName: 'National Medical Commission',
    description: 'India\'s medical education authority',
    logo: '/images/logo/NMC.jpg',
  },
  {
    name: 'WFME',
    fullName: 'World Federation for Medical Education',
    description: 'International quality assurance',
    logo: '/images/logo/WFME-logo.png',
  },
  {
    name: 'ECFMG',
    fullName: 'Educational Commission for Foreign Medical Graduates',
    description: 'US medical certification pathway',
    logo: '/images/logo/ecfmg.png',
  },
  {
    name: 'FAIMER',
    fullName: 'Foundation for Advancement of International Medical Education',
    description: 'Medical education research',
    logo: '/images/logo/faimer.png',
  },
];

const trustFactors = [
  { icon: Shield, text: '100% Safe & Secure Admissions' },
  { icon: Award, text: 'NMC & WHO Approved Universities' },
  { icon: CheckCircle2, text: 'Transparent Fee Structure' },
];

export default function RecognitionSection() {
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
        </motion.div>

        {/* Recognition Logos - Scrolling Marquee */}
        <div className="relative">
          {/* Gradient fade on sides */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          
          {/* Scrolling container */}
          <div className="flex animate-marquee">
            {/* First set */}
            <div className="flex space-x-12 items-center px-6">
              {recognitions.map((item, index) => (
                <motion.div
                  key={`first-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 group hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-white/70 backdrop-blur-lg border border-white/50 shadow-md hover:shadow-lg hover:border-primary-200/40 transition-all duration-300 p-6 w-48 h-48 flex flex-col items-center justify-center rounded-xl group-hover:-translate-y-1">
                    <div className="relative w-20 h-20 mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-xl">{item.name}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-xs text-center mt-1 line-clamp-2">{item.fullName}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex space-x-12 items-center px-6">
              {recognitions.map((item, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 group hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-white/70 backdrop-blur-lg border border-white/50 shadow-md hover:shadow-lg hover:border-primary-200/40 transition-all duration-300 p-6 w-48 h-48 flex flex-col items-center justify-center rounded-xl group-hover:-translate-y-1">
                    <div className="relative w-20 h-20 mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-xl">{item.name}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-xs text-center mt-1 line-clamp-2">{item.fullName}</p>
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
              <factor.icon className="w-5 h-5 text-green-500 relative z-10" />
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
