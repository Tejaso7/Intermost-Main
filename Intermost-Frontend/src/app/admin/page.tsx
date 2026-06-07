'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Globe,
  Building,
  FileText,
  MessageSquare,
  TrendingUp,
  Eye,
  ArrowUpRight,
  Activity,
  MapPin,
  BarChart3,
} from 'lucide-react';
import { coreApi, inquiriesApi, analyticsApi } from '@/lib/services';
import Link from 'next/link';

interface DashboardStats {
  countries: number;
  colleges: number;
  blogs: number;
  inquiries: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
  };
}

interface AnalyticsSummary {
  today: {
    pageviews: number;
    visitors: number;
    pageview_change: number;
    visitor_change: number;
  };
  total: {
    pageviews: number;
    visitors: number;
  };
}

interface RealtimeData {
  active_visitors: number;
}

interface LocationStats {
  by_country: Array<{ country: string; visitors: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);
  const [locations, setLocations] = useState<LocationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coreStats, inquiryStats, analyticsData, realtimeData, locationData] = await Promise.all([
          coreApi.getStats().catch(() => ({ countries: 7, colleges: 15, blogs: 3 })),
          inquiriesApi.getStats().catch(() => ({
            total: 0,
            new: 0,
            contacted: 0,
            qualified: 0,
            converted: 0,
          })),
          analyticsApi.getSummary().catch(() => null),
          analyticsApi.getRealtimeVisitors().catch(() => null),
          analyticsApi.getLocationStats(7).catch(() => null),
        ]);
        
        setStats({
          ...coreStats,
          inquiries: inquiryStats,
        });
        setAnalytics(analyticsData);
        setRealtime(realtimeData);
        setLocations(locationData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats?.inquiries?.total || 0,
      icon: MessageSquare,
      color: 'bg-blue-500',
      link: '/admin/inquiries',
    },
    {
      title: 'New Leads',
      value: stats?.inquiries?.new || 0,
      icon: Users,
      color: 'bg-green-500',
      link: '/admin/inquiries?status=new',
    },
    {
      title: 'Countries',
      value: stats?.countries || 7,
      icon: Globe,
      color: 'bg-purple-500',
      link: '/admin/countries',
    },
    {
      title: 'Colleges',
      value: stats?.colleges || 15,
      icon: Building,
      color: 'bg-orange-500',
      link: '/admin/colleges',
    },
  ];

  const quickActions = [
    { title: 'Add New Country', href: '/admin/countries/new', icon: Globe },
    { title: 'Add New College', href: '/admin/colleges/new', icon: Building },
    { title: 'Add Blog Post', href: '/admin/blogs/new', icon: FileText },
    { title: 'View Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome to Intermost Admin Panel</p>
      </div>

      {/* Realtime Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 sm:w-5 h-4 sm:h-5 animate-pulse flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">Live Now:</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold">{realtime?.active_visitors || 0}</span>
            <span className="text-green-100 text-xs sm:text-sm">active visitors</span>
          </div>
          <Link
            href="/admin/analytics"
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
          >
            View Analytics
          </Link>
        </div>
      </motion.div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
            {(analytics?.today?.pageview_change ?? 0) !== 0 && (
              <span className={`text-xs sm:text-sm font-medium ${(analytics?.today?.pageview_change ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(analytics?.today?.pageview_change ?? 0) >= 0 ? '+' : ''}{analytics?.today?.pageview_change}%
              </span>
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{analytics?.today?.pageviews || 0}</h3>
          <p className="text-gray-600 text-xs sm:text-sm">Today's Pageviews</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
            {(analytics?.today?.visitor_change ?? 0) !== 0 && (
              <span className={`text-xs sm:text-sm font-medium ${(analytics?.today?.visitor_change ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(analytics?.today?.visitor_change ?? 0) >= 0 ? '+' : ''}{analytics?.today?.visitor_change}%
              </span>
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{analytics?.today?.visitors || 0}</h3>
          <p className="text-gray-600 text-xs sm:text-sm">Today's Visitors</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{analytics?.total?.pageviews?.toLocaleString() || 0}</h3>
          <p className="text-gray-600 text-xs sm:text-sm">Total Pageviews</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{analytics?.total?.visitors?.toLocaleString() || 0}</h3>
          <p className="text-gray-600 text-xs sm:text-sm">Total Visitors</p>
        </motion.div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.08 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link
              href={stat.link}
              className="block bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{stat.title}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <Link
                  href={action.href}
                  className="flex items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <action.icon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm truncate">{action.title}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Inquiry Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Inquiry Status</h2>
          <div className="space-y-3 sm:space-y-4">
            {[
              { label: 'New', value: stats?.inquiries?.new || 0, color: 'bg-blue-500' },
              { label: 'Contacted', value: stats?.inquiries?.contacted || 0, color: 'bg-yellow-500' },
              { label: 'Qualified', value: stats?.inquiries?.qualified || 0, color: 'bg-green-500' },
              { label: 'Converted', value: stats?.inquiries?.converted || 0, color: 'bg-purple-500' },
            ].map((item) => (
              <motion.div 
                key={item.label} 
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center min-w-0">
                  <div className={`w-2.5 sm:w-3 h-2.5 sm:h-3 ${item.color} rounded-full mr-2 sm:mr-3 flex-shrink-0`} />
                  <span className="text-sm sm:text-base text-gray-700 truncate">{item.label}</span>
                </div>
                <span className="font-semibold text-gray-900 ml-2 flex-shrink-0">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <MapPin className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-primary-600 flex-shrink-0" />
            <span className="truncate">Top Locations (7d)</span>
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {locations?.by_country?.slice(0, 5).map((location, index) => (
              <motion.div 
                key={index} 
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
              >
                <span className="text-xs sm:text-sm text-gray-700 truncate">{location.country}</span>
                <span className="font-semibold text-xs sm:text-sm text-gray-900 ml-2 flex-shrink-0">{location.visitors}</span>
              </motion.div>
            ))}
            {(!locations?.by_country || locations.by_country.length === 0) && (
              <p className="text-gray-500 text-xs sm:text-sm text-center py-4">No location data yet</p>
            )}
          </div>
          <Link
            href="/admin/analytics"
            className="block mt-4 text-center text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Full Analytics →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
