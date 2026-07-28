'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, CheckCircle2, ChevronRight, Download, BookOpen, Star } from 'lucide-react';
import BrochureDownloadModal from '@/components/common/BrochureDownloadModal';
import { coreApi } from '@/lib/services';

interface MapDestination {
  id: string;
  name: string;
  slug: string;
  coords: { x: number; y: number }; // Coordinates on our custom eurasia SVG container
  placements: string;
  avgFee: string;
  visaRate: string;
  language: string;
  universities: string[];
}

const destinations: MapDestination[] = [
  {
    id: 'russia',
    name: 'Globally',
    slug: 'russia',
    coords: { x: 580, y: 140 },
    placements: '3,800+ Students Placed',
    avgFee: '$3,800 - $6,000 / Year',
    visaRate: '99% Success Rate',
    language: 'Fully English Medium',
    universities: ['Orenburg State Medical University', 'Kazan Federal University', 'Bashkir State Medical University'],
  },
  {
    id: 'georgia',
    name: 'Georgia',
    slug: 'georgia',
    coords: { x: 598, y: 215 },
    placements: '950+ Students Placed',
    avgFee: '$5,000 - $8,000 / Year',
    visaRate: '99% Success Rate',
    language: 'English & Georgian Dual Option',
    universities: ['Tbilisi State Medical University', 'East European University'],
  },
  {
    id: 'uzbekistan',
    name: 'Uzbekistan',
    slug: 'uzbekistan',
    coords: { x: 645, y: 226 },
    placements: '1,400+ Students Placed',
    avgFee: '$3,300 - $4,500 / Year',
    visaRate: '99% Success Rate',
    language: 'Fully English Medium',
    universities: ['Tashkent Medical Academy', 'Samarkand State Medical University'],
  },
  {
    id: 'kazakhstan',
    name: 'Kazakhstan',
    slug: 'kazakhstan',
    coords: { x: 660, y: 195 },
    placements: '1,100+ Students Placed',
    avgFee: '$3,500 - $5,000 / Year',
    visaRate: '99% Success Rate',
    language: 'Fully English Medium',
    universities: ['Asfendiyarov Kazakh National Medical University', 'Semey Medical University'],
  },
  {
    id: 'nepal',
    name: 'Nepal',
    slug: 'nepal',
    coords: { x: 706, y: 350 },
    placements: '800+ Students Placed',
    avgFee: '₹55 - ₹65 Lakhs (Total)',
    visaRate: '99% Success Rate',
    language: 'English / Hindi Friendly',
    universities: ['Tribhuvan University', 'Kathmandu University'],
  },
  {
    id: 'tajikistan',
    name: 'Tajikistan',
    slug: 'tajikistan',
    coords: { x: 649, y: 240 },
    placements: '450+ Students Placed',
    avgFee: '$3,500 / Year',
    visaRate: '99% Success Rate',
    language: 'Fully English Medium',
    universities: ['Tajik State Medical University'],
  },
];

const flagUrls: Record<string, string> = {
  russia: 'https://flagcdn.com/w40/ru.png',
  georgia: 'https://flagcdn.com/w40/ge.png',
  uzbekistan: 'https://flagcdn.com/w40/uz.png',
  kazakhstan: 'https://flagcdn.com/w40/kz.png',
  nepal: 'https://flagcdn.com/w40/np.png',
  tajikistan: 'https://flagcdn.com/w40/tj.png',
};

