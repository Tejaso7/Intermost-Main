import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from '@/components/NewsletterForm';
import BlogList from '@/components/blogs/BlogList';

import { blogsApi } from '@/lib/services';
import { Blog } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Blog - MBBS Abroad News & Updates | Intermost Study Abroad',
  description:
    'Read the latest news, tips, and updates about studying MBBS abroad. Expert advice on medical education in Russia, Georgia, Uzbekistan, and more.',
};

export default async function BlogsPage() {
  let blogs: Blog[] = [];
  let categories: { name: string; count: number }[] = [];

  try {
    const data = await blogsApi.getAll({ published: true, limit: 100 } as any);
    blogs = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
  }

  const featuredBlog = blogs.find(b => b.is_featured) || blogs[0];
  const recentBlogs = featuredBlog ? blogs.filter(b => b._id !== featuredBlog._id) : blogs;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-primary-600 via-primary-800 to-secondary-600 flex flex-col items-center justify-center min-h-[40vh]">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-slide-up">
              Blog & News
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Stay updated with the latest news, tips, and insights about
              studying MBBS abroad.
            </p>
          </div>
        </div>
      </section>

      <BlogList blogs={blogs} featuredBlog={featuredBlog} />

      {/* Newsletter Section */}
      <section className="py-16 bg-primary">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white/90 mb-8">
              Get the latest updates on MBBS abroad, admission deadlines, and
              scholarship opportunities delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
