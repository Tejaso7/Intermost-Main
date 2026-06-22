'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, MapPin, Calendar, Search } from 'lucide-react';
import type { News } from '@/lib/api';

type Props = {
  newsItems: News[];
  categories: { name: string; count: number }[];
};

export default function NewsList({ newsItems, categories }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter news
  const filteredNews = newsItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const itemCat = item.badge_text || 'General';
    const matchesCategory = activeCategory === 'All' || itemCat === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Search & Categories */}
      <section className="py-8 bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-96 flex-shrink-0">
              <input
                type="text"
                placeholder="Search news & updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {categories.length > 1 && (
              <div className="w-full overflow-x-auto pb-2 -mb-2 scrollbar-hide">
                <div className="flex gap-2 lg:justify-end min-w-max">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setActiveCategory(category.name)}
                      className={`px-4 py-2 text-sm rounded-full border transition-colors whitespace-nowrap ${
                        activeCategory === category.name 
                          ? 'bg-primary text-white border-primary' 
                          : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {category.name}
                      <span className={`ml-1 ${activeCategory === category.name ? 'text-white/80' : 'text-gray-400'}`}>
                        ({category.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-50 min-h-[500px]">
        <div className="container-custom">
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow flex flex-col h-full"
                >
                  {/* Media */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
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
                      <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full shadow-sm">
                        {item.badge_text}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3 flex-1 mb-6">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
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
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
              <p className="text-gray-500">
                We couldn't find any news articles matching your search or filter.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-6 text-primary font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
