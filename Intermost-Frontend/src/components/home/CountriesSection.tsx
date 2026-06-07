'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Clock, DollarSign } from 'lucide-react';
import { countriesApi } from '@/lib/services';
import type { Country } from '@/lib/api';
import { getCountryFlag } from '@/lib/utils';

// Fallback countries data with accurate pricing from intermost.in
const fallbackCountries: Partial<Country>[] = [
  {
    _id: '1',
    name: 'Russia',
    slug: 'russia',
    code: 'ru',
    flag_url: '/flags/russia.png',
    hero_image: '/images/countries/russia.jpg',
    pricing: { total_course_fee: '$4,000/year', currency: 'USD', tuition_fee: '$4,000-6,000', hostel_fee: '$600-1,200', living_cost: '$150-200/month' },
    course_details: { duration: '6 Years', medium: 'English', degree_awarded: 'MD', recognition: ['NMC', 'WHO'] },
  },
  {
    _id: '2',
    name: 'Georgia',
    slug: 'georgia',
    code: 'ge',
    flag_url: '/flags/georgia.png',
    hero_image: '/images/countries/georgia.jpg',
    pricing: { total_course_fee: '$4,800-8,000/year', currency: 'USD', tuition_fee: '$4,800-8,000', hostel_fee: '$2,500-3,000', living_cost: '' },
    course_details: { duration: '6 Years', medium: 'English', degree_awarded: 'MD', recognition: ['NMC', 'WHO', 'WFME'] },
  },
  {
    _id: '3',
    name: 'Uzbekistan',
    slug: 'uzbekistan',
    code: 'uz',
    flag_url: '/flags/uzbekistan.png',
    hero_image: '/images/countries/uzbekistan.jpg',
    pricing: { total_course_fee: '$3,500/year', currency: 'USD', tuition_fee: '$3,500-4,500', hostel_fee: '$3,000', living_cost: '$100-150/month' },
    course_details: { duration: '6 Years', medium: 'English', degree_awarded: 'MD', recognition: ['NMC', 'WHO'] },
  },
  {
    _id: '4',
    name: 'Nepal',
    slug: 'nepal',
    code: 'np',
    flag_url: '/flags/nepal.png',
    hero_image: '/images/countries/nepal.jpg',
    pricing: { total_course_fee: '₹50-65 Lakhs (Full Course)', currency: 'INR', tuition_fee: '₹50-65 Lakhs', hostel_fee: '₹5-12 Lakhs', living_cost: '' },
    course_details: { duration: '5.5 Years', medium: 'English', degree_awarded: 'MBBS', recognition: ['NMC'] },
  },
  {
    _id: '5',
    name: 'Kazakhstan',
    slug: 'kazakhstan',
    code: 'kz',
    flag_url: '/flags/kazakhstan.png',
    hero_image: '/images/countries/kazakhstan.jpg',
    pricing: { total_course_fee: '$3,500/year', currency: 'USD', tuition_fee: '$3,700-6,383', hostel_fee: '$600-1,200', living_cost: '$120/month' },
    course_details: { duration: '5.5 Years', medium: 'English', degree_awarded: 'MD', recognition: ['NMC', 'WHO'] },
  },
  {
    _id: '6',
    name: 'Tajikistan',
    slug: 'tajikistan',
    code: 'tj',
    flag_url: '/flags/tajikistan.png',
    hero_image: '/images/countries/tajikistan.jpg',
    pricing: { total_course_fee: '$3,000/year', currency: 'USD', tuition_fee: '$6,000-7,000', hostel_fee: '$1,200-1,500', living_cost: '' },
    course_details: { duration: '5.5 Years', medium: 'English', degree_awarded: 'MD', recognition: ['NMC', 'WHO'] },
  },
];

export default function CountriesSection() {
  const [countries, setCountries] = useState<Country[]>(fallbackCountries as Country[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await countriesApi.getAll({ active: true });
        if (data && data.length > 0) {
          setCountries(data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 px-4"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-primary-100 text-primary-700 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider mb-4"
          >
            Study Destinations
          </motion.span>
          <h2 className="section-title mt-2">
            Choose Your <span className="gradient-text">Dream Country</span>
          </h2>
          <p className="section-subtitle mt-4 px-2">
            Explore top medical universities in these countries with NMC & WHO approved programs
          </p>
        </motion.div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
          {countries.map((country, index) => (
            <motion.div
              key={country._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            >
              <Link href={`/countries/${country.slug}`} className="block group h-full">
                <motion.div
                  className="card card-hover overflow-hidden h-full flex flex-col"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src={country.hero_image || country.banner_image || '/images/placeholder.jpg'}
                      alt={`MBBS in ${country.name}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

                    {/* Flag */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-8 sm:w-10 h-6 sm:h-7 rounded overflow-hidden shadow-md">
                      <Image
                        src={country.flag_url || getCountryFlag(country.code)}
                        alt={`${country.name} flag`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Featured Badge */}
                    {country.meta?.is_featured && (
                      <span className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                        Popular
                      </span>
                    )}

                    {/* Country Name */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-white text-shadow">
                        MBBS in {country.name}
                      </h3>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                      <div className="text-center">
                        <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-primary-600 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Duration</span>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">
                          {country.course_details?.duration || '6 Years'}
                        </p>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <GraduationCap className="w-4 sm:w-5 h-4 sm:h-5 text-primary-600 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Medium</span>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">
                          {country.course_details?.medium || 'English'}
                        </p>
                      </div>
                      <div className="text-center">
                        <DollarSign className="w-4 sm:w-5 h-4 sm:h-5 text-primary-600 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Total Fee</span>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2">
                          {country.pricing?.total_course_fee || 'Contact Us'}
                        </p>
                      </div>
                    </div>

                    {/* Recognition */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap justify-center sm:justify-start gap-1">
                        {country.course_details?.recognition?.slice(0, 2).map((rec) => (
                          <span
                            key={rec}
                            className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded whitespace-nowrap"
                          >
                            {rec}
                          </span>
                        ))}
                        {country.course_details?.recognition && country.course_details.recognition.length > 2 && (
                          <span className="text-xs text-gray-500">+{country.course_details.recognition.length - 2}</span>
                        )}
                      </div>
                      <span className="text-primary-600 font-medium text-xs sm:text-sm flex items-center group-hover:translate-x-1 transition-transform">
                        <span className="hidden sm:inline">Learn More</span>
                        <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/countries" className="btn-primary">
            View All Countries
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
