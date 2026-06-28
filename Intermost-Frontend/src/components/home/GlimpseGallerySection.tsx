'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Eye, X, ZoomIn, Heart, GraduationCap, Utensils, Plane } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'campus' | 'hostel' | 'arrivals' | 'training';
  categoryLabel: string;
  image: string;
  caption: string;
  country: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Anatomy Lab Practicals',
    category: 'training',
    categoryLabel: 'Clinical Training',
    image: '/images/russia/var.jpg',
    caption: 'Students practicing real dissection and anatomical analysis under certified foreign professors.',
    country: 'Russia',
  },
  {
    id: '2',
    title: 'Student Orientation Moscow',
    category: 'arrivals',
    categoryLabel: 'Arrival Orientations',
    image: '/images/russia/yaro.jpg',
    caption: 'Indian students orientation meeting at Yaroslavl State Medical University.',
    country: 'Russia',
  },
  {
    id: '3',
    title: 'Indian Hostel Mess Dining',
    category: 'hostel',
    categoryLabel: 'Hostel & Food',
    image: '/images/boys.jpg',
    caption: 'A view of the hostel mess dining hall serving fresh, hot Indian lunch menu prepared by Indian chefs.',
    country: 'Uzbekistan',
  },
  {
    id: '4',
    title: 'Clinical Diagnostics Lab',
    category: 'training',
    categoryLabel: 'Clinical Training',
    image: '/images/russia/iva.jpg',
    caption: 'Hands-on practice with hospital testing equipment at Volgograd Medical Academy diagnostics wing.',
    country: 'Russia',
  },
  {
    id: '5',
    title: 'University Main Campus Walkway',
    category: 'campus',
    categoryLabel: 'Campus Life',
    image: '/images/russia/bashkir.jpg',
    caption: 'Group of Indian students in front of the main library gate at Bashkir State Medical University.',
    country: 'Russia',
  },
  {
    id: '6',
    title: 'Departure Group Delhi Airport',
    category: 'arrivals',
    categoryLabel: 'Arrival Orientations',
    image: '/images/BT.jpg',
    caption: 'Orientation departure group flight boarding for Georgia & Russia batches at Delhi IGI Airport terminal.',
    country: 'Georgia / Russia',
  },
  {
    id: '7',
    title: 'Pre-Departure Counseling Seminar',
    category: 'arrivals',
    categoryLabel: 'Arrival Orientations',
    image: '/images/BT1.jpg',
    caption: 'Parents and student counseling batch briefing seminar prior to visa allocations.',
    country: 'General',
  },
];

export default function GlimpseGallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

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

  return (
    <section className="py-24 bg-white relative">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 text-primary-650 rounded-full font-bold text-xs uppercase tracking-wider mb-4 border border-primary-100">
            <Camera className="w-3.5 h-3.5" />
            Campus Life & Glimpses
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            See Our Students' <span className="gradient-text">Real Journeys</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-4">
            Browse true images of university premises, modern classrooms, departure groups, and our dining halls serving home-style Indian food.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg shadow-primary-500/15'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-605 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
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
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActivePhoto(item)}
                className="bg-gray-50 rounded-[24px] overflow-hidden border border-gray-200 group cursor-pointer shadow-sm hover:shadow-xl transition-all relative flex flex-col h-[320px]"
              >
                {/* Photo container */}
                <div className="relative flex-1 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform scale-75 group-hover:scale-100 transition-all duration-300">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Country Flag Badge */}
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/65 backdrop-blur-md text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-white/10">
                    {item.country}
                  </span>

                  {/* Category Badge */}
                  <span className="absolute top-4 right-4 z-20 px-2.5 py-1 bg-primary/85 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg shadow-sm">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Info Text footer */}
                <div className="p-4 bg-white border-t border-gray-150 flex items-center justify-between z-20">
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="font-bold text-gray-900 text-sm truncate leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                      {item.caption}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleLike(item.id, e)}
                    className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 border border-gray-150 rounded-xl px-2.5 py-1"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        likes[item.id] ? 'text-red-500 fill-red-500' : 'text-gray-400'
                      }`}
                    />
                    <span>{likes[item.id] || 0}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full Screen Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-black/90 rounded-full text-white border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo Box */}
              <div className="relative flex-1 bg-black min-h-[300px] md:min-h-[460px]">
                <Image
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Detail Description */}
              <div className="p-6 md:p-8 bg-gray-950 text-white space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary-300 font-extrabold text-[10px] uppercase tracking-wider rounded-lg border border-primary-500/25">
                    {activePhoto.categoryLabel}
                  </span>
                  <span className="px-3 py-1 bg-white/5 text-gray-300 font-extrabold text-[10px] uppercase tracking-wider rounded-lg border border-white/10">
                    {activePhoto.country}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">{activePhoto.title}</h3>
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
