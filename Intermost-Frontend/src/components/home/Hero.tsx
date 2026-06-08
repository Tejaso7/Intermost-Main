'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles, CheckCircle, RefreshCw, AlertTriangle, GraduationCap } from 'lucide-react';
import { scrollToElement } from '@/lib/utils';

interface MatchResult {
  score: number;
  status: 'Excellent' | 'Good' | 'Needs Review';
  message: string;
  universities: string[];
}

export default function Hero() {
  const [videoError, setVideoError] = useState(true);

  // AI Matcher State
  const [targetCountry, setTargetCountry] = useState('');
  const [neetQualified, setNeetQualified] = useState('');
  const [pcbMarks, setPcbMarks] = useState('');
  const [budget, setBudget] = useState('');
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationStep, setCalculationStep] = useState(0);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const steps = [
    'Analyzing target destination qualifications...',
    'Checking NMC & WHO approved rosters...',
    'Matching university fee structures...',
    'Calculating admission probability...'
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalculating) {
      if (calculationStep < steps.length) {
        timer = setTimeout(() => {
          setCalculationStep(prev => prev + 1);
        }, 850);
      } else {
        // Compute match logic
        let score = 95;
        let status: 'Excellent' | 'Good' | 'Needs Review' = 'Excellent';
        let message = 'Congratulations! You meet all core requirements for this country.';
        let recommendedUnis: string[] = [];

        // NEET check
        if (neetQualified === 'No') {
          score -= 40;
          status = 'Needs Review';
          message = 'NEET is mandatory for Indian students to practice in India. You can study, but cannot sit for NEXT exam without it.';
        }

        // PCB check
        if (pcbMarks === 'Below 50%') {
          score -= 20;
          status = score < 60 ? 'Needs Review' : 'Good';
          message = neetQualified === 'No' 
            ? 'Both NEET status and academic percentages need manual evaluation. Please request direct counseling.'
            : 'NMC requires a minimum of 50% in PCB (40% for reserved categories). We need to review your school board eligibility.';
        }

        // Target Country & budget recommendation
        if (targetCountry === 'Russia') {
          recommendedUnis = ['Kazan Federal University', 'Volgograd State Medical University', 'Bashkir State Medical University'];
          if (budget === 'Low' && score > 70) score = Math.min(score + 3, 100);
        } else if (targetCountry === 'Georgia') {
          recommendedUnis = ['Tbilisi State Medical University', 'Batumi Shota Rustaveli University'];
          if (budget === 'Low') {
            score -= 15;
            message = 'Georgia tuition & hostels are higher. Consider Russia or Uzbekistan for a lower budget.';
          }
        } else if (targetCountry === 'Uzbekistan') {
          recommendedUnis = ['Tashkent Medical Academy', 'Samarkand State Medical University'];
          if (budget === 'Low' && score > 70) score = Math.min(score + 4, 100);
        } else if (targetCountry === 'Kazakhstan') {
          recommendedUnis = ['Asfendiyarov Kazakh National Medical University', 'Semey State Medical University'];
        } else if (targetCountry === 'Nepal') {
          recommendedUnis = ['Tribhuvan University', 'Kathmandu University'];
          if (budget === 'Low' || budget === 'Medium') {
            score -= 30;
            status = 'Needs Review';
            message = 'Nepal courses start from ₹55 Lakhs+. A medium/low budget is insufficient for Nepal universities.';
          }
        } else {
          recommendedUnis = ['Tajik State Medical University'];
        }

        setMatchResult({
          score: Math.max(10, score),
          status,
          message,
          universities: recommendedUnis
        });
        setIsCalculating(false);
      }
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalculating, calculationStep]);

  const handleStartCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCountry || !neetQualified || !pcbMarks || !budget) return;
    setIsCalculating(true);
    setCalculationStep(0);
    setMatchResult(null);
  };

  const handleReset = () => {
    setTargetCountry('');
    setNeetQualified('');
    setPcbMarks('');
    setBudget('');
    setMatchResult(null);
  };

  const handleScrollDown = () => {
    scrollToElement('news-section', 100);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[90px] pb-12 sm:pt-[100px] md:pt-[110px]">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/images/countries/russia.jpg"
            onError={() => setVideoError(true)}
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/countries/russia.jpg"
            alt="Medical Education"
            fill
            className="object-cover scale-105 filter brightness-[0.7]"
            priority
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />
      </div>

      {/* Floating Glowing Spheres - 3D/Parallax Look */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-primary-600/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] rounded-full bg-secondary-600/15 blur-3xl"
        />
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 container-custom w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mt-6 lg:mt-0">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 text-left text-white space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg"
            >
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-400/50" />
              <span className="font-semibold text-xs sm:text-sm tracking-wide text-primary-200">Admissions Open 2026 • Certified Partner</span>
            </motion.div>

            <div className="space-y-4 max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
              >
                Your Gateway to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 animate-gradient">
                  Global Medical
                </span>{' '}
                Education
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed font-light"
              >
                Study MBBS at WHO & NMC approved universities in Russia, Georgia, 
                Uzbekistan, and more. Transparent pricing, 100% English medium, and guaranteed admission letters.
              </motion.p>
            </div>

            {/* Quick stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl"
            >
              {[
                { value: '5500+', label: 'Students Placed' },
                { value: '35+', label: 'Partner Colleges' },
                { value: '21+', label: 'Years Experience' },
                { value: '99%', label: 'Visa Success' },
              ].map((stat, i) => (
                <div key={i} className="p-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <p className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-secondary-300">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-300 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Link
                href="/apply"
                className="btn-primary group shadow-xl shadow-primary-600/35 px-8 py-3.5 text-center flex items-center justify-center gap-2"
              >
                Apply Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                href="/countries"
                className="btn-white px-8 py-3.5 text-center flex items-center justify-center border border-white/10"
              >
                Explore Countries
              </Link>
            </motion.div>
          </div>

          {/* Right Column: AI Matcher Widget */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Back card decoration for 3D look */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[32px] blur-xl opacity-35 -z-10 translate-x-3 translate-y-3" />
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] p-6 sm:p-8 text-left text-white shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                      Admission Predictor
                    </h3>
                    <p className="text-xs text-gray-300">WHO & NMC Eligibility Engine</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* Step 1: Input Form */}
                  {!isCalculating && !matchResult && (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleStartCalculation}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
                          Target Destination
                        </label>
                        <select
                          value={targetCountry}
                          onChange={(e) => setTargetCountry(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white/10 transition-all text-xs sm:text-sm appearance-none cursor-pointer"
                          required
                        >
                          <option className="bg-gray-900" value="">Select Country</option>
                          <option className="bg-gray-900" value="Russia">Russia 🇷🇺</option>
                          <option className="bg-gray-900" value="Georgia">Georgia 🇬🇪</option>
                          <option className="bg-gray-900" value="Uzbekistan">Uzbekistan 🇺🇿</option>
                          <option className="bg-gray-900" value="Kazakhstan">Kazakhstan kz</option>
                          <option className="bg-gray-900" value="Nepal">Nepal 🇳🇵</option>
                          <option className="bg-gray-900" value="Tajikistan">Tajikistan 🇹🇯</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
                            NEET Qualified?
                          </label>
                          <select
                            value={neetQualified}
                            onChange={(e) => setNeetQualified(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white/10 transition-all text-xs sm:text-sm appearance-none cursor-pointer"
                            required
                          >
                            <option className="bg-gray-900" value="">Select</option>
                            <option className="bg-gray-900" value="Yes">Yes</option>
                            <option className="bg-gray-900" value="No">No</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
                            12th PCB Marks
                          </label>
                          <select
                            value={pcbMarks}
                            onChange={(e) => setPcbMarks(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white/10 transition-all text-xs sm:text-sm appearance-none cursor-pointer"
                            required
                          >
                            <option className="bg-gray-900" value="">Select</option>
                            <option className="bg-gray-900" value="50%+ Marks">50% +</option>
                            <option className="bg-gray-900" value="Below 50%">Below 50%</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
                          Annual Tuition Budget
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white/10 transition-all text-xs sm:text-sm appearance-none cursor-pointer"
                          required
                        >
                          <option className="bg-gray-900" value="">Select Budget Range</option>
                          <option className="bg-gray-900" value="Low">Low (&lt; $4,000 / year)</option>
                          <option className="bg-gray-900" value="Medium">Medium ($4,000 - $6,000 / year)</option>
                          <option className="bg-gray-900" value="High">Premium ($6,000+ / year)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 mt-6 text-sm"
                      >
                        <Sparkles className="w-4.5 h-4.5" />
                        Check Admission Match
                      </button>
                    </motion.form>
                  )}

                  {/* Step 2: Loader Animation */}
                  {isCalculating && (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[280px]"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-400 rounded-full animate-spin" />
                        <Sparkles className="w-6 h-6 text-secondary-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div className="space-y-2 max-w-xs">
                        <p className="text-sm font-semibold tracking-wide text-white">{steps[calculationStep]}</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-primary-400 to-secondary-400 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(calculationStep + 1) * 25}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Calculation Result */}
                  {!isCalculating && matchResult && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider font-bold text-gray-300">AI Calculations</span>
                        <button
                          onClick={handleReset}
                          className="text-xs text-primary-300 hover:text-primary-200 flex items-center gap-1 font-semibold transition"
                        >
                          <RefreshCw className="w-3 h-3" /> Recheck
                        </button>
                      </div>

                      {/* Percentage Circle & Status */}
                      <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                          {/* Inner radial gradient shadow */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-secondary-500/10 rounded-full blur-sm" />
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-white/10"
                              strokeWidth="3"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <motion.path
                              className="text-primary-400"
                              strokeWidth="3.2"
                              strokeDasharray={`${matchResult.score}, 100`}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              initial={{ strokeDasharray: "0, 100" }}
                              animate={{ strokeDasharray: `${matchResult.score}, 100` }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                          </svg>
                          <span className="absolute text-lg font-extrabold">{matchResult.score}%</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm sm:text-base">Admission Status</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              matchResult.status === 'Excellent' ? 'bg-green-500/20 text-green-300' :
                              matchResult.status === 'Good' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-amber-500/20 text-amber-300'
                            }`}>
                              {matchResult.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                            {matchResult.message}
                          </p>
                        </div>
                      </div>

                      {/* Recommended Universities */}
                      {matchResult.universities.length > 0 && (
                        <div className="space-y-2.5">
                          <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-300 flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-primary-400" />
                            Best Match Universities
                          </p>
                          <div className="space-y-2">
                            {matchResult.universities.map((uni, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs sm:text-sm hover:bg-white/10 transition"
                              >
                                <span className="font-medium text-gray-200 truncate pr-2">{uni}</span>
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Call to action */}
                      <div className="pt-2">
                        {matchResult.status === 'Needs Review' ? (
                          <Link
                            href="/contact"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-center text-xs sm:text-sm"
                          >
                            <AlertTriangle className="w-4.5 h-4.5" />
                            Request Manual Counsel Review
                          </Link>
                        ) : (
                          <Link
                            href={`/apply?country=${targetCountry}`}
                            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-center text-xs sm:text-sm"
                          >
                            <CheckCircle className="w-4.5 h-4.5" />
                            Lock Verified Seat Allocation
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Scroll Down Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          onClick={handleScrollDown}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 hover:text-white transition-colors cursor-pointer group z-20"
        >
          <span className="text-xs mb-1.5 tracking-wider font-light group-hover:translate-y-0.5 transition-transform">EXPLORE OPTIONS</span>
          <ChevronDown className="w-5 h-5 animate-bounce text-primary-400" />
        </motion.button>
      </div>
    </section>
  );
}
