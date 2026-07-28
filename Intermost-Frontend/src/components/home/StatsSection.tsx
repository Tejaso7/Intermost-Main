'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { Users, Building, Calendar, Award, GraduationCap } from 'lucide-react';
import { coreApi } from '@/lib/services';

const stats = [
  {
    icon: Users,
    value: 5500,
    suffix: '+',
    label: 'Students Placed',
    description: 'Successfully admitted worldwide',
  },
  {
    icon: Building,
    value: 35,
    suffix: '+',
    label: 'Partner Universities',
    description: 'NMC & WHO approved',
  },
  {
    icon: Calendar,
    value: 21,
    suffix: '+',
    label: 'Years Experience',
    description: 'Trusted since 2003',
  },
  {
    icon: Award,
    value: 99,
    suffix: '%',
    label: 'Visa Success Rate',
    description: 'Industry-leading success',
  },
];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [siteStats, setSiteStats] = useState({
    students_placed: 5500,
    partner_universities: 35,
    years_experience: 23,
    visa_success_rate: 99,
    pioneer_students: 4725
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings?.stats) {
          setSiteStats(settings.stats);
        }
      } catch (error) {
        console.debug('Failed to fetch stats for StatsSection, using defaults', error);
      }
    };
    fetchStats();
  }, []);

  const dynamicStats = [
    {
      icon: Users,
      value: siteStats.students_placed,
      suffix: '+',
      label: 'Students Placed',
      description: 'Successfully admitted worldwide',
    },
    {
      icon: GraduationCap,
      value: siteStats.pioneer_students || 4725,
      suffix: '+',
      label: 'Pioneer Students',
      description: 'Currently pursuing MBBS abroad',
    },
    {
      icon: Building,
      value: siteStats.partner_universities,
      suffix: '+',
      label: 'Partner Universities',
      description: 'NMC & WHO approved',
    },
    {
      icon: Calendar,
      value: siteStats.years_experience,
      suffix: '+',
      label: 'Years Experience',
      description: 'Trusted since 2003',
    },
  ];

  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-10 -left-20 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-72 h-72 bg-secondary-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 px-4"
        >
          <span className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Our Achievements
          </span>
          <h2 className="section-title mt-2">
            Numbers That <span className="gradient-text">Speak</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-2xl mx-auto px-2">
            Our track record speaks for itself - trusted by thousands of families
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {dynamicStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-xl hover:border-primary-200/50 transition-all duration-300 p-6 sm:p-8 rounded-3xl"
            >
              {/* Icon */}
              <motion.div 
                className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white transition-colors" />
              </motion.div>

              {/* Value */}
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-primary-700">
                {isInView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                  />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>

              {/* Label */}
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">
                {stat.label}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
