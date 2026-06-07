'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import { analyticsApi } from '@/lib/services';

interface AnalyticsSummary {
  today: {
    pageviews: number;
    visitors: number;
    pageview_change: number;
    visitor_change: number;
  };
  week: {
    pageviews: number;
    visitors: number;
  };
  month: {
    pageviews: number;
    visitors: number;
  };
  total: {
    pageviews: number;
    visitors: number;
  };
}

interface VisitorStats {
  daily: Array<{ date: string; visitors: number; pageviews: number }>;
  new_visitors: number;
  returning_visitors: number;
  total_active: number;
}

interface LocationStats {
  by_country: Array<{ country: string; visitors: number; pageviews: number }>;
  by_city: Array<{ city: string; country: string; visitors: number; pageviews: number }>;
}

interface DeviceStats {
  by_device: Array<{ device: string; count: number }>;
  by_browser: Array<{ browser: string; count: number }>;
  by_os: Array<{ os: string; count: number }>;
}

interface TopPages {
  pages: Array<{ page: string; views: number; visitors: number }>;
}

interface RealtimeData {
  active_visitors: number;
  active_pages: Array<{ _id: string; page: string; location: string }>;
}

interface Trends {
  this_week: number;
  last_week: number;
  week_change: number;
  this_month: number;
  last_month: number;
  month_change: number;
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [locationStats, setLocationStats] = useState<LocationStats | null>(null);
  const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
  const [topPages, setTopPages] = useState<TopPages | null>(null);
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);
  const [trends, setTrends] = useState<Trends | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState(30);

  const fetchData = async () => {
    try {
      const [summaryData, visitorData, locationData, deviceData, pagesData, realtimeData, trendsData] = await Promise.all([
        analyticsApi.getSummary().catch(() => null),
        analyticsApi.getVisitorStats(timeRange).catch(() => null),
        analyticsApi.getLocationStats(timeRange).catch(() => null),
        analyticsApi.getDeviceStats(timeRange).catch(() => null),
        analyticsApi.getTopPages(timeRange, 10).catch(() => null),
        analyticsApi.getRealtimeVisitors().catch(() => null),
        analyticsApi.getTrends().catch(() => null),
      ]);

      setSummary(summaryData);
      setVisitorStats(visitorData);
      setLocationStats(locationData);
      setDeviceStats(deviceData);
      setTopPages(pagesData);
      setRealtime(realtimeData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh realtime data every 30 seconds
    const interval = setInterval(async () => {
      try {
        const realtimeData = await analyticsApi.getRealtimeVisitors();
        setRealtime(realtimeData);
      } catch (error) {
        console.debug('Realtime refresh failed');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: number; 
    change?: number; 
    icon: React.ElementType; 
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(change)}% vs yesterday</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your website visitors and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Realtime Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Live Now:</span>
            </div>
            <span className="text-2xl font-bold">{realtime?.active_visitors || 0}</span>
            <span className="text-green-100">active visitors</span>
          </div>
          <div className="text-sm text-green-100">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Visitors"
          value={summary?.today?.visitors || 0}
          change={summary?.today?.visitor_change}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Today's Pageviews"
          value={summary?.today?.pageviews || 0}
          change={summary?.today?.pageview_change}
          icon={Eye}
          color="bg-purple-500"
        />
        <StatCard
          title="This Week"
          value={summary?.week?.pageviews || 0}
          icon={BarChart3}
          color="bg-green-500"
        />
        <StatCard
          title="Total Visitors"
          value={summary?.total?.visitors || 0}
          icon={Globe}
          color="bg-orange-500"
        />
      </div>

      {/* Trends Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
            Weekly Trend
          </h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{trends?.this_week?.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-500">This week</p>
            </div>
            <div className="text-right">
              <div className={`flex items-center ${(trends?.week_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(trends?.week_change || 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-xl font-semibold ml-1">{Math.abs(trends?.week_change || 0)}%</span>
              </div>
              <p className="text-sm text-gray-500">vs last week ({trends?.last_week?.toLocaleString() || 0})</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
            Monthly Trend
          </h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{trends?.this_month?.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="text-right">
              <div className={`flex items-center ${(trends?.month_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(trends?.month_change || 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-xl font-semibold ml-1">{Math.abs(trends?.month_change || 0)}%</span>
              </div>
              <p className="text-sm text-gray-500">vs last month ({trends?.last_month?.toLocaleString() || 0})</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Traffic Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Overview</h3>
        <div className="h-64 flex items-end space-x-2">
          {visitorStats?.daily?.slice(-14).map((day, index) => {
            const maxViews = Math.max(...(visitorStats?.daily?.map(d => d.pageviews) || [1]));
            const height = (day.pageviews / maxViews) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-md transition-all hover:from-primary-600 hover:to-primary-500"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${day.date}: ${day.pageviews} pageviews, ${day.visitors} visitors`}
                />
                <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-8 space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded mr-2" />
            <span className="text-gray-600">Pageviews</span>
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-primary-600" />
            Top Pages
          </h3>
          <div className="space-y-3">
            {topPages?.pages?.length ? (
              topPages.pages.map((page, index) => {
                const maxViews = topPages.pages[0]?.views || 1;
                const width = (page.views / maxViews) * 100;
                return (
                  <div key={index} className="relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary-100 rounded"
                      style={{ width: `${width}%` }}
                    />
                    <div className="relative flex items-center justify-between py-2 px-3">
                      <span className="text-sm text-gray-700 truncate max-w-[200px]">{page.page}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{page.views}</span>
                        <span className="text-xs text-gray-500 ml-1">views</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No page data available</p>
            )}
          </div>
        </motion.div>

        {/* Visitor Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary-600" />
            Top Locations
          </h3>
          <div className="space-y-3">
            {locationStats?.by_country?.length ? (
              locationStats.by_country.slice(0, 8).map((location, index) => {
                const maxVisitors = locationStats.by_country[0]?.visitors || 1;
                const width = (location.visitors / maxVisitors) * 100;
                return (
                  <div key={index} className="relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-green-100 rounded"
                      style={{ width: `${width}%` }}
                    />
                    <div className="relative flex items-center justify-between py-2 px-3">
                      <span className="text-sm text-gray-700">{location.country}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{location.visitors}</span>
                        <span className="text-xs text-gray-500 ml-1">visitors</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No location data available</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Device & Browser Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-primary-600" />
            Devices
          </h3>
          <div className="space-y-4">
            {deviceStats?.by_device?.map((device, index) => {
              const total = deviceStats.by_device.reduce((sum, d) => sum + d.count, 0);
              const percentage = Math.round((device.count / total) * 100);
              const Icon = getDeviceIcon(device.device);
              return (
                <div key={index} className="flex items-center">
                  <Icon className="w-5 h-5 text-gray-500 mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 capitalize">{device.device}</span>
                      <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {!deviceStats?.by_device?.length && (
              <p className="text-gray-500 text-center py-4">No device data</p>
            )}
          </div>
        </motion.div>

        {/* Browsers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
          <div className="space-y-4">
            {deviceStats?.by_browser?.slice(0, 5).map((browser, index) => {
              const total = deviceStats.by_browser.reduce((sum, b) => sum + b.count, 0);
              const percentage = Math.round((browser.count / total) * 100);
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">{browser.browser}</span>
                    <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {!deviceStats?.by_browser?.length && (
              <p className="text-gray-500 text-center py-4">No browser data</p>
            )}
          </div>
        </motion.div>

        {/* Operating Systems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
          <div className="space-y-4">
            {deviceStats?.by_os?.slice(0, 5).map((os, index) => {
              const total = deviceStats.by_os.reduce((sum, o) => sum + o.count, 0);
              const percentage = Math.round((os.count / total) * 100);
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">{os.os}</span>
                    <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {!deviceStats?.by_os?.length && (
              <p className="text-gray-500 text-center py-4">No OS data</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* New vs Returning Visitors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-primary-600" />
          Visitor Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-4xl font-bold text-blue-600">{visitorStats?.new_visitors || 0}</p>
            <p className="text-sm text-gray-600 mt-1">New Visitors</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-4xl font-bold text-green-600">{visitorStats?.returning_visitors || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Returning Visitors</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-4xl font-bold text-purple-600">{visitorStats?.total_active || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total Active</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