export default function PlacementsMapSection() {
  const [selectedDest, setSelectedDest] = useState<MapDestination>(destinations[0]);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [siteStats, setSiteStats] = useState({
    students_placed: 5500,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings && settings.stats && settings.stats.students_placed) {
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
    let count = 0;
    switch (destId) {
      case 'russia':
        count = total - 1700;
        break;
      case 'uzbekistan':
        count = total - 4100;
        break;
      case 'kazakhstan':
        count = total - 4400;
        break;
      case 'georgia':
        count = total - 4550;
        break;
      case 'nepal':
        count = total - 4700;
        break;
      case 'tajikistan':
        count = total - 4900;
        break;
      default:
        return destinations.find(d => d.id === destId)?.placements || '';
    }
    return `${count.toLocaleString()}+ Students Placed`;
  };

  return (
    <section className="py-24 bg-gray-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-secondary-500/10 blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary-500/10 text-primary-400 border border-primary-500/20">
            <Globe className="w-3.5 h-3.5" />
            Global Alumni footprint
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 leading-tight">
            Our Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400">Placements Map</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-4">
            We guide thousands of Indian students to leading certified medical universities worldwide. Click any pulsing destination hotspot to inspect alumni statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left panel: Interactive World Map */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[32px] p-6 shadow-2xl relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
            <div 
              className="relative w-full h-full aspect-[1000/600] transition-transform duration-500"
              style={{
                transform: 'scale(1.9) translate(-14%, 8%)',
                transformOrigin: 'center center',
              }}
            >
              <img
                src="/images/world-map.svg"
                alt="World Map"
                className="w-full h-full object-contain opacity-35 select-none pointer-events-none absolute inset-0 z-0"
              />

              <svg
                viewBox="0 0 1000 600"
                className="w-full h-full select-none pointer-events-none absolute inset-0 z-10"
              >
                {/* Fake grid lines */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Flight Paths from India (Source: 688, 362) */}
                {destinations.map((dest) => (
                  <g key={`path-${dest.id}`}>
                    {/* Dotted path curve */}
                    <path
                      d={`M 688 362 Q ${(688 + dest.coords.x) / 2} ${(362 + dest.coords.y) / 2 - 30} ${dest.coords.x} ${dest.coords.y}`}
                      fill="none"
                      stroke={selectedDest.id === dest.id ? '#0d9488' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={selectedDest.id === dest.id ? 2 : 1}
                      strokeDasharray="4 4"
                      className="transition-colors duration-300"
                    />
                    {/* Animated dot indicator flying along path */}
                    <circle r="3" fill="#2dd4bf" className="pointer-events-none">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M 688 362 Q ${(688 + dest.coords.x) / 2} ${(362 + dest.coords.y) / 2 - 30} ${dest.coords.x} ${dest.coords.y}`}
                      />
                    </circle>
                  </g>
                ))}

                {/* India Source Pin */}
                <circle cx="688" cy="362" r="7" fill="#0d9488" className="animate-pulse" />
                <circle cx="688" cy="362" r="3" fill="#5eead4" />
              </svg>

              {/* Interactive buttons absolute positioning */}
              <div className="absolute inset-0 z-20 pointer-events-auto">
                {/* India Label */}
                <div 
                  className="absolute flex items-center gap-1.5 pointer-events-none"
                  style={{ left: '68.8%', top: '60.3%' }}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20">
                    <img src="https://flagcdn.com/w40/in.png" alt="India flag" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest bg-black/60 px-1.5 py-0.5 rounded">
                    India
                  </span>
                </div>

                {/* Destination Hotspots */}
                {destinations.map((dest) => {
                  const isSelected = selectedDest.id === dest.id;
                  return (
                    <button
                      key={`node-${dest.id}`}
                      onClick={() => setSelectedDest(dest)}
                      style={{ left: `${dest.coords.x / 10}%`, top: `${dest.coords.y / 6}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    >
                      {/* Ripple rings */}
                      <span
                        className={`absolute inset-0 -m-3.5 rounded-full animate-ping opacity-60 ${
                          isSelected ? 'bg-primary-500' : 'bg-gray-450 group-hover:bg-primary-500/40'
                        }`}
                        style={{ animationDuration: '2s' }}
                      />
                      
                      {/* Inner flag button */}
                      <div
                        className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center transition-all shadow-lg border-2 bg-gray-900 ${
                          isSelected
                            ? 'scale-125 border-primary-400'
                            : 'border-white/20 hover:scale-110 hover:border-white/50'
                        }`}
                      >
                        <img
                          src={flagUrls[dest.id] || `/flags/${dest.id}.png`}
                          alt={`${dest.name} flag`}
                          className="w-full h-full object-cover select-none pointer-events-none"
                        />
                      </div>

                      {/* Hover text preview label */}
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-gray-800 text-white font-extrabold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded shadow-sm whitespace-nowrap z-20">
                        {dest.name}
                      </span>
                    </button>
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
                {/* Visual line decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl" />

                <div className="space-y-6">
                  {/* Country Title */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        MBBS Abroad - {selectedDest.name}
                      </h3>
                      <p className="text-xs text-primary-400 font-semibold tracking-wider uppercase mt-1">
                        Placement Profile
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-primary-400" />
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Students Placed</p>
                      <p className="text-sm font-extrabold text-white mt-1">{getDynamicPlacements(selectedDest.id)}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Average Fees</p>
                      <p className="text-sm font-extrabold text-white mt-1">{selectedDest.avgFee}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Visa Success</p>
                      <p className="text-sm font-extrabold text-white mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {selectedDest.visaRate}
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Language medium</p>
                      <p className="text-sm font-extrabold text-white mt-1">{selectedDest.language}</p>
                    </div>
                  </div>

                  {/* Sample Universities */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-primary-400" />
                      Top Recognized Universities
                    </p>
                    <div className="space-y-2">
                      {selectedDest.universities.map((uni, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs hover:bg-white/10 transition-colors"
                        >
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold text-gray-250 truncate">{uni}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-white/10">
                  <button
                    onClick={() => setIsDownloadOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-primary-500/10 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Prospectus
                  </button>
                  <a
                    href={`/countries/${selectedDest.slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-white/10 hover:bg-white/5 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm transition-colors"
                  >
                    View College Fee Plans
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Prospectus download modal context */}
      <BrochureDownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        countryName={selectedDest.name}
      />
    </section>
  );
}
