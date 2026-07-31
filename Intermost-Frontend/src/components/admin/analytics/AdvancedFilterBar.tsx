'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Filter,
  RefreshCw,
  RotateCcw,
  Search,
  Globe,
  Monitor,
  Share2,
  Check,
  ChevronDown
} from 'lucide-react';

export interface FilterState {
  timePreset: number | 'custom';
  dateFrom: string;
  dateTo: string;
  source: string;
  device: string;
  country: string;
  city: string;
}

interface AdvancedFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  availableCountries?: string[];
  refreshing?: boolean;
  onRefresh?: () => void;
}

const LOCAL_STORAGE_KEY = 'intermost_analytics_filters';

export const DEFAULT_FILTERS: FilterState = {
  timePreset: 30,
  dateFrom: '',
  dateTo: '',
  source: 'all',
  device: 'all',
  country: '',
  city: '',
};

export const AdvancedFilterBar: React.FC<AdvancedFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableCountries = [],
  refreshing,
  onRefresh,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Sync internal state with prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleTimePresetClick = (presetDays: number) => {
    const updated: FilterState = {
      ...localFilters,
      timePreset: presetDays,
      dateFrom: '',
      dateTo: '',
    };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleCustomDateChange = (dateFrom: string, dateTo: string) => {
    const updated: FilterState = {
      ...localFilters,
      timePreset: 'custom',
      dateFrom,
      dateTo,
    };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 shadow-xl space-y-4">
      {/* Top Row: Quick Presets & Control Action Buttons */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        {/* Time Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            Time Horizon:
          </span>

          {[7, 30, 90].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => handleTimePresetClick(days)}
              aria-label={`Select ${days} days time horizon`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                localFilters.timePreset === days
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/40'
                  : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {days} Days
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              if (localFilters.timePreset !== 'custom') {
                const today = new Date().toISOString().split('T')[0];
                const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
                handleCustomDateChange(weekAgo, today);
              }
            }}
            aria-label="Select custom date range"
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              localFilters.timePreset === 'custom'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/40'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Custom Range
          </button>
        </div>

        {/* Action Buttons: Refresh & Reset */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Sync and refresh analytics data"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition-colors border border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-400' : ''}`} aria-hidden="true" />
              {refreshing ? 'Syncing...' : 'Refresh'}
            </button>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            aria-label="Reset analytics filters to default"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/60 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs font-medium transition-colors border border-gray-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            title="Reset Filters to Default"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {/* Bottom Row: Detailed Filter Inputs & Date Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Custom Start & End Date Inputs */}
        <div className="space-y-1 sm:col-span-2 md:col-span-1">
          <label htmlFor="filter-start-date" className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Start Date (From)
          </label>
          <input
            id="filter-start-date"
            type="date"
            value={localFilters.dateFrom}
            onChange={(e) => handleCustomDateChange(e.target.value, localFilters.dateTo)}
            className="w-full bg-gray-800/90 text-gray-200 text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1 sm:col-span-2 md:col-span-1">
          <label htmlFor="filter-end-date" className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            End Date (To)
          </label>
          <input
            id="filter-end-date"
            type="date"
            value={localFilters.dateTo}
            onChange={(e) => handleCustomDateChange(localFilters.dateFrom, e.target.value)}
            className="w-full bg-gray-800/90 text-gray-200 text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Source / Channel Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-traffic-channel" className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
            <Share2 className="w-3 h-3 text-emerald-400" aria-hidden="true" />
            Traffic Channel
          </label>
          <select
            id="filter-traffic-channel"
            value={localFilters.source}
            onChange={(e) => handleChange('source', e.target.value)}
            className="w-full bg-gray-800/90 text-gray-200 text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Traffic Sources</option>
            <option value="direct">Direct Visitors</option>
            <option value="whatsapp">WhatsApp Gateway</option>
            <option value="search">Organic Search (Google/Bing)</option>
            <option value="email">Email Campaigns</option>
          </select>
        </div>

        {/* Platform Device Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-device-platform" className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
            <Monitor className="w-3 h-3 text-purple-400" aria-hidden="true" />
            Device Platform
          </label>
          <select
            id="filter-device-platform"
            value={localFilters.device}
            onChange={(e) => handleChange('device', e.target.value)}
            className="w-full bg-gray-800/90 text-gray-200 text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Devices</option>
            <option value="desktop">Desktop Computers</option>
            <option value="mobile">Mobile Smartphones</option>
            <option value="tablet">Tablet Devices</option>
          </select>
        </div>

        {/* City Filter Search */}
        <div className="space-y-1">
          <label htmlFor="filter-city-search" className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
            <Search className="w-3 h-3 text-amber-400" aria-hidden="true" />
            City Search
          </label>
          <input
            id="filter-city-search"
            type="text"
            placeholder="e.g. Tashkent, Moscow"
            value={localFilters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full bg-gray-800/90 text-gray-200 text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
