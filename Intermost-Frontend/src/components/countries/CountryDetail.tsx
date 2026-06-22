'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clock,
  DollarSign,
  GraduationCap,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Play,
  MapPin,
  Phone,
  Building,
  Star,
  Shield,
  Users,
  Award,
} from 'lucide-react';
import type { Country, College } from '@/lib/api';
import { cn, createWhatsAppLink, getCountryFlag } from '@/lib/utils';

// Helper function to get country image fallback
const getCountryImage = (country: Country): string => {
  // If image exists and starts with /images/countries, it's a valid local image
  if (country.banner_image?.startsWith('/images/countries/')) return country.banner_image;
  if (country.hero_image?.startsWith('/images/countries/')) return country.hero_image;
  // Use fallback based on slug
  return `/images/countries/${country.slug}.jpg`;
};

// Remove hardcoded fallbacks as data is now dynamic

interface CountryDetailProps {
  country: Country;
  colleges: College[];
}

export default function CountryDetail({ country, colleges: propColleges }: CountryDetailProps) {
  const colleges = propColleges || [];
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const handleApplyNow = () => {
    const link = createWhatsAppLink(
      '919058501818',
      `Hi! I'm interested in MBBS in ${country.name}. Please provide more information.`
    );
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        {country.hero_video && showVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={country.hero_video} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={getCountryImage(country)}
            alt={`MBBS in ${country.name}`}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 hero-overlay" />

        {/* Content */}
        <div className="relative z-10 container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Flag */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-12 rounded-lg overflow-hidden shadow-lg mr-4">
                <Image
                  src={getCountryFlag(country.code)}
                  alt={`${country.name} flag`}
                  width={64}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <span className="text-primary-300 font-semibold">
                {country.course_details?.recognition?.join(' • ')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-shadow-lg">
              MBBS in {country.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {country.overview?.title || `Study Medicine in ${country.name}`}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 mr-2 text-primary-400" />
                <span>{country.course_details?.duration || '6 Years'}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <DollarSign className="w-5 h-5 mr-2 text-primary-400" />
                <span>{country.pricing?.total_course_fee || 'Contact Us'}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <GraduationCap className="w-5 h-5 mr-2 text-primary-400" />
                <span>{country.course_details?.medium || 'English Medium'}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handleApplyNow} className="btn-primary">
                Apply Now
              </button>
              {country.hero_video && (
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="btn-outline border-white text-white hover:bg-white hover:text-primary-600"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {showVideo ? 'Show Image' : 'Watch Video'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {country.overview?.title || `Why Study MBBS in ${country.name}?`}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {country.overview?.description}
              </p>

              {/* Highlights */}
              <div className="grid sm:grid-cols-2 gap-4">
                {country.overview?.highlights?.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {highlight.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Course Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">
                    {country.course_details?.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Medium</span>
                  <span className="font-semibold text-gray-900">
                    {country.course_details?.medium}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Degree</span>
                  <span className="font-semibold text-gray-900">
                    {country.course_details?.degree_awarded}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Tuition Fee</span>
                  <span className="font-semibold text-gray-900">
                    {country.pricing?.tuition_fee}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Hostel Fee</span>
                  <span className="font-semibold text-gray-900">
                    {country.pricing?.hostel_fee}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-900 font-semibold">Total Fee</span>
                  <span className="font-bold text-primary-600 text-xl">
                    {country.pricing?.total_course_fee}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Eligibility Criteria
            </h2>
            <p className="text-gray-600 mt-2">
              Requirements for MBBS admission in {country.name}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <BookOpen className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Academic</h4>
              <p className="text-gray-600 text-sm">
                {country.eligibility?.academic}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card p-6 text-center"
            >
              <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Minimum Marks</h4>
              <p className="text-gray-600 text-sm">
                {country.eligibility?.minimum_marks}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card p-6 text-center"
            >
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">NEET</h4>
              <p className="text-gray-600 text-sm">
                {country.eligibility?.neet_required
                  ? 'NEET Qualification Required'
                  : 'NEET Not Required'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="card p-6 text-center"
            >
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Age</h4>
              <p className="text-gray-600 text-sm">
                {country.eligibility?.age_requirement}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Colleges Section */}
      {colleges.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Top Medical Universities in {country.name}
              </h2>
              <p className="text-gray-600 mt-2">
                NMC & WHO approved universities for Indian students
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college, index) => (
                <motion.div
                  key={college._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="card p-6 block hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start mb-4">
                      {college.logo ? (
                        <Image
                          src={college.logo}
                          alt={college.name}
                          width={60}
                          height={60}
                          className="rounded-lg mr-4"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                          <Building className="w-8 h-8 text-primary-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {college.name}
                        </h3>
                        {college.contact?.city ? (
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                            {college.contact?.city}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {college.recognition?.slice(0, 3).map((rec) => (
                        <span
                          key={rec.name}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded"
                        >
                          {rec.name}
                        </span>
                      ))}
                    </div>

                    {college.fees?.total_package && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-primary-600">
                          {college.fees.total_package}
                        </span>{' '}
                        Total Fee
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {country.faqs && country.faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 mt-2">
                Common questions about MBBS in {country.name}
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {country.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <div
                    className={cn(
                      'faq-answer px-5',
                      openFaq === index && 'open pb-5'
                    )}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 gradient-bg text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your MBBS Journey in {country.name}?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Get free counseling and guidance from our expert team. 
            We'll help you with admission, visa, and everything else.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleApplyNow} className="btn-white">
              Apply Now
            </button>
            <a href="tel:+919058501818" className="flex items-center text-white font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              +91 9058501818
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
