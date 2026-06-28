'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { shortsApi, type YouTubeShort } from '@/lib/services';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function YouTubeShortsSection() {
  const [shorts, setShorts] = useState<YouTubeShort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const data = await shortsApi.getAll({ is_active: 'true' });
        setShorts(data);
      } catch (error) {
        console.error('Failed to load active YouTube Shorts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShorts();
  }, []);

  const getYoutubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  if (loading || shorts.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/40 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-red-600 dark:text-red-400 text-sm font-bold tracking-widest uppercase block mb-3">
              Campus Reel Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Youtube className="w-8 h-8 text-red-650" />
              Student Life Shorts
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">
              Watch real testimonials, hostel tours, and campus experiences shared by students placed through Intermost.
            </p>
          </div>

          {/* Custom Navigation buttons */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button className="swiper-shorts-prev w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-450 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="swiper-shorts-next w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-450 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-shorts-prev',
              nextEl: '.swiper-shorts-next',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-shorts-pagination',
            }}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="!pb-14"
          >
            {shorts.map((short) => {
              const videoId = getYoutubeId(short.url);
              if (!videoId) return null;
              
              return (
                <SwiperSlide key={short._id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="bg-white dark:bg-gray-850 rounded-3xl overflow-hidden border border-gray-150 dark:border-gray-800 shadow-md flex flex-col h-full"
                  >
                    {/* Portrait Shorts Frame Embed */}
                    <div className="aspect-[9/16] relative bg-black flex-1 w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`}
                        title={short.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>

                    {/* Title Footer */}
                    <div className="p-4 bg-white dark:bg-gray-850 shrink-0 border-t border-gray-100 dark:border-gray-800">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 min-h-[40px] leading-snug">
                        {short.title}
                      </p>
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Pagination */}
          <div className="swiper-shorts-pagination flex justify-center gap-1.5 mt-2 absolute bottom-0 left-0 right-0 z-10" />
        </div>
      </div>
    </section>
  );
}
