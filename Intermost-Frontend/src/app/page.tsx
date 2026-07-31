import Hero from '@/components/home/Hero';
import NewsSection from '@/components/home/NewsSection';
import CountriesSection from '@/components/home/CountriesSection';
import PlacementsMapSection from '@/components/home/PlacementsMapSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsSection from '@/components/home/StatsSection';
import RecognitionSection from '@/components/home/RecognitionSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import GlimpseGallerySection from '@/components/home/GlimpseGallerySection';
import YouTubeShortsSection from '@/components/home/YouTubeShortsSection';
import CTASection from '@/components/home/CTASection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      {/* Wave Divider */}
      <div className="relative -mt-1">
        <svg aria-hidden="true" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="currentColor" className="text-gray-50" />
        </svg>
      </div>
      <NewsSection />
      {/* Wave Divider */}
      <div className="relative -mt-1">
        <svg aria-hidden="true" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="currentColor" className="text-white" />
        </svg>
      </div>
      <CountriesSection />
      <PlacementsMapSection />
      <WhyChooseUs />
      <StatsSection />
      {/* Wave Divider */}
      <div className="relative -mt-1">
        <svg aria-hidden="true" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="currentColor" className="text-gray-50" />
        </svg>
      </div>
      <RecognitionSection />
      <TestimonialsSection />
      <GlimpseGallerySection />
      <YouTubeShortsSection />
      <CTASection />
      <ContactSection />
    </>
  );
}
