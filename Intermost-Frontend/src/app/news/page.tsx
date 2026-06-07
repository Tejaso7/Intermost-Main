'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { newsApi } from '@/lib/services';
import type { News } from '@/lib/api';

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
    description: 'Apply now for MBBS admissions in Russia, Georgia, and Uzbekistan. Limited seats available for the upcoming academic session.',
    media_type: 'image',
    media_url: '/images/countries/russia.jpg',
    badge_text: 'Admissions',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
  },
];

export default function NewsPage() {
  const [news, setNews] = useState<News[]>(fallbackNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsApi.getAll({ active: true });
        if (data && data.length > 0) {
          setNews(data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const gridNews = news.filter((n) => n.media_type !== 'marquee');

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-custom">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Stay informed about our latest events, student achievements, and admission updates
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridNews.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
                >
                  {/* Media */}
                  <div className="relative h-48 overflow-hidden">
                    {item.media_type === 'video' ? (
                      <>
                        <video
                          src={item.media_url}
                          poster={item.media_url}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-primary-600 ml-1" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <Image
                        src={item.media_url || '/images/placeholder.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}

                    {item.badge_text && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                        {item.badge_text}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      {item.location && (
                        <span className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.location}
                        </span>
                      )}
                      <span className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {gridNews.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No news articles available at the moment.</p>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link href="/" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
