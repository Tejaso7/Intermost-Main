'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ArrowRight, ChevronDown } from 'lucide-react';
import { scrollToElement } from '@/lib/utils';

export default function Hero() {
  // Video is not available, use static image
  const [videoError, setVideoError] = useState(true);

  const handleScrollDown = () => {
    scrollToElement('news-section', 100);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[70px] sm:pt-[80px] md:pt-[90px]">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/images/countries/russia.jpg"
            onError={() => setVideoError(true)}
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/countries/russia.jpg"
            alt="Medical Education"
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 shadow-lg text-xs sm:text-sm"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse shadow-lg shadow-green-400/50" />
            <span className="font-medium tracking-wide">Admissions Open for 2026</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight text-shadow-lg px-2"
          >
            Your Gateway to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 animate-gradient">Global Medical</span>{' '}
            Education
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto text-shadow leading-relaxed px-4"
          >
            Study MBBS at WHO & NMC approved universities in Russia, Georgia, 
            Uzbekistan, and more. Affordable fees, quality education, 
            guaranteed admissions.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 mb-12 max-w-4xl mx-auto px-2"
          >
            {[
              { value: '5500+', label: 'Students Placed' },
              { value: '35+', label: 'Partner Universities' },
              { value: '21+', label: 'Years Experience' },
              { value: '99%', label: 'Visa Success' },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-300 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
          >
            <Link
              href="/apply"
              className="btn-primary group shadow-xl shadow-primary-600/20 w-full sm:w-auto text-center"
            >
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/countries"
              className="btn-white shadow-xl w-full sm:w-auto text-center"
            >
              Explore Countries
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          onClick={handleScrollDown}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 hover:text-white transition-colors cursor-pointer group"
        >
          <span className="text-sm mb-2 group-hover:translate-y-1 transition-transform">Scroll Down</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.button>
      </div>

      {/* Floating Elements - Enhanced */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-40 right-20 w-36 h-36 bg-secondary-500/20 rounded-full blur-2xl animate-float-reverse" />
      <div className="absolute top-1/3 right-10 w-20 h-20 bg-purple-500/15 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 left-20 w-28 h-28 bg-cyan-500/15 rounded-full blur-xl animate-float-reverse" style={{ animationDelay: '1s' }} />
    </section>
  );
}
