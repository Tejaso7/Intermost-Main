'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, CheckCircle2, ChevronRight, Download, BookOpen, Star, LayoutGrid, Map as MapIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import BrochureDownloadModal from '@/components/common/BrochureDownloadModal';
import { coreApi } from '@/lib/services';
import Link from 'next/link';

interface MapDestination {
  id: string;
  name: string;
  slug: string;
  flagUrl: string;
  coords: { x: number; y: number; labelPos: 'top' | 'bottom' | 'left' | 'right' };
  placements: string;
  avgFee: string;
  visaRate: string;
  language: string;
  universities: string[];
  description: string;
}

const destinations: MapDestination[] = [
  {
    id: 'russia',
    name: 'Russia',
    slug: 'russia',
    flagUrl: 'https://flagcdn.com/w80/ru.png',
    coords: { x: 590, y: 175, labelPos: 'top' },
    placements: '5,953+ Students Placed',
    avgFee: '$3,500 / Year (~₹2.9L)',
    visaRate: '99% Success',
    language: '100% English Medium',
    universities: [
      'Yaroslavl State Medical University',
      'Izhevsk State Medical Academy',
      'Voronezh State Medical University',
      'Bashkir State Medical University',
      'Crimea Federal University',
      'Kazan Federal University'
    ],
    description: 'Home to top government medical universities with 100+ years of legacy and high FMGE pass rates.'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    slug: 'georgia',
    flagUrl: 'https://flagcdn.com/w80/ge.png',
    coords: { x: 540, y: 280, labelPos: 'left' },
    placements: '1,250+ Students Placed',
    avgFee: '$5,000 / Year (~₹4.2L)',
    visaRate: '99% Success',
    language: 'European Curriculum',
    universities: [
      'Alte University',
      'Geomedi Medical University',
      'Georgian National University (SEU)',
      'East European University',
      'Tbilisi State Medical University',
      'Caucasus International University'
    ],
    description: 'European standard medical education with WHO, WFME & ECFMG recognition and USMLE focused training.'
  },
  {
    id: 'uzbekistan',
    name: 'Uzbekistan',
    slug: 'uzbekistan',
    flagUrl: 'https://flagcdn.com/w80/uz.png',
    coords: { x: 630, y: 275, labelPos: 'left' },
    placements: '1,480+ Students Placed',
    avgFee: '$3,500 / Year (~₹2.9L)',
    visaRate: '99% Success',
    language: '100% English Medium',
    universities: [
      'Andijan State Medical Institute',
      'Tashkent State Medical University',
      'Samarkand State Medical University',
      'Bukhara State Medical Institute'
    ],
    description: 'Ultra-budget medical study with Indian food mess, high safety index, and close geographic proximity to India.'
  },
  {
    id: 'kazakhstan',
    name: 'Kazakhstan',
    slug: 'kazakhstan',
    flagUrl: 'https://flagcdn.com/w80/kz.png',
    coords: { x: 670, y: 220, labelPos: 'top' },
    placements: '1,120+ Students Placed',
    avgFee: '$3,600 / Year (~₹3.0L)',
    visaRate: '99% Success',
    language: '100% English Medium',
    universities: [
      'Asfendiyarov Kazakh National Medical University',
      'Semey Medical University',
      'West Kazakhstan Marat Ospanov Medical University'
    ],
    description: '5-year compact MBBS program compliant with latest NMC guidelines & clinical hospital rotations.'
  },
  {
    id: 'tajikistan',
    name: 'Tajikistan',
    slug: 'tajikistan',
    flagUrl: 'https://flagcdn.com/w80/tj.png',
    coords: { x: 685, y: 295, labelPos: 'right' },
    placements: '480+ Students Placed',
    avgFee: '$3,500 / Year (~₹2.9L)',
    visaRate: '99% Success',
    language: 'English Medium',
    universities: [
      'Tajik National University',
      'Avicenna Tajik State Medical University'
    ],
    description: 'Affordable medical university with government recognition and comprehensive hostel facilities.'
  },
  {
    id: 'nepal',
    name: 'Nepal',
    slug: 'nepal',
    flagUrl: 'https://flagcdn.com/w80/np.png',
    coords: { x: 745, y: 330, labelPos: 'top' },
    placements: '850+ Students Placed',
    avgFee: '₹55 Lakhs (Package)',
    visaRate: '100% Success (No Visa Needed)',
    language: 'English & Hindi Friendly',
    universities: [
      'Chitwan Medical College',
      'Kathmandu Medical College',
      'B&C Medical College'
    ],
    description: 'Similar pattern to Indian MBBS, no passport/visa hassle for Indian citizens, and immediate proximity.'
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    slug: 'vietnam',
    flagUrl: 'https://flagcdn.com/w80/vn.png',
    coords: { x: 815, y: 380, labelPos: 'bottom' },
    placements: '350+ Students Placed',
    avgFee: '$4,200 / Year (~₹3.5L)',
    visaRate: '99% Success',
    language: '100% English Medium',
    universities: [
      'Can Tho University of Medicine and Pharmacy',
      'Hanoi Medical University'
    ],
    description: 'Emerging destination with state-of-the-art medical equipment, English medium instruction, and safe environment.'
  }
];

