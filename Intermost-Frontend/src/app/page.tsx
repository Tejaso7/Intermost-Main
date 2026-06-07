import Hero from '@/components/home/Hero';
import NewsSection from '@/components/home/NewsSection';
import CountriesSection from '@/components/home/CountriesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsSection from '@/components/home/StatsSection';
import RecognitionSection from '@/components/home/RecognitionSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <NewsSection />
      <CountriesSection />
      <WhyChooseUs />
      <StatsSection />
      <RecognitionSection />
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
    </>
  );
}
