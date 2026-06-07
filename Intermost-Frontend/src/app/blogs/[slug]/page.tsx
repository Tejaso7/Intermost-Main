import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// This would normally come from your API
const getBlogBySlug = async (slug: string) => {
  // Simulated blog data
  return {
    _id: '1',
    title: 'Why Choose Russia for MBBS in 2024?',
    slug: 'why-choose-russia-mbbs-2024',
    excerpt:
      'Russia offers world-class medical education at affordable costs. Learn why thousands of Indian students choose Russian medical universities every year.',
    content: `
      <h2>Introduction</h2>
      <p>Russia has emerged as one of the top destinations for Indian students seeking quality medical education abroad. With over 50 years of history in training international medical professionals, Russian universities offer a unique combination of quality education, affordable fees, and global recognition.</p>
      
      <h2>Why Russian Medical Universities Stand Out</h2>
      <p>Russian medical universities are recognized by major international bodies including WHO, NMC (formerly MCI), and UNESCO. This ensures that graduates can practice medicine in India and many other countries around the world.</p>
      
      <h3>Key Advantages:</h3>
      <ul>
        <li><strong>Affordable Tuition:</strong> Compared to private medical colleges in India, Russian universities offer significantly lower fees without compromising on quality.</li>
        <li><strong>No Donation or Capitation Fee:</strong> Admission is purely merit-based with no hidden costs.</li>
        <li><strong>English Medium:</strong> Many universities offer complete MBBS programs in English.</li>
        <li><strong>World-Class Infrastructure:</strong> Modern laboratories, well-equipped hospitals, and advanced research facilities.</li>
        <li><strong>Clinical Exposure:</strong> Students get hands-on experience from the early years of their course.</li>
      </ul>
      
      <h2>Top Medical Universities in Russia</h2>
      <p>Some of the most popular choices among Indian students include:</p>
      <ol>
        <li>Kazan Federal University</li>
        <li>Peoples' Friendship University (RUDN)</li>
        <li>First Moscow State Medical University</li>
        <li>Crimea Federal University</li>
        <li>Kursk State Medical University</li>
      </ol>
      
      <h2>Admission Process</h2>
      <p>The admission process for MBBS in Russia is straightforward:</p>
      <ol>
        <li>Check eligibility (NEET qualified, 50% in PCB)</li>
        <li>Choose your preferred university</li>
        <li>Submit application with required documents</li>
        <li>Receive invitation letter</li>
        <li>Apply for student visa</li>
        <li>Travel to Russia and begin your journey</li>
      </ol>
      
      <h2>Cost of Studying MBBS in Russia</h2>
      <p>The total cost including tuition, hostel, and living expenses typically ranges from ₹25-40 lakhs for the entire 6-year program. This is significantly lower than private medical colleges in India.</p>
      
      <h2>Conclusion</h2>
      <p>Russia offers an excellent opportunity for aspiring doctors to receive quality medical education at affordable costs. With proper guidance and preparation, studying MBBS in Russia can be the first step towards a successful medical career.</p>
    `,
    featured_image: '/images/countries/russia.jpg',
    category: 'Russia',
    author: {
      name: 'Dr. Amit Kumar',
      bio: 'Senior Education Counselor with 10+ years of experience guiding students for MBBS abroad.',
      avatar: '/images/logo/logo.jpg',
    },
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    read_time: '5 min read',
    tags: ['Russia', 'MBBS', 'Medical Education', 'Study Abroad'],
  };
};

const relatedBlogs = [
  {
    _id: '2',
    title: 'NEET Requirements for Studying MBBS Abroad',
    slug: 'neet-requirements-mbbs-abroad',
    featured_image: '/images/news/fair.jpg',
    category: 'Guide',
    created_at: '2024-01-10',
  },
  {
    _id: '3',
    title: 'Top Medical Universities in Georgia 2024',
    slug: 'top-medical-universities-georgia-2024',
    featured_image: '/images/countries/georgia.jpg',
    category: 'Georgia',
    created_at: '2024-01-05',
  },
  {
    _id: '4',
    title: 'Student Life in Uzbekistan: A Complete Guide',
    slug: 'student-life-uzbekistan-guide',
    featured_image: '/images/countries/uzbekistan.jpg',
    category: 'Uzbekistan',
    created_at: '2023-12-28',
  },
];

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);

  return {
    title: `${blog.title} | Intermost Study Abroad`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.featured_image],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const blog = await getBlogBySlug(params.slug);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src={blog.featured_image}
            alt={blog.title}
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>
        <div className="container relative z-10">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-4">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span>{blog.author.name}</span>
              </div>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {blog.read_time}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-3">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary prose-ul:text-gray-600 prose-ol:text-gray-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              <div className="mt-8 pt-8 border-t">
                <h4 className="text-sm font-semibold text-gray-500 mb-4">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 pt-8 border-t">
                <h4 className="text-sm font-semibold text-gray-500 mb-4">
                  Share this article
                </h4>
                <div className="flex gap-3">
                  <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Author Box */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {blog.author.name}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {blog.author.bio}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Related Posts */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedBlogs.map((post) => (
                      <Link
                        key={post._id}
                        href={`/blogs/${post.slug}`}
                        className="group flex gap-3"
                      >
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(post.created_at)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA Box */}
                <div className="bg-primary rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-2">Need Guidance?</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Our counselors are ready to help you choose the right path.
                  </p>
                  <Link
                    href="/apply"
                    className="block w-full py-2 bg-white text-primary text-center font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* More Articles */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            More Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedBlogs.map((post) => (
              <Link key={post._id} href={`/blogs/${post.slug}`} className="group">
                <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 text-primary text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(post.created_at)}
                    </p>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