export default function PlacementsMapSection() {
  const [selectedDest, setSelectedDest] = useState<MapDestination>(destinations[0]);
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('map');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [siteStats, setSiteStats] = useState({
    students_placed: 5953,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setViewMode('cards');
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings?.stats?.students_placed) {
          setSiteStats({
            students_placed: settings.stats.students_placed,
          });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const getDynamicPlacements = (destId: string) => {
    const total = siteStats.students_placed;
    if (destId === 'russia') return `${total.toLocaleString()}+ Students Placed`;
    
    let count = 0;
    switch (destId) {
      case 'uzbekistan': count = Math.round(total * 0.25); break;
      case 'georgia': count = Math.round(total * 0.21); break;
      case 'kazakhstan': count = Math.round(total * 0.19); break;
      case 'nepal': count = Math.round(total * 0.14); break;
      case 'tajikistan': count = Math.round(total * 0.08); break;
      case 'vietnam': count = Math.round(total * 0.06); break;
      default: return destinations.find(d => d.id === destId)?.placements || '';
    }
    return `${count.toLocaleString()}+ Students Placed`;
  };

  return (
    <section className="py-16 sm:py-24 bg-gray-950 text-white relative overflow-hidden pb-24 md:pb-28">
      {/* Ambient Background Gradient Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[10%] w-[380px] h-[380px] rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[10%] w-[480px] h-[480px] rounded-full bg-secondary-500/10 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container-custom relative z-10"
      >
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-3">
            <Globe className="w-4 h-4 text-primary-400" />
            Global Alumni Footprint
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Our Placements & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-teal-300 to-secondary-400">Global Reach</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            We have placed <span className="text-primary-300 font-bold">{siteStats.students_placed.toLocaleString()}+ Indian students</span> into top NMC & WHO-recognized medical universities across 7 primary countries.
          </p>

          {/* View Mode Switcher */}
          <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 mt-6 shadow-lg">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              aria-label="Switch to Country Grid View"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                viewMode === 'cards'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
              Country Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              aria-label="Switch to Interactive Map View"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-4 h-4" aria-hidden="true" />
              Interactive Map View
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: COUNTRY GRID VIEW (Default & Mobile Friendly) */}
        {/* ========================================================================= */}
        {viewMode === 'cards' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {destinations.map((dest) => {
                const isSelected = selectedDest.id === dest.id;

                return (
                  <div
                    key={dest.id}
                    onClick={() => setSelectedDest(dest)}
                    className={`group cursor-pointer rounded-3xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white/10 border-primary-400/80 shadow-2xl shadow-primary-500/10 ring-2 ring-primary-500/40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg'
                    }`}
                  >
                    <div>
                      {/* Flag + Country Name */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/20 shadow-md flex-shrink-0 bg-gray-900">
                            <img
                              src={dest.flagUrl}
                              alt={`${dest.name} flag`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                              {dest.name}
                            </h3>
                            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              NMC Approved
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse" />
                        )}
                      </div>

                      <p className="text-xs text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                        {dest.description}
                      </p>

                      {/* Stat Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                        <div className="bg-black/30 rounded-xl p-2.5 border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Placed</span>
                          <span className="text-xs font-extrabold text-white">{getDynamicPlacements(dest.id)}</span>
                        </div>
                        <div className="bg-black/30 rounded-xl p-2.5 border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting Tuition Fee</span>
                          <span className="text-xs font-extrabold text-primary-300">{dest.avgFee}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDest(dest);
                          setIsDownloadOpen(true);
                        }}
                        className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5 text-primary-400" />
                        Brochure
                      </button>

                      <Link
                        href={`/countries/${dest.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary-400 hover:text-primary-300 bg-primary-500/10 px-3 py-1.5 rounded-xl border border-primary-500/20 hover:bg-primary-500/20 transition-all"
                      >
                        View Universities
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Destination Detail Sheet */}
            <motion.div
              key={`detail-${selectedDest.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-gray-900 flex-shrink-0">
                    <img src={selectedDest.flagUrl} alt={selectedDest.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      MBBS in {selectedDest.name}
                    </h3>
                    <p className="text-xs text-primary-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
                      <span>{selectedDest.language}</span>
                      <span>•</span>
                      <span>{selectedDest.visaRate} Visa</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => setIsDownloadOpen(true)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-primary-500/20 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download {selectedDest.name} PDF Guide
                  </button>
                  <Link
                    href={`/countries/${selectedDest.slug}`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm border border-white/20 transition-colors"
                  >
                    Explore All {selectedDest.name} Colleges
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Sample Universities */}
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-primary-400" />
                  Top NMC Recognized Colleges in {selectedDest.name}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedDest.universities.map((uni, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-3.5 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold text-gray-200"
                    >
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      <span className="truncate">{uni}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: INTERACTIVE HIGH-CONTRAST MAP VIEW */}
        {/* ========================================================================= */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left panel: Interactive SVG Map Container */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[32px] p-6 shadow-2xl relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full aspect-[1000/600]">
                {/* World Map SVG background */}
                <img
                  src="/images/world-map.svg"
                  alt="World Map"
                  className="w-full h-full object-contain opacity-30 select-none pointer-events-none absolute inset-0 z-0"
                />

                <svg viewBox="0 0 1000 600" className="w-full h-full select-none pointer-events-none absolute inset-0 z-10">
                  <defs>
                    <pattern id="grid-dots" width="25" height="25" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.06)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-dots)" />

                  {/* Flight Paths from India (Source: 730, 305) */}
                  {destinations.map((dest) => (
                    <g key={`path-${dest.id}`}>
                      <path
                        d={`M 730 305 Q ${(730 + dest.coords.x) / 2} ${(305 + dest.coords.y) / 2 - 35} ${dest.coords.x} ${dest.coords.y}`}
                        fill="none"
                        stroke={selectedDest.id === dest.id ? '#38bdf8' : 'rgba(255,255,255,0.15)'}
                        strokeWidth={selectedDest.id === dest.id ? 2.5 : 1}
                        strokeDasharray="4 4"
                        className="transition-colors duration-300"
                      />
                      <circle r="3" fill="#38bdf8" className="pointer-events-none motion-reduce:animate-none">
                        <animateMotion
                          dur="3.5s"
                          repeatCount="indefinite"
                          path={`M 730 305 Q ${(730 + dest.coords.x) / 2} ${(305 + dest.coords.y) / 2 - 35} ${dest.coords.x} ${dest.coords.y}`}
                        />
                      </circle>
                    </g>
                  ))}

                  {/* India Source Marker */}
                  <circle cx="730" cy="305" r="8" fill="#0284c7" className="motion-reduce:animate-none animate-pulse" />
                  <circle cx="730" cy="305" r="3" fill="#e0f2fe" />
                </svg>

                {/* Country Marker Buttons */}
                <div className="absolute inset-0 z-20 pointer-events-auto">
                  {/* India Label */}
                  <div className="absolute flex items-center gap-1.5 pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{ left: '73%', top: '50.8%' }}>
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30 shadow-md">
                      <img src="https://flagcdn.com/w40/in.png" alt="India flag" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-extrabold text-sky-300 uppercase tracking-wider bg-black/80 px-2 py-0.5 rounded-lg border border-sky-500/30">
                      India
                    </span>
                  </div>

                  {/* Destination Markers */}
                  {destinations.map((dest) => {
                    const isSelected = selectedDest.id === dest.id;
                    const pos = dest.coords.labelPos;

                    return (
                      <div
                        key={`node-${dest.id}`}
                        style={{ left: `${dest.coords.x / 10}%`, top: `${dest.coords.y / 6}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedDest(dest)}
                          className={`group relative flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-full ${
                            pos === 'left'
                              ? 'flex-row-reverse gap-1.5'
                              : pos === 'right'
                              ? 'flex-row gap-1.5'
                              : pos === 'top'
                              ? 'flex-col-reverse gap-1'
                              : 'flex-col gap-1'
                          }`}
                          aria-label={`Select ${dest.name} destination pin`}
                        >
                          {/* Flag Circle Pin Container */}
                          <div className="relative flex items-center justify-center flex-shrink-0">
                            {/* Pulse Ring ONLY on selected pin */}
                            {isSelected && (
                              <span className="absolute -inset-1 rounded-full bg-primary-400 opacity-75 animate-ping" />
                            )}

                            {/* Flag Circle */}
                            <div
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex items-center justify-center transition-all shadow-md border-2 bg-gray-900 relative z-10 ${
                                isSelected
                                  ? 'scale-125 border-primary-400 ring-2 ring-primary-400/50'
                                  : 'border-white/70 opacity-90 group-hover:opacity-100 group-hover:scale-115 group-hover:border-white'
                              }`}
                            >
                              <img
                                src={dest.flagUrl}
                                alt={`${dest.name} flag`}
                                className="w-full h-full object-cover select-none pointer-events-none"
                              />
                            </div>
                          </div>

                          {/* Directional Country Label */}
                          <span
                            className={`font-bold text-[9px] sm:text-[10px] uppercase tracking-wider py-0.5 px-1.5 rounded-md border shadow-md whitespace-nowrap transition-all ${
                              isSelected
                                ? 'bg-primary-600 text-white border-primary-400 shadow-primary-900/50 scale-105'
                                : 'bg-gray-950/90 text-gray-300 border-white/10 group-hover:bg-black group-hover:text-white group-hover:border-white/30'
                            }`}
                          >
                            {dest.name}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right panel: Information Card */}
            <div className="lg:col-span-5 h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDest.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 border border-white/10 rounded-[30px] p-6 sm:p-8 flex flex-col justify-between h-full backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="space-y-6">
                    {/* Country Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shadow-md bg-gray-900 flex-shrink-0">
                          <img src={selectedDest.flagUrl} alt={selectedDest.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            MBBS in {selectedDest.name}
                          </h3>
                          <p className="text-xs text-primary-400 font-semibold tracking-wider uppercase mt-0.5">
                            Placement & Alumni Stats
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Students Placed</p>
                        <p className="text-sm font-extrabold text-white mt-1">{getDynamicPlacements(selectedDest.id)}</p>
                      </div>
                      <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Starting Tuition Fee</p>
                        <p className="text-sm font-extrabold text-primary-300 mt-1">{selectedDest.avgFee}</p>
                      </div>
                      <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Visa Success</p>
                        <p className="text-sm font-extrabold text-white mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {selectedDest.visaRate}
                        </p>
                      </div>
                      <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Medium</p>
                        <p className="text-xs font-extrabold text-white mt-1">{selectedDest.language}</p>
                      </div>
                    </div>

                    {/* Top Universities & Colleges */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary-400" />
                        Top Universities & Colleges
                      </p>
                      <div className="space-y-2">
                        {selectedDest.universities.map((uni, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 px-3 py-2.5 bg-black/30 border border-white/5 rounded-xl text-xs hover:bg-black/50 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                            <span className="font-semibold text-gray-200 truncate">{uni}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-white/10">
                    <button
                      onClick={() => setIsDownloadOpen(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Prospectus
                    </button>
                    <Link
                      href={`/countries/${selectedDest.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-white/15 hover:bg-white/10 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm transition-colors"
                    >
                      View Colleges
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>

      {/* Prospectus download modal context */}
      <BrochureDownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        countryName={selectedDest.name}
      />
    </section>
  );
}

