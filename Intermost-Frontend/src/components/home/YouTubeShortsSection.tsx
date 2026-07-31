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
  const [playingId, setPlayingId] = useState<string | null>(null);

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
    <section className="py-20 bg-white dark:bg-gray-950 relative overflow-hidden border-t border-gray-100 dark:border-gray-900">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-100 dark:border-red-900/30 mb-4">
              Campus Reel Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Youtube className="w-8 h-8 text-red-600" aria-hidden="true" />
              Student Life Shorts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl">
              Watch real testimonials, hostel tours, and campus experiences shared by students placed through Intermost.
            </p>
          </div>

          {/* Custom Navigation buttons */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              type="button"
              aria-label="Previous YouTube shorts"
              className="swiper-shorts-prev w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next YouTube shorts"
              className="swiper-shorts-next w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
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
              const isPlaying = playingId === short._id;
              const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              
              return (
                <SwiperSlide key={short._id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md flex flex-col h-full group"
                  >
                    {/* Portrait Shorts Frame Embed / Lazy Thumbnail */}
                    <div className="aspect-[9/16] relative bg-black flex-1 w-full overflow-hidden">
                      {isPlaying ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`}
                          title={short.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPlayingId(short._id ?? null)}
                          aria-label={`Play YouTube short: ${short.title}`}
                          className="w-full h-full relative group/thumb cursor-pointer text-left block focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                        >
                          <img
                            src={thumbnailUrl}
                            alt={short.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 group-hover/thumb:bg-red-600 transition-all">
                              <Play className="w-6 h-6 fill-current ml-0.5" aria-hidden="true" />
                            </div>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Title Footer */}
                    <div className="p-4 bg-white dark:bg-gray-900 shrink-0 border-t border-gray-100 dark:border-gray-800">
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
      </motion.div>
    </section>
  );
}
