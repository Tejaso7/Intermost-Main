'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/lib/api';

type Props = {
  blogs: Blog[];
  featuredBlog?: Blog;
};

export default function BlogList({ blogs, featuredBlog }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  // Extract unique tags from all blogs and calculate their counts
  const tagCounts: Record<string, number> = {};
  blogs.forEach(blog => {
    (blog.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const allTags = [
    { name: 'All', count: blogs.length },
    ...Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  ];
  
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 6);

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTags.length === 0 || (blog.tags && activeTags.some(t => blog.tags?.includes(t)));
    
    // Do not show the featured blog in the grid if we are on "All" and no search query/tag
    const isFeaturedAndNoFilter = blog._id === featuredBlog?._id && activeTags.length === 0 && !searchQuery;
    
    return matchesSearch && matchesTag && !isFeaturedAndNoFilter;
  });

  const showFeatured = featuredBlog && activeTags.length === 0 && !searchQuery;

  return (
    <>
      {/* Search & Categories */}
      <section className="py-8 bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-96 flex-shrink-0">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <div className="w-full overflow-x-auto pb-4 -mb-4 scrollbar-modern">
              <div className="flex gap-2 lg:justify-end min-w-max items-center">
                <button
                  onClick={() => setActiveTags([])}
                  className={`px-4 py-2 text-sm rounded-full border transition-colors whitespace-nowrap ${
                    activeTags.length === 0 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  All
                  <span className={`ml-1 ${activeTags.length === 0 ? 'text-white/80' : 'text-gray-400'}`}>
                    ({blogs.length})
                  </span>
                </button>
                {visibleTags.filter(t => t.name !== 'All').map((tag) => {
                  const isActive = activeTags.includes(tag.name);
                  return (
                    <button
                      key={tag.name}
                      onClick={() => {
                        if (isActive) {
                          setActiveTags(activeTags.filter(t => t !== tag.name));
                        } else {
                          setActiveTags([...activeTags, tag.name]);
                        }
                      }}
                      className={`px-4 py-2 text-sm rounded-full border transition-colors whitespace-nowrap flex items-center gap-1 ${
                        isActive 
                          ? 'bg-primary text-white border-primary shadow-sm' 
                          : 'bg-white border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                      }`}
                    >
                      # {tag.name}
                      <span className={`ml-1 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                        ({tag.count})
                      </span>
                    </button>
                  );
                })}
                {allTags.length > 6 && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-sm font-medium text-primary hover:text-primary-700 px-3 py-2 whitespace-nowrap transition-colors underline"
                  >
                    {showAllTags ? 'Show less' : `+${allTags.length - 6} more tags`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post (Only visible when no filters are active) */}
      {showFeatured && (
        <section className="py-12">
          <div className="container">
            <Link href={`/blogs/${featuredBlog.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-64 md:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <Image
                    src={featuredBlog.featured_image || '/images/placeholder.jpg'}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full shadow-sm">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary font-medium rounded-full">
                      {featuredBlog.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featuredBlog.created_at)}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">{featuredBlog.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {featuredBlog.author || 'Admin'}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {featuredBlog.read_time}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className={`py-12 bg-gray-50 ${!showFeatured ? 'min-h-[500px]' : ''}`}>
        <div className="container">
          {showFeatured && (
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Latest Articles
            </h2>
          )}
          
          {filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, idx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                >
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all h-full flex flex-col">
                      <div className="relative h-56">
                        <Image
                          src={blog.featured_image || '/images/placeholder.jpg'}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-primary text-xs font-semibold rounded-full shadow-sm">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(blog.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            {blog.read_time}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 flex-1 mb-6">
                          {blog.excerpt}
                        </p>
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {blog.author || 'Admin'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">
                We couldn't find any articles matching your search or filter.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveTags([]); }}
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
