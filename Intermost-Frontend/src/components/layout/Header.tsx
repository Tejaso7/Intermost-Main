'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Countries',
    href: '/countries',
    submenu: [
      { name: 'Russia', href: '/countries/russia', flag: '/flags/russia.png' },
      { name: 'Georgia', href: '/countries/georgia', flag: '/flags/georgia.png' },
      { name: 'Uzbekistan', href: '/countries/uzbekistan', flag: '/flags/uzbekistan.png' },
      { name: 'Nepal', href: '/countries/nepal', flag: '/flags/nepal.png' },
      { name: 'Kazakhstan', href: '/countries/kazakhstan', flag: '/flags/kazakhstan.png' },
      { name: 'Tajikistan', href: '/countries/tajikistan', flag: '/flags/tajikistan.png' },
    ],
  },
  { name: 'About Us', href: '/about' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

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
              'hidden sm:block transition-colors duration-300',
              useSolidHeader ? 'text-gray-900' : 'text-white'
            )}>
              <span className="font-bold text-base lg:text-lg leading-tight">INTERMOST</span>
              <span className="block text-[10px] lg:text-xs opacity-80">Study Abroad</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
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
              href="tel:+919058501818"
              className={cn(
                'flex items-center space-x-2 font-medium transition-colors duration-300',
                useSolidHeader
                  ? 'text-gray-700 hover:text-primary-600'
                  : 'text-white hover:text-primary-200'
              )}
            >
              <Phone className="w-5 h-5" />
              <span>+91 9058501818</span>
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="py-4 px-4 space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => !item.submenu && setIsMobileMenuOpen(false)}
                      className="block py-2 px-4 text-gray-700 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.submenu && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 py-2 px-4 text-gray-600 text-sm hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                          >
                            {subItem.flag && (
                              <Image
                                src={subItem.flag}
                                alt={`${subItem.name} flag`}
                                width={20}
                                height={14}
                                className="rounded-sm shadow-sm object-cover"
                              />
                            )}
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/apply"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
