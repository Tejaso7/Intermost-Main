'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { coreApi } from '@/lib/services';

const fallbackStats = [
  { value: 5500, suffix: '+', label: 'Students Placed', key: 'students_placed' },
  { value: 35, suffix: '+', label: 'Partner Universities', key: 'partner_universities' },
  { value: 21, suffix: '+', label: 'Years Experience', key: 'years_experience' },
  { value: 99, suffix: '%', label: 'Visa Success Rate', key: 'visa_success_rate' },
];

export default function AboutStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [siteStats, setSiteStats] = useState({
    students_placed: 5500,
    partner_universities: 35,
    years_experience: 21,
    visa_success_rate: 99
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings?.stats) {
          setSiteStats({
            students_placed: settings.stats.students_placed || 5500,
            partner_universities: settings.stats.partner_universities || 35,
            years_experience: settings.stats.years_experience || 21,
            visa_success_rate: settings.stats.visa_success_rate || 99,
          });
        }
      } catch (error) {
        console.debug('Failed to fetch stats for AboutStats, using defaults', error);
      }
    };
    fetchStats();
  }, []);

  const dynamicStats = [
    { value: siteStats.students_placed, suffix: '+', label: 'Students Placed', key: 'students_placed' },
    { value: siteStats.partner_universities, suffix: '+', label: 'Partner Universities', key: 'partner_universities' },
    { value: siteStats.years_experience, suffix: '+', label: 'Years Experience', key: 'years_experience' },
    { value: siteStats.visa_success_rate, suffix: '%', label: 'Visa Success Rate', key: 'visa_success_rate' },
  ];

  return (
    <section ref={ref} className="py-12 bg-white -mt-10 relative z-10">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl shadow-xl p-8">
          {dynamicStats.map((stat) => (
            <div key={stat.key} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">
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
              <div className="text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
