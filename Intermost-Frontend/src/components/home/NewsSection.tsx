'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { newsApi } from '@/lib/services';
import type { News } from '@/lib/api';

// Fallback news data
const fallbackNews: News[] = [
  {
    _id: '1',
    title: 'Intermost Education Fair 2025',
    description: 'Join us at our upcoming education fair to learn about MBBS opportunities abroad.',
    media_type: 'image',
    media_url: '/images/news/fair.jpg',
    location: 'New Delhi',
    badge_text: 'Upcoming',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Student Success Stories',
    description: 'Our students share their experiences studying MBBS abroad.',
    media_type: 'image',
    media_url: '/images/countries/georgia.jpg',
    location: 'Russia',
    badge_text: 'Featured',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'Admissions Open for 2026',
    description: 'Apply now for MBBS admissions in Russia, Georgia, and Uzbekistan.',
    media_type: 'marquee',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
  },
];

export default function NewsSection() {
  const [news, setNews] = useState<News[]>(fallbackNews);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsApi.getAll({ is_active: true });
        if (data && data.length > 0) {
          const sorted = [...data].sort((a, b) => {
            const orderA = a.display_order ?? 0;
            const orderB = b.display_order ?? 0;
            if (orderA !== orderB) return orderA - orderB;
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          });
          setNews(sorted);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Get marquee news
  const marqueeNews = news.filter((n) => n.media_type === 'marquee');
  const gridNews = news.filter((n) => n.media_type !== 'marquee').slice(0, 6);

  return (
    <section id="news-section" className="py-16 sm:py-20 md:py-24 bg-gray-50/80">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16 px-4"
        >
          <span className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Latest Updates
          </span>
          <h2 className="section-title mt-2">News & Updates</h2>
          <p className="section-subtitle mt-4 px-2">
            Stay informed about our latest events, student achievements, and admission updates
          </p>
        </motion.div>

        {/* Marquee Banner with Pause/Play Toggle & Edge Fade Mask */}
        {loading ? (
          <div className="bg-gray-200 h-10 rounded-xl mb-8 animate-pulse border border-gray-300/40" />
        ) : (
          marqueeNews.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-2.5 sm:py-3.5 rounded-xl mb-8 sm:mb-10 overflow-hidden relative group flex items-center"
            >
              <button
                type="button"
                onClick={() => setIsMarqueePaused(!isMarqueePaused)}
                aria-label={isMarqueePaused ? "Resume news ticker animation" : "Pause news ticker animation"}
                className="absolute left-3 z-20 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-lg backdrop-blur-md text-xs font-semibold transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                {isMarqueePaused ? '▶ Play' : '❚❚ Pause'}
              </button>
              
              <div className={`marquee-mask w-full pl-20 ${isMarqueePaused ? '[animation-play-state:paused]' : ''}`}>
                <div className={`animate-marquee whitespace-nowrap text-xs sm:text-sm md:text-base font-medium ${isMarqueePaused ? '[animation-play-state:paused]' : ''}`}>
                  {marqueeNews.map((item, index) => (
                    <span key={item._id} className="mx-4 sm:mx-8 inline-flex items-center">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full mr-2 sm:mr-3" aria-hidden="true" />
                      {item.title}
                      {index < marqueeNews.length - 1 && <span className="mx-4 sm:mx-8">|</span>}
                    </span>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {marqueeNews.map((item, index) => (
                    <span key={`dup-${item._id}`} className="mx-4 sm:mx-8 inline-flex items-center">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full mr-2 sm:mr-3" aria-hidden="true" />
                      {item.title}
                      {index < marqueeNews.length - 1 && <span className="mx-4 sm:mx-8">|</span>}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        )}

        {/* News Grid / Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full animate-pulse shadow-sm">
                <div className="bg-gray-200 h-40 sm:h-48 w-full" />
                <div className="p-5 flex-1 flex flex-col space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {gridNews.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover overflow-hidden group flex flex-col h-full"
                whileHover={{ y: -4 }}
              >
                {/* Media */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  {item.media_type === 'video' ? (
                    playingVideoId === item._id ? (
                      getYoutubeId(item.media_url || '') ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYoutubeId(item.media_url || '')}?autoplay=1`}
                          className="w-full h-full object-cover"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={item.title}
                        />
                      ) : (
                        <video
                          src={item.media_url}
                          className="w-full h-full object-cover bg-black"
                          controls
                          autoPlay
                        />
                      )
                    ) : (
                      <div 
                        role="button"
                        tabIndex={0}
                        aria-label={`Play video: ${item.title}`}
                        className="relative w-full h-full cursor-pointer group"
                        onClick={(e) => {
                          e.preventDefault();
                          setPlayingVideoId(item._id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setPlayingVideoId(item._id);
                          }
                        }}
                      >
                        {getYoutubeId(item.media_url || '') ? (
                          <Image
                            src={`https://img.youtube.com/vi/${getYoutubeId(item.media_url || '')}/hqdefault.jpg`}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <video
                            src={item.media_url}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            muted
                            playsInline
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                          <motion.div 
                            className="w-11 sm:w-14 h-11 sm:h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Play className="w-5 sm:w-6 h-5 sm:h-6 text-primary-600 ml-1" aria-hidden="true" />
                          </motion.div>
                        </div>
                      </div>
                    )
                  ) : (
                    <Image
                      src={item.media_url || '/images/placeholder.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  
                  {/* Badge */}
                  {item.badge_text && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full"
                    >
                      {item.badge_text}
                    </motion.span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2 flex-1">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 gap-2">
                    {item.location && (
                      <span className="flex items-center text-xs sm:text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.location}</span>
                      </span>
                    )}
                    {item.link && (
                      <Link
                        href={item.link}
                        className="text-primary-600 text-xs sm:text-sm font-medium flex items-center hover:text-primary-700 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      >
                        Read More
                        <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-1" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-10 md:mt-12"
        >
          <Link href="/news" className="btn-outline">
            View All News
            <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
