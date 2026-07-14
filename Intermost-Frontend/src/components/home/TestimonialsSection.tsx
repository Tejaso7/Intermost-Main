'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, Quote, Play } from 'lucide-react';
import { testimonialsApi, coreApi } from '@/lib/services';
import type { Testimonial } from '@/lib/api';
import { getInitials } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Fallback testimonials (real alumni from intermost.in)
// Fallback testimonials (real alumni from intermost.in)
const fallbackTestimonials: Testimonial[] = [
  {
    _id: 'alumni-1',
    name: 'Dr. Sumant',
    university: 'Dnipro State',
    country: 'Ukraine',
    year: 2020,
    rating: 4.5,
    quote: "The affordable fees and excellent clinical exposure in Dnipro were exactly what I needed. Intermost's local support team in Ukraine made the transition smooth. I'm grateful for their honest counseling.",
    content: "The affordable fees and excellent clinical exposure in Dnipro were exactly what I needed. Intermost's local support team in Ukraine made the transition smooth. I'm grateful for their honest counseling. Pass FMGE Exam: 2020, PG Resident in MS Orthopedics.",
    photo: '/images/dr/sumant.jpg',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: 'alumni-2',
    name: 'Dr. Zainab',
    university: 'Dnipro State',
    country: 'Ukraine',
    year: 2024,
    rating: 5,
    quote: "Studying in Ukraine through Intermost was the best decision. Their team helped me with every step, even after arrival. The quality of medical education here is world-class at a fraction of Indian private college costs.",
    content: "Studying in Ukraine through Intermost was the best decision. Their team helped me with every step, even after arrival. The quality of medical education here is world-class at a fraction of Indian private college costs. Recently cleared FMGE exam in first attempt.",
    photo: '/images/dr/zainab.jpg',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: 'alumni-3',
    name: 'Dr. Priyanka',
    university: 'Dnipro State',
    country: 'Ukraine',
    year: 2018,
    rating: 5,
    quote: "Intermost made my dream of studying medicine abroad come true. Their guidance from application to visa was impeccable. The university has excellent facilities and clinical exposure.",
    content: "Intermost made my dream of studying medicine abroad come true. Their guidance from application to visa was impeccable. The university has excellent facilities and clinical exposure. Recently cleared FMGE 2024.",
    photo: '/images/dr/priya.jpg',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: 'alumni-4',
    name: 'Vishal Srivastava',
    university: 'Alte University',
    country: 'Georgia',
    year: 2024,
    rating: 5,
    quote: "The support I received made everything easier—from the admission process to settling abroad. I'm grateful to be pursuing my dream at Alte University.",
    content: "The support I received made everything easier—from the admission process to settling abroad. I'm grateful to be pursuing my dream at Alte University. Now working at Lala Lajpat Rai Hospital.",
    photo: '/images/dr/vishal.jpg',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: 'alumni-5',
    name: 'Shubhangi',
    university: 'SEU',
    country: 'Georgia',
    year: 2025,
    rating: 5,
    quote: "Choosing SEU was a turning point in my career. Thankful for the transparent and smooth guidance I received through every step.",
    content: "Choosing SEU was a turning point in my career. Thankful for the transparent and smooth guidance I received through every step.",
    photo: '/images/dr/shubhangi.jpg',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: 'alumni-6',
    name: 'Dr. Abinash',
    university: 'DSMA',
    country: 'Ukraine',
    year: 2018,
    rating: 5,
    quote: "My FMGE journey was successful thanks to solid guidance and preparation. Working as a GDMO now has been a fulfilling experience in public service.",
    content: "My FMGE journey was successful thanks to solid guidance and preparation. Working as a GDMO now has been a fulfilling experience in public service. 2019 FMGE Passed, GDMO at PHC since 2021.",
    photo: '/images/dr/abinash.jpg',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: 'alumni-7',
    name: 'Dr. Lalit',
    university: 'Dnipro State',
    country: 'Ukraine',
    year: 2020,
    rating: 5,
    quote: "Medical education in Ukraine shaped me into the professional I am today. I'm currently working as a surgery resident and pursuing specialization.",
    content: "Medical education in Ukraine shaped me into the professional I am today. I'm currently working as a surgery resident and pursuing specialization. Resident in General Surgery at Metro Hospital.",
    photo: '/images/dr/lalit.jpg',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: 'alumni-8',
    name: 'Dr. Sandeep',
    university: 'Mari State',
    country: 'Russia',
    year: 2021,
    rating: 5,
    quote: "Studying in Russia gave me solid clinical exposure. I'm proud to now serve patients back home in Rajasthan as part of a reputed hospital.",
    content: "Studying in Russia gave me solid clinical exposure. I'm proud to now serve patients back home in Rajasthan as part of a reputed hospital (PARAS Hospital, Rajasthan).",
    photo: '/images/dr/sandeep.jpg',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    _id: 'alumni-9',
    name: 'Dr. Amit',
    university: 'Andijan State',
    country: 'Uzbekistan',
    year: 2024,
    rating: 5,
    quote: "The journey through Andijan State Medical University has been truly transformative. The support from Intermost ensured a smooth process throughout.",
    content: "The journey through Andijan State Medical University has been truly transformative. The support from Intermost ensured a smooth process throughout.",
    photo: '/images/dr/amit.jpg',
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);
  const [marqueeImages, setMarqueeImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsApi.getAll({ featured: true });
        if (data && data.length > 0) {
          const sorted = [...data].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
          setTestimonials(sorted);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings && settings.alumni_marquee_images && settings.alumni_marquee_images.length > 0) {
          setMarqueeImages(settings.alumni_marquee_images);
        } else {
          setMarqueeImages([...Array(15)].map((_, i) => `/images/alu/alumini pdf-images-${i}-min.jpg`));
        }
      } catch (error) {
        console.error('Error fetching settings for marquee:', error);
        setMarqueeImages([...Array(15)].map((_, i) => `/images/alu/alumini pdf-images-${i}-min.jpg`));
      }
    };

    fetchTestimonials();
    fetchSettings();
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
            Our Alumni Students
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            Stories From Our <span className="text-primary-400">Best Doctors & Heroes</span>
          </h2>
          <p className="text-primary-200 text-lg mt-4 max-w-2xl mx-auto">
            Discover authentic feedback from successful medical graduates placed at top hospitals worldwide.
          </p>
        </motion.div>

        {/* Testimonials Slider / Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-64 animate-pulse flex flex-col space-y-4">
                <div className="w-10 h-10 bg-white/20 rounded" />
                <div className="h-4 bg-white/20 rounded w-full" />
                <div className="h-4 bg-white/20 rounded w-5/6" />
                <div className="h-4 bg-white/20 rounded w-3/4" />
                <div className="flex items-center space-x-2 mt-auto">
                  <div className="w-12 h-12 bg-white/20 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded w-1/3" />
                    <div className="h-3 bg-white/20 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}

        {/* Alumni Documents Marquee */}
        {marqueeImages.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="text-center mb-10">
              <span className="text-primary-300 font-semibold text-xs uppercase tracking-wider">
                Verified Records
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">Our Successful Alumni Placements</h3>
              <p className="text-primary-200 text-sm mt-2 max-w-xl mx-auto">
                Glance at the historical admissions, visa copies, and university allocations of students placed by Intermost.
              </p>
            </div>

            <div className="relative overflow-hidden w-full py-4">
              {/* Gradient overlays for smooth fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-primary-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-primary-900 to-transparent z-10 pointer-events-none" />
              
              <div className="flex animate-marquee-alumni whitespace-nowrap gap-6 w-max">
                {/* First loop of images */}
                <div className="flex gap-6 shrink-0">
                  {marqueeImages.map((src, idx) => (
                    <div key={`marquee-1-${idx}`} className="relative w-[280px] h-[180px] rounded-xl overflow-hidden shadow-lg border border-white/10 hover:border-primary-400 transition-all duration-300 flex-shrink-0 group hover:scale-105 bg-white/5 cursor-pointer">
                      <Image
                        src={src}
                        alt={`Alumni placement record ${idx + 1}`}
                        fill
                        sizes="280px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Duplicate loop for infinite sliding */}
                <div className="flex gap-6 shrink-0">
                  {marqueeImages.map((src, idx) => (
                    <div key={`marquee-2-${idx}`} className="relative w-[280px] h-[180px] rounded-xl overflow-hidden shadow-lg border border-white/10 hover:border-primary-400 transition-all duration-300 flex-shrink-0 group hover:scale-105 bg-white/5 cursor-pointer">
                      <Image
                        src={src}
                        alt={`Alumni placement record ${idx + 1} clone`}
                        fill
                        sizes="280px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes marquee-alumni {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-alumni {
          animation: marquee-alumni 40s linear infinite;
          will-change: transform;
        }
        .animate-marquee-alumni:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
