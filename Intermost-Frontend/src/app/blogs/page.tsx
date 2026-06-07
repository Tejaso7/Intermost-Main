import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog - MBBS Abroad News & Updates | Intermost Study Abroad',
  description:
    'Read the latest news, tips, and updates about studying MBBS abroad. Expert advice on medical education in Russia, Georgia, Uzbekistan, and more.',
};

// Sample blog data - will be replaced with API call
const blogs = [
  {
    _id: '1',
    title: 'Why Choose Russia for MBBS in 2024?',
    slug: 'why-choose-russia-mbbs-2024',
    excerpt:
      'Russia offers world-class medical education at affordable costs. Learn why thousands of Indian students choose Russian medical universities every year.',
    featured_image: '/images/countries/russia.jpg',
    category: 'Russia',
    author: { name: 'Dr. Amit Kumar' },
    created_at: '2024-01-15',
    read_time: '5 min read',
  },
  {
    _id: '2',
    title: 'NEET Requirements for Studying MBBS Abroad',
    slug: 'neet-requirements-mbbs-abroad',
    excerpt:
      'Understand the NEET score requirements for Indian students planning to pursue MBBS in foreign countries. Complete guide with eligibility criteria.',
    featured_image: '/images/news/fair.jpg',
    category: 'Guide',
    author: { name: 'Counseling Team' },
    created_at: '2024-01-10',
    read_time: '8 min read',
  },
  {
    _id: '3',
    title: 'Top Medical Universities in Georgia 2024',
    slug: 'top-medical-universities-georgia-2024',
    excerpt:
      'Explore the best medical universities in Georgia offering quality MBBS education with international recognition and affordable fees.',
    featured_image: '/images/countries/georgia.jpg',
    category: 'Georgia',
    author: { name: 'Dr. Priya Singh' },
    created_at: '2024-01-05',
    read_time: '6 min read',
  },
  {
    _id: '4',
    title: 'Student Life in Uzbekistan: A Complete Guide',
    slug: 'student-life-uzbekistan-guide',
    excerpt:
      'Discover what life is like for Indian medical students in Uzbekistan. From accommodation to food and culture, everything you need to know.',
    featured_image: '/images/countries/uzbekistan.jpg',
    category: 'Uzbekistan',
    author: { name: 'Alumni Network' },
    created_at: '2023-12-28',
    read_time: '7 min read',
  },
  {
    _id: '5',
    title: 'FMGE Preparation Tips for MBBS Abroad Students',
    slug: 'fmge-preparation-tips',
    excerpt:
      'Essential tips and strategies to prepare for FMGE exam after completing MBBS abroad. Expert advice from successful candidates.',
    featured_image: '/images/news/fair.jpg',
    category: 'Exam Tips',
    author: { name: 'Dr. Rajesh Verma' },
    created_at: '2023-12-20',
    read_time: '10 min read',
  },
  {
    _id: '6',
    title: 'Cost Comparison: MBBS in Different Countries',
    slug: 'mbbs-cost-comparison-countries',
    excerpt:
      'Detailed comparison of MBBS education costs in Russia, Georgia, Kazakhstan, Uzbekistan, and other popular destinations for Indian students.',
    featured_image: '/images/news/fair.jpg',
    category: 'Finance',
    author: { name: 'Counseling Team' },
    created_at: '2023-12-15',
    read_time: '9 min read',
  },
];

const categories = [
  { name: 'All', count: 25 },
  { name: 'Russia', count: 8 },
  { name: 'Georgia', count: 6 },
  { name: 'Uzbekistan', count: 4 },
  { name: 'Guide', count: 5 },
  { name: 'Exam Tips', count: 3 },
];

export default function BlogsPage() {
  const featuredBlog = blogs[0];
  const recentBlogs = blogs.slice(1);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-800 to-secondary-600">
        <div className="container">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog & News
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Stay updated with the latest news, tips, and insights about
              studying MBBS abroad.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-8 bg-white border-b sticky top-16 z-30">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.name}
                  className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:border-primary hover:text-primary transition-colors"
                >
                  {category.name}
                  <span className="ml-1 text-gray-400">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container">
          <Link href={`/blogs/${featuredBlog.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64 md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <Image
                  src={featuredBlog.featured_image}
                  alt={featuredBlog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
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
                <p className="text-gray-600 mb-6">{featuredBlog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {featuredBlog.author.name}
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

      {/* Blog Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Latest Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog.slug}`}
                className="group"
              >
                <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={blog.featured_image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-medium rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(blog.created_at)}
                      </span>
                      <span>{blog.read_time}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                      {blog.excerpt}
                    </p>
                    <div className="mt-4 pt-4 border-t flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {blog.author.name}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100">
              2
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100">
              3
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 flex items-center gap-1">
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

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
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white/50 border-0"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
