'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { countriesApi, coreApi } from '@/lib/services';

interface NavSubmenuItem {
  name: string;
  href: string;
  flag: string;
}

interface NavItem {
  name: string;
  href: string;
  submenu?: NavSubmenuItem[];
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Countries',
    href: '/countries',
    submenu: [], // This will be populated dynamically
  },
  { name: 'Compare', href: '/compare' },
  { name: 'About Us', href: '/about' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [navItems, setNavItems] = useState(navigation);
  const [phoneNumber, setPhoneNumber] = useState('+91 9058501818');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings && settings.contact && settings.contact.phone) {
          setPhoneNumber(settings.contact.phone);
        }
      } catch (err) {
        console.debug('Failed to fetch settings for Header', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await countriesApi.getAll({ active: true });
        const countrySubmenu = data.map((c) => ({
          name: c.name,
          href: `/countries/${c.slug}`,
          flag: c.flag_url || `/flags/${c.slug}.png`,
        }));

        setNavItems((prev) =>
          prev.map((item) =>
            item.name === 'Countries'
              ? { ...item, submenu: countrySubmenu }
              : item
          )
        );
      } catch (error) {
        console.error('Failed to load countries for navigation', error);
      }
    };
    fetchCountries();
  }, []);

  // Only use transparent header on homepage
  const isHomePage = pathname === '/';
  // Use solid header style when scrolled OR when not on homepage
  const useSolidHeader = isScrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        useSolidHeader
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
          : 'bg-transparent py-4'
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg overflow-hidden">
              <Image
                src="/images/logo/logo.png"
                alt="Intermost Study Abroad"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className={cn(
              'block transition-colors duration-300',
              useSolidHeader ? 'text-gray-900' : 'text-white'
            )}>
              <span className="font-bold text-base lg:text-lg leading-tight">INTERMOST</span>
              <span className="block text-[10px] lg:text-xs opacity-80">Study Abroad</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-1 font-medium transition-colors duration-300',
                    useSolidHeader
                      ? 'text-gray-700 hover:text-primary-600'
                      : 'text-white hover:text-primary-200'
                  )}
                >
                  <span>{item.name}</span>
                  {item.submenu && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {item.submenu && activeSubmenu === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 overflow-hidden"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          {subItem.flag && (
                            <Image
                              src={subItem.flag}
                              alt={`${subItem.name} flag`}
                              width={24}
                              height={16}
                              className="rounded-sm shadow-sm object-cover"
                            />
                          )}
                          <span className="font-medium">{subItem.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className={cn(
                'flex items-center space-x-2 font-medium transition-colors duration-300',
                useSolidHeader
                  ? 'text-gray-700 hover:text-primary-600'
                  : 'text-white hover:text-primary-200'
              )}
            >
              <Phone className="w-5 h-5" />
              <span>{phoneNumber}</span>
            </a>
            <Link
              href="/apply"
              className="btn-primary"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-colors duration-300',
              useSolidHeader
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            )}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed top-0 right-0 h-full w-[85vw] max-w-sm z-50 bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100/50">
                  <span className="font-bold text-lg text-gray-900">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-gray-100/50 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 py-4 px-4 space-y-2 overflow-y-auto">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      {item.submenu && item.submenu.length > 0 ? (
                        <details className="group">
                          <summary className="flex items-center justify-between py-3 px-4 text-gray-700 text-lg font-medium hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors cursor-pointer list-none">
                            {item.name}
                            <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="mt-2 ml-4 space-y-1 border-l-2 border-primary-100 pl-4">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 py-3 px-4 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                              >
                                {subItem.flag && (
                                  <Image
                                    src={subItem.flag}
                                    alt={`${subItem.name} flag`}
                                    width={24}
                                    height={16}
                                    className="rounded-sm shadow-sm object-cover"
                                  />
                                )}
                                <span className="font-medium text-base">{subItem.name}</span>
                              </Link>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3 px-4 text-gray-700 text-lg font-medium hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="p-6 border-t border-gray-100/50 bg-gray-50/30 mt-auto">
                  <div className="mb-4">
                    <a
                      href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                      className="flex items-center justify-center space-x-2 text-gray-700 hover:text-primary-600 font-medium py-2"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{phoneNumber}</span>
                    </a>
                  </div>
                  <Link
                    href="/apply"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full text-center py-3 text-lg rounded-xl shadow-lg shadow-primary-500/25 block"
                  >
                    Apply Now
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
