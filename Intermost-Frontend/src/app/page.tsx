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
      <NewsSection />
      <CountriesSection />
      <PlacementsMapSection />
      <WhyChooseUs />
      <StatsSection />
      <RecognitionSection />
      <TestimonialsSection />
      <GlimpseGallerySection />
      <YouTubeShortsSection />
      <CTASection />
      <ContactSection />
    </>
  );
}
