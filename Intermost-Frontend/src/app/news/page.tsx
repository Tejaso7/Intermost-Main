'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { newsApi } from '@/lib/services';
import type { News } from '@/lib/api';
import NewsList from '@/components/news/NewsList';

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

  const gridNews = news.filter((n) => n.media_type !== 'marquee');

  // Calculate categories based on badge_text
  const categoryCounts: Record<string, number> = {};
  gridNews.forEach(item => {
    const cat = item.badge_text || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categories = [
    { name: 'All', count: gridNews.length },
    ...Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col items-center justify-center min-h-[40vh]">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container-custom relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-slide-up">News & Updates</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Stay informed about our latest events, student achievements, and admission updates
            </p>
          </div>
        </div>
      </section>

      {/* News Grid via Client Component */}
      {!loading && gridNews.length > 0 && (
        <NewsList newsItems={gridNews} categories={categories} />
      )}

      {loading && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
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
          </div>
        </section>
      )}

      {!loading && gridNews.length === 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No news articles available at the moment.</p>
            </div>
          </div>
        </section>
      )}

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link href="/" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
    </main>
  );
}
