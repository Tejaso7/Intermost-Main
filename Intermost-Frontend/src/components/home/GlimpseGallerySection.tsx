'use client';
 
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Eye, X, ZoomIn, Heart, GraduationCap, Utensils, Plane, Loader2, Play } from 'lucide-react';
import { glimpsesApi, Glimpse } from '@/lib/services';
import { getS3AssetUrl } from '@/lib/utils';

const localGlimpses: Glimpse[] = [
  {
    _id: 'local-glimpse-1',
    title: 'Alte University Student Meet',
    category: 'campus',
    categoryLabel: 'Campus Life',
    image: '/images/alte-meet/WhatsApp Image 2025-05-08 at 03.26.52_6853b407.jpg',
    caption: 'Indian medical students sharing their study experiences at Alte University, Georgia.',
    country: 'Georgia',
    display_order: 10,
    is_active: true,
  },
  {
    _id: 'local-glimpse-2',
    title: 'Clinical Practice Discussion',
    category: 'training',
    categoryLabel: 'Clinical Training',
    image: '/images/alte-meet/WhatsApp Image 2025-05-08 at 03.26.53_42cb5130.jpg',
    caption: 'Alte University medical batch discussing clinical case studies outside the campus lab.',
    country: 'Georgia',
    display_order: 11,
    is_active: true,
  },
  {
    _id: 'local-glimpse-3',
    title: 'Student Assembly at Alte',
    category: 'campus',
    categoryLabel: 'Campus Life',
    image: '/images/alte-meet/WhatsApp Image 2025-05-08 at 03.26.55_6209e60a.jpg',
    caption: 'Student meet and peer interaction program organized on Alte University campus.',
    country: 'Georgia',
    display_order: 12,
    is_active: true,
  },
  {
    _id: 'local-glimpse-4',
    title: 'Kanpur Pre-Departure Seminar',
    category: 'arrivals',
    categoryLabel: 'Student Arrivals',
    image: '/images/kanpur-meet/IMG-20250525-WA0110.jpg',
    caption: 'Selected medical students attending the orientation briefing in Kanpur prior to departure.',
    country: 'India',
    display_order: 13,
    is_active: true,
  },
  {
    _id: 'local-glimpse-5',
    title: 'Academic Briefing Event',
    category: 'arrivals',
    categoryLabel: 'Student Arrivals',
    image: '/images/kanpur-meet/IMG-20250525-WA0115.jpg',
    caption: 'Counseling and visa briefing session for incoming freshmen going abroad.',
    country: 'India',
    display_order: 14,
    is_active: true,
  },
  {
    _id: 'local-glimpse-6',
    title: 'Intermost Kanpur Student Meet',
    category: 'arrivals',
    categoryLabel: 'Student Arrivals',
    image: '/images/kanpur-meet/IMG-20250525-WA0120.jpg',
    caption: 'Addressing parent queries regarding hostel facilities, flight batches, and Indian mess services.',
    country: 'India',
    display_order: 15,
    is_active: true,
  },
  {
    _id: 'local-glimpse-7',
    title: 'Group Photo - Kanpur Meetup',
    category: 'arrivals',
    categoryLabel: 'Student Arrivals',
    image: '/images/kanpur-meet/IMG-20250525-WA0125.jpg',
    caption: 'Students celebrating their university selection during the Kanpur meet.',
    country: 'India',
    display_order: 16,
    is_active: true,
  },
  {
    _id: 'local-glimpse-8',
    title: 'Agra Head Office Consultation',
    category: 'campus',
    categoryLabel: 'Campus Life',
    image: '/images/kanpur/team.jpg',
    caption: 'Intermost Ventures team and senior counseling staff coordinating admissions.',
    country: 'India',
    display_order: 17,
    is_active: true,
  },
  {
    _id: 'local-glimpse-9',
    title: 'Kolkata MBBS Seminar',
    category: 'arrivals',
    categoryLabel: 'Student Arrivals',
    image: '/images/kalkata/1.jpg',
    caption: 'Information session on studying medical courses overseas in Kolkata.',
    country: 'India',
    display_order: 18,
    is_active: true,
  },
  {
    _id: 'local-glimpse-10',
    title: 'Individual Counseling - Kolkata',
    category: 'arrivals',
    categoryLabel: 'Student Arrivals',
    image: '/images/kalkata/4.jpg',
    caption: 'Direct one-on-one document verification and assessment for MBBS admissions.',
    country: 'India',
    display_order: 19,
    is_active: true,
  }
];

