'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, Quote, Play } from 'lucide-react';
import { testimonialsApi } from '@/lib/services';
import type { Testimonial } from '@/lib/api';
import { getInitials } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Fallback testimonials (real alumni from intermost.in)
const fallbackTestimonials: Testimonial[] = [
  {
    _id: '1',
    name: 'Dr. Ankita Borade',
    university: 'Orenburg State Medical University',
    country: 'Russia',
    year: 2019,
    rating: 5,
    quote: 'My journey with Intermost Study Abroad was exceptional. From admission guidance to visa support, they made my MBBS dream in Russia a reality. The team was always available to help.',
    content: 'My journey with Intermost Study Abroad was exceptional. From admission guidance to visa support, they made my MBBS dream in Russia a reality. The team was always available to help.',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Dr. Saurabh Sharma',
    university: 'Tver State Medical University',
    country: 'Russia',
    year: 2019,
    rating: 5,
    quote: 'Intermost provided complete transparency throughout the admission process. Their guidance was invaluable, and I am now a practicing doctor thanks to their support.',
    content: 'Intermost provided complete transparency throughout the admission process. Their guidance was invaluable, and I am now a practicing doctor thanks to their support.',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'Dr. Shubham Sharma',
    university: 'Tver State Medical University',
    country: 'Russia',
    year: 2019,
    rating: 5,
    quote: 'Choosing Intermost was the best decision for my medical career. The affordable fees and quality education in Russia exceeded my expectations.',
    content: 'Choosing Intermost was the best decision for my medical career. The affordable fees and quality education in Russia exceeded my expectations.',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: '4',
    name: 'Dr. Sanjay Sharma',
    university: 'KSMU Kursk State Medical University',
    country: 'Russia',
    year: 2016,
    rating: 5,
    quote: 'Excellent support from day one. Intermost helped me navigate every step of studying MBBS abroad. Now I am a successful doctor serving patients.',
    content: 'Excellent support from day one. Intermost helped me navigate every step of studying MBBS abroad. Now I am a successful doctor serving patients.',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: '5',
    name: 'Dr. Pratibha Keshri',
    university: 'Orel State University',
    country: 'Russia',
    year: 2019,
    rating: 5,
    quote: 'The personalized counseling and honest guidance set Intermost apart. They genuinely care about students\' futures and careers.',
    content: 'The personalized counseling and honest guidance set Intermost apart. They genuinely care about students\' futures and careers.',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: '6',
    name: 'Dr. Chandan Kumar',
    university: 'Orel State University',
    country: 'Russia',
    year: 2020,
    rating: 5,
    quote: 'Professional team with excellent follow-up. They helped me throughout my 6-year journey and even assisted with FMGE preparation.',
    content: 'Professional team with excellent follow-up. They helped me throughout my 6-year journey and even assisted with FMGE preparation.',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsApi.getAll({ featured: true });
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-300 font-semibold text-sm uppercase tracking-wider">
            Student Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            What Our <span className="text-primary-400">Students Say</span>
          </h2>
          <p className="text-primary-200 text-lg mt-4 max-w-2xl mx-auto">
            Hear from students who achieved their dream of becoming doctors with our guidance
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-white/50',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary-400',
            }}
            className="pb-14"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial._id}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-primary-400 mb-4" />

                  {/* Content */}
                  <p className="text-white/90 leading-relaxed mb-6 line-clamp-4">
                    "{testimonial.content}"
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center">
                    {testimonial.photo ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.photo}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">
                          {getInitials(testimonial.name)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-primary-300 text-sm">
                        {testimonial.university}, {testimonial.country}
                      </p>
                      <p className="text-primary-400 text-xs">
                        Batch of {testimonial.year}
                      </p>
                    </div>
                  </div>

                  {/* Video Link */}
                  {testimonial.video_url && (
                    <button className="mt-4 flex items-center text-primary-300 hover:text-white transition-colors text-sm">
                      <Play className="w-4 h-4 mr-1" />
                      Watch Video Testimonial
                    </button>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
