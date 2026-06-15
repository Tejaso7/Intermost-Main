'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Globe,
  Building,
  Users,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Newspaper,
  BarChart3,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/utils';
import AdminChatWidget from './AdminChatWidget';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Countries', href: '/admin/countries', icon: Globe },
  { name: 'Colleges', href: '/admin/colleges', icon: Building },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Users },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Team', href: '/admin/team', icon: Users },
  { name: 'Knowledge Base', href: '/admin/knowledge-base', icon: Database },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUsername, setAdminUsername] = useState('Admin');
  const [showWelcome, setShowWelcome] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check authentication and session expiry
    const token = storage.get<string>('access_token');
    const sessionExpires = storage.get<string>('session_expires');
    const username = storage.get<string>('admin_username');
    const loginTime = storage.get<string>('login_time');
    
    if (token && sessionExpires) {
      const expiryDate = new Date(sessionExpires);
      const now = new Date();
      
      if (now > expiryDate) {
        // Session expired - clear and redirect
        handleLogout();
        return;
      }
      
      setIsAuthenticated(true);
      if (username) setAdminUsername(username);
      
      // Show welcome message on first load after login
      if (loginTime) {
        const loginDate = new Date(loginTime);
        const timeSinceLogin = now.getTime() - loginDate.getTime();
        // Show welcome if logged in within last 5 seconds
        if (timeSinceLogin < 5000) {
          setShowWelcome(true);
          setTimeout(() => setShowWelcome(false), 5000);
        }
      }
      
      setIsLoading(false);
    } else if (pathname !== '/admin/login') {
      // Redirect to login if not authenticated
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    storage.remove('access_token');
    storage.remove('refresh_token');
    storage.remove('admin_username');
    storage.remove('login_time');
    storage.remove('session_expires');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="spinner" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 flex flex-col overflow-y-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-white rounded-lg p-1 border border-gray-150 overflow-hidden flex-shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo/logo.png"
                alt="Intermost Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-sm leading-tight text-primary-600 block">INTERMOST</span>
              <span className="block text-[9px] text-gray-400 font-semibold tracking-wider">PORTAL</span>
            </div>
          </Link>
          <motion.button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t flex-shrink-0">
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium truncate">Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <motion.header 
          className="sticky top-0 z-30 h-14 sm:h-16 bg-white shadow-sm flex items-center justify-between px-3 sm:px-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 sm:w-6 h-5 sm:h-6" />
          </motion.button>

          <div className="flex-1" />

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Notifications */}
            <motion.button 
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
              <motion.span 
                className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.button>

            {/* User Menu */}
            <div className="hidden sm:flex items-center gap-2 md:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-primary-600">{adminUsername.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden md:block min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{adminUsername}</p>
                <p className="text-xs text-gray-500">Session expires in 24h</p>
              </div>
              <ChevronDown className="hidden md:block w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </motion.header>

        {/* Welcome Banner */}
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mx-3 sm:mx-4 md:mx-6 mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg sm:rounded-xl shadow-lg"
          >
            <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-lg sm:text-2xl flex-shrink-0">👋</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-lg leading-tight">Welcome back, {adminUsername}!</p>
                  <p className="text-primary-100 text-xs sm:text-sm mt-0.5">Your session is valid for 24 hours. Happy managing!</p>
                </div>
              </div>
              <motion.button 
                onClick={() => setShowWelcome(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 sm:w-5 h-4 sm:h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Page Content */}
        <main className="flex-1 min-h-full p-3 sm:p-4 md:p-6">
          {children}
        </main>

        {/* Admin AI Chat Widget */}
        <AdminChatWidget />
      </div>
    </div>
  );
}
