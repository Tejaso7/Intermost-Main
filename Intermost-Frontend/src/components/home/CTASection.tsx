'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { createWhatsAppLink } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { coreApi } from '@/lib/services';

export default function CTASection() {
  const [whatsappNumber, setWhatsappNumber] = useState('919058501818');
  const [phoneNumber, setPhoneNumber] = useState('+91 9058501818');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings?.contact?.whatsapp) {
          setWhatsappNumber(settings.contact.whatsapp.replace(/[^0-9]/g, ''));
        }
        if (settings?.contact?.phone) {
          setPhoneNumber(settings.contact.phone);
        }
      } catch (err) {
        console.debug('Failed to fetch settings for CTASection', err);
      }
    };
    fetchSettings();
  }, []);

  const handleWhatsApp = () => {
    const link = createWhatsAppLink(
      whatsappNumber,
      "Hi! I'm interested in MBBS abroad. Please provide more information about admission process and fees."
    );
    window.open(link, '_blank');
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background */}
          <div className="absolute inset-0 gradient-bg" />
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          {/* Floating Sparkles */}
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-10 right-20 w-2 h-2 bg-white rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.9, 1.3, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute bottom-16 left-24 w-3 h-3 bg-white/80 rounded-full pointer-events-none blur-[1px]"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.7, 1.1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white rounded-full pointer-events-none"
          />

          {/* Content */}
          <div className="relative z-10 py-16 px-8 md:px-16 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                🎓 Admissions Open for 2026
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            >
              Ready to Start Your Medical Journey?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10"
            >
              Take the first step towards your dream of becoming a doctor. 
              Get free counseling and guidance from our expert team today!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/apply"
                className="btn-white group hover:shadow-xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
              >
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-primary-600 hover:shadow-lg hover:shadow-green-400/25 hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Chat on WhatsApp
              </button>
              
              <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Phone className="mr-2 w-5 h-5" />
                {phoneNumber}
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 pt-8 border-t border-white/20"
            >
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free Counseling
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No Hidden Charges
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Complete Documentation Help
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Visa Assistance
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