export default function GlimpseGallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<Glimpse | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [galleryItems, setGalleryItems] = useState<Glimpse[]>([]);
  const [loading, setLoading] = useState(true);
  const modalRef = React.useRef<HTMLDivElement>(null);

  const getYoutubeId = (url?: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  useEffect(() => {
    const fetchGlimpses = async () => {
      try {
        const data = await glimpsesApi.getAll();
        if (data && data.length > 0) {
          const sorted = [...data].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          setGalleryItems(sorted);
        } else {
          setGalleryItems(localGlimpses);
        }
      } catch (error) {
        console.error('Error fetching glimpses:', error);
        setGalleryItems(localGlimpses);
      } finally {
        setLoading(false);
      }
    };
    fetchGlimpses();
  }, []);

  const filteredItems = galleryItems
    .filter((item) => item.is_active !== false)
    .filter((item) => selectedCategory === 'all' || item.category === selectedCategory);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const categories = [
    { id: 'all', label: 'All Glimpses', icon: Camera },
    { id: 'campus', label: 'Campus & Classes', icon: GraduationCap },
    { id: 'hostel', label: 'Hostel & Indian Mess', icon: Utensils },
    { id: 'arrivals', label: 'Student Arrivals', icon: Plane },
    { id: 'training', label: 'Clinical Training', icon: GraduationCap },
  ];

  // Accessible Modal focus trap and ESC listener
  useEffect(() => {
    if (!activePhoto) return;

    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus first focusable element inside modal
    setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector('button') as HTMLElement;
      if (closeBtn) {
        closeBtn.focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhoto(null);
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [activePhoto]);

  if (loading) {
    return (
      <section className="py-24 bg-white relative flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" aria-hidden="true" />
          <p className="text-gray-500 text-sm">Loading student glimpses...</p>
        </div>
      </section>
    );
  }

  if (filteredItems.length === 0 && galleryItems.length === 0) {
    return null; // Skip section if no items
  }

  const activeYtId = activePhoto ? getYoutubeId(activePhoto.video_url) : '';

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container-custom"
      >
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 text-primary-600 rounded-full font-bold text-xs uppercase tracking-wider mb-4 border border-primary-100">
            <Camera className="w-3.5 h-3.5" aria-hidden="true" />
            Campus Life & Glimpses
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            See Our Students' <span className="gradient-text">Real Journeys</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-4">
            Browse true images and videos of university premises, modern classrooms, departure groups, and our dining halls serving home-style Indian food.
          </p>
        </div>

        {/* Categories Tab Selector (Horizontal scrollable container on mobile) */}
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none sm:flex-wrap items-center justify-start sm:justify-center gap-2.5 mb-12 pb-2 sm:pb-0 snap-x">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg shadow-primary-500/15'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const ytId = getYoutubeId(item.video_url);
              const displayImg = item.image ? getS3AssetUrl(item.image) : (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '/images/placeholder.jpg');

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setActivePhoto(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActivePhoto(item);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View item: ${item.title}`}
                  className="bg-gray-50 rounded-[24px] overflow-hidden border border-gray-200 group cursor-pointer shadow-sm hover:shadow-xl transition-all relative flex flex-col h-[320px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  {/* Photo / Video Thumbnail container */}
                  <div className="relative flex-1 overflow-hidden">
                    <Image
                      src={displayImg}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform scale-75 group-hover:scale-100 transition-all duration-300">
                        {ytId ? (
                          <Play className="w-6 h-6 fill-white ml-0.5" aria-hidden="true" />
                        ) : (
                          <ZoomIn className="w-5 h-5" aria-hidden="true" />
                        )}
                      </div>
                    </div>

                    {/* YouTube Video Badge */}
                    {ytId && (
                      <span className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-red-600/90 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-red-400/30 flex items-center gap-1 shadow-sm">
                        <Play className="w-2.5 h-2.5 fill-white" aria-hidden="true" />
                        Video
                      </span>
                    )}

                    {/* Country Flag Badge (If no video badge or offset) */}
                    {!ytId && (
                      <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/65 backdrop-blur-md text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-white/10">
                        {item.country}
                      </span>
                    )}

                    {/* Category Badge */}
                    <span className="absolute top-4 right-4 z-20 px-2.5 py-1 bg-primary/85 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg shadow-sm">
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Info Text footer */}
                  <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between z-20">
                    <div className="min-w-0 flex-1 pr-3">
                      <h4 className="font-bold text-gray-900 text-sm truncate leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                        {item.caption}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Like ${item.title}`}
                      onClick={(e) => handleLike(item._id || '', e)}
                      className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 border border-gray-100 rounded-xl px-2.5 py-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          item._id && likes[item._id] ? 'text-red-500 fill-red-500' : 'text-gray-400'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{item._id ? likes[item._id] || 0 : 0}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Full Screen Lightbox / Video Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div 
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePhoto(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-3xl overflow-hidden border border-white/10 w-full max-w-4xl relative z-10 flex flex-col max-h-[90vh] shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                aria-label="Close preview modal"
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-black/90 rounded-full text-white border border-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Photo or YouTube Video Box */}
              <div className="relative flex-1 bg-black min-h-[300px] md:min-h-[460px] flex items-center justify-center">
                {activeYtId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeYtId}?autoplay=1&rel=0`}
                    title={activePhoto.title}
                    className="w-full h-full min-h-[320px] md:min-h-[460px] border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <Image
                    src={getS3AssetUrl(activePhoto.image)}
                    alt={activePhoto.title}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              {/* Detail Description */}
              <div className="p-6 md:p-8 bg-gray-950 text-white space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary-300 font-extrabold text-[10px] uppercase tracking-wider rounded-lg border border-primary-500/25">
                    {activePhoto.categoryLabel}
                  </span>
                  {activeYtId && (
                    <span className="px-3 py-1 bg-red-600/30 text-red-400 font-extrabold text-[10px] uppercase tracking-wider rounded-lg border border-red-500/30 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-red-400" aria-hidden="true" />
                      YouTube Video
                    </span>
                  )}
                  <span className="px-3 py-1 bg-white/5 text-gray-300 font-extrabold text-[10px] uppercase tracking-wider rounded-lg border border-white/10">
                    {activePhoto.country}
                  </span>
                </div>
                <h3 id="lightbox-title" className="text-xl md:text-2xl font-bold">{activePhoto.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                  {activePhoto.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
