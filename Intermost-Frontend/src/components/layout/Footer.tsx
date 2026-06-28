'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SubscriptionModal from '@/components/ui/SubscriptionModal';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube,
  Send
} from 'lucide-react';

import { countriesApi, coreApi } from '@/lib/services';

const baseQuickLinks = [
  { name: 'About Us', href: '/about' },
];

const endQuickLinks = [
  { name: 'Compare Countries', href: '/compare' },
  { name: 'Apply Now', href: '/apply' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Disclaimer', href: '/disclaimer' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickLinks, setQuickLinks] = useState([...baseQuickLinks, ...endQuickLinks]);
  
  const [contact, setContact] = useState({
    phone1: '+91 9058501818',
    phone2: '+91 9837533887',
    email: 'admissionintermost@gmail.com',
    address: 'Shop no -1, First floor, Vinayak Mall, Deewani Crossing (Lotus Hospital Building), M G Road Agra, 282002 (U.P), India',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings && settings.contact) {
          setContact({
            phone1: settings.contact.phone || '+91 9058501818',
            phone2: settings.contact.whatsapp || '+91 9837533887',
            email: settings.contact.email || 'admissionintermost@gmail.com',
            address: settings.contact.address || 'Shop no -1, First floor, Vinayak Mall, Agra',
          });
        }
      } catch (err) {
        console.debug('Failed to fetch settings for Footer', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await countriesApi.getAll({ active: true });
        const countryLinks = data.map((c) => ({
          name: `MBBS in ${c.name}`,
          href: `/countries/${c.slug}`,
        }));
        setQuickLinks([...baseQuickLinks, ...countryLinks, ...endQuickLinks]);
      } catch (error) {
        console.error('Failed to load countries for footer', error);
      }
    };
    fetchLinks();
  }, []);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsModalOpen(true);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-14 h-14 bg-white rounded-lg p-2">
                <Image
                  src="/images/logo/logo.png"
                  alt="Intermost Study Abroad"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-xl text-white">INTERMOST</span>
                <span className="block text-sm text-gray-400">Study Abroad</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for MBBS education abroad. We help students achieve 
              their dreams of becoming doctors through quality education at affordable costs.
            </p>
            <div className="flex space-x-4">
              <a
                href="http://facebook.com/intermoststudyabr0ad"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/intermoststudyabroad/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="http://www.youtube.com/@IntermostStudyAbroad"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                <div>
                  <a href={`tel:${contact.phone1.replace(/\s/g, '')}`} className="hover:text-white transition-colors block">
                    {contact.phone1}
                  </a>
                  <a href={`tel:${contact.phone2.replace(/\s/g, '')}`} className="hover:text-white transition-colors block mt-1">
                    {contact.phone2}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">
                  {contact.address}
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get latest updates on MBBS admissions and offers.
            </p>
            <form onSubmit={handleSubscribeSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-white placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Intermost Ventures LLP. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-500 text-sm hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialEmail={email}
      />
    </footer>
  );
}
