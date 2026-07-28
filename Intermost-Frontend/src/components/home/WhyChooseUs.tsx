'use client';
 
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Shield, 
  Users, 
  HeadphonesIcon, 
  Plane, 
  BookOpen,
  Award,
  CheckCircle
} from 'lucide-react';
import { coreApi } from '@/lib/services';

const benefits = [
  'Affordable fees compared to India',
  'English medium education',
  'No donation or capitation fees',
  'Safe and secure environment',
  'Indian food available',
  'Direct flights available',
];

export default function WhyChooseUs() {
  const [siteStats, setSiteStats] = useState({
    students_placed: 5500,
    partner_universities: 35,
    years_experience: 23, // updated default value to 23
    visa_success_rate: 99
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings?.stats) {
          setSiteStats(settings.stats);
        }
      } catch (error) {
        console.debug('Failed to fetch stats for WhyChooseUs, using defaults', error);
      }
    };
    fetchStats();
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: 'NMC & WHO Approved',
      description: 'All our partner universities are recognized by NMC (National Medical Commission) and WHO.',
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      title: `${siteStats.years_experience}+ Years Experience`,
      description: 'Trusted by thousands of students and parents for over two decades.',
      color: 'bg-purple-500',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for students and parents before, during, and after admission.',
      color: 'bg-orange-500',
    },
    {
      icon: Plane,
      title: 'Complete Assistance',
      description: 'From admission to visa, travel, and accommodation - we handle everything.',
      color: 'bg-pink-500',
    },
    {
      icon: BookOpen,
      title: 'FMGE/NEXT Coaching',
      description: 'Free FMGE/NEXT exam preparation coaching for all our students.',
      color: 'bg-teal-500',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full blur-3xl opacity-50" />
      </div>
 
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 px-4"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-primary-100 text-primary-700 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider mb-4"
          >
            Why Choose Us
          </motion.span>
          <h2 className="section-title mt-2 px-2">
            Your Trusted Partner for{' '}
            <span className="gradient-text">MBBS Abroad</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-3xl mx-auto px-2">
            We've helped over {siteStats.students_placed.toLocaleString()}+ students achieve their dream of becoming doctors
          </p>
        </motion.div>
 
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-16 sm:mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
            >
              <motion.div 
                className="card p-5 sm:p-6 md:p-7 group hover:border-primary-500/50 border-2 border-transparent transition-all h-full flex flex-col"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className={`w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-lg flex-shrink-0`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />
                </motion.div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
 
        {/* Benefits Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="gradient-bg rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl shadow-primary-600/20 overflow-hidden relative"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>
 
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center relative z-10">
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Award className="w-12 sm:w-14 h-12 sm:h-14 text-white/90 mb-4 sm:mb-5" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-5">
                Benefits of Studying MBBS Abroad
              </h3>
              <p className="text-sm sm:text-base text-white/80 mb-6 sm:mb-8 leading-relaxed">
                Get world-class medical education at a fraction of the cost compared 
                to private medical colleges in India.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={benefit} 
                    className="flex items-start space-x-2 sm:space-x-3 text-white"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                  >
                    <div className="w-5 sm:w-6 h-5 sm:h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-300" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              className="text-center md:text-right"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 shadow-xl">
                <p className="text-white/80 text-sm sm:text-base md:text-lg mb-2 sm:mb-3">Complete Tuition Fee Program</p>
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-3">Starting from 18 Lakhs</p>
                <p className="text-white/80 text-xs sm:text-sm md:text-base mb-1">Total 6 year tuition fee</p>
                <p className="text-primary-300 text-xs sm:text-sm font-semibold mt-3 pt-2 border-t border-white/10">Average fee starting from 3,500 $ / Year</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
