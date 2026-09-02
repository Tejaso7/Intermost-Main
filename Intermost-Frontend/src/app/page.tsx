'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import NewsSection from '@/components/home/NewsSection';
import CountriesSection from '@/components/home/CountriesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsSection from '@/components/home/StatsSection';
import { coreApi, SectionVisibility } from '@/lib/services';

const RecognitionSection = dynamic(() => import('@/components/home/RecognitionSection'), { ssr: true });
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), { ssr: true });
const GlimpseGallerySection = dynamic(() => import('@/components/home/GlimpseGallerySection'), { ssr: true });
const YouTubeShortsSection = dynamic(() => import('@/components/home/YouTubeShortsSection'), { ssr: true });
const CTASection = dynamic(() => import('@/components/home/CTASection'), { ssr: true });
const ContactSection = dynamic(() => import('@/components/home/ContactSection'), { ssr: true });

export default function Home() {
  const [visibility, setVisibility] = useState<SectionVisibility>({
    hero: true,
    news: true,
    countries: true,
    why_choose_us: true,
    stats: true,
    recognition: true,
    testimonials: true,
    glimpses: true,
    shorts: true,
    cta: true,
    contact: true
  });

  useEffect(() => {
    coreApi.getSettings().then((settings) => {
      if (settings?.section_visibility) {
        setVisibility((prev) => ({ ...prev, ...settings.section_visibility }));
      }
    }).catch((err) => console.error('Failed to load section settings:', err));
  }, []);

  return (
    <>
      {visibility.hero !== false && <Hero />}

      {visibility.news !== false && (
        <>
          {/* Wave Divider */}
          <div className="relative -mt-1">
            <svg aria-hidden="true" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
              <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="currentColor" className="text-gray-50" />
            </svg>
          </div>
          <NewsSection />
        </>
      )}

      {visibility.countries !== false && (
        <>
          {/* Wave Divider */}
          <div className="relative -mt-1">
            <svg aria-hidden="true" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
              <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="currentColor" className="text-white" />
            </svg>
          </div>
          <CountriesSection />
        </>
      )}

      {visibility.why_choose_us !== false && <WhyChooseUs />}
      {visibility.stats !== false && <StatsSection />}

      {visibility.recognition !== false && (
        <>
          {/* Wave Divider */}
          <div className="relative -mt-1">
            <svg aria-hidden="true" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
              <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="currentColor" className="text-gray-50" />
            </svg>
          </div>
          <RecognitionSection />
        </>
      )}

      {visibility.testimonials !== false && <TestimonialsSection />}
      {visibility.glimpses !== false && <GlimpseGallerySection />}
      {visibility.shorts !== false && <YouTubeShortsSection />}
      {visibility.cta !== false && <CTASection />}
      {visibility.contact !== false && <ContactSection />}
    </>
  );
}
