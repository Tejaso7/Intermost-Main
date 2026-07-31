'use client';

import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { Activity, RefreshCw, Zap, Eye, Globe, Clock, ChevronRight, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LiveVisitorBannerProps {
  activeVisitors?: number;
  activePages?: Array<{ _id?: string; page: string; location?: string; count?: number }>;
  refreshIntervalSeconds?: number;
  onRefreshIntervalChange?: (seconds: number) => void;
  onManualRefresh?: () => void;
  lastUpdated?: Date | null;
  loading?: boolean;
}

export const LiveVisitorBanner: React.FC<LiveVisitorBannerProps> = ({
  activeVisitors = 18,
  activePages = [],
  refreshIntervalSeconds = 30,
  onRefreshIntervalChange,
  onManualRefresh,
  lastUpdated = new Date(),
  loading = false,
}) => {
  const [countdown, setCountdown] = useState<number>(refreshIntervalSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(refreshIntervalSeconds === 0);

  // Countdown timer effect for auto-refresh
  useEffect(() => {
    if (refreshIntervalSeconds === 0 || isPaused) return;

    setCountdown(refreshIntervalSeconds);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (onManualRefresh) onManualRefresh();
          return refreshIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshIntervalSeconds, isPaused, onManualRefresh]);

  const handleIntervalSelect = (seconds: number) => {
    if (seconds === 0) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
      setCountdown(seconds);
    }
    if (onRefreshIntervalChange) {
      onRefreshIntervalChange(seconds);
    }
  };

  const progressPct = refreshIntervalSeconds > 0
    ? Math.round(((refreshIntervalSeconds - countdown) / refreshIntervalSeconds) * 100)
    : 0;

  return (
    <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-2xl border border-gray-800 p-5 shadow-2xl space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Live Active Visitor Counter */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-40" />
            <Activity className="w-6 h-6 animate-pulse text-emerald-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Live Visitor Telemetry
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE NOW
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl md:text-3xl font-extrabold text-white font-mono tracking-tight">
                <CountUp end={activeVisitors} duration={1.2} preserveValue />
              </span>
              <span className="text-sm font-medium text-gray-300">
                Students Active on Platform
              </span>
            </div>
          </div>
        </div>

        {/* Auto-Refresh Timer & Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Countdown Indicator Bar */}
          {refreshIntervalSeconds > 0 && !isPaused && (
            <div className="flex items-center gap-2 bg-gray-950/80 px-3 py-1.5 rounded-xl border border-gray-800 text-xs">
              <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-gray-400">Auto-sync in</span>
              <span className="font-bold text-white font-mono w-5 text-center">{countdown}s</span>
              <div className="w-12 bg-gray-800 rounded-full h-1.5 overflow-hidden ml-1">
                <div
                  className="bg-blue-500 h-full transition-all duration-1000"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Refresh Frequency Dropdown */}
          <div className="flex items-center gap-1 bg-gray-950/80 p-1 rounded-xl border border-gray-800 text-xs">
            <span className="text-gray-400 px-2 text-[11px] font-medium hidden sm:inline">Refresh:</span>
            {[15, 30, 60, 0].map((sec) => (
              <button
                key={sec}
                onClick={() => handleIntervalSelect(sec)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  (sec === 0 && isPaused) || (sec === refreshIntervalSeconds && !isPaused)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {sec === 0 ? 'Off' : `${sec}s`}
              </button>
            ))}
          </div>

          {/* Manual Refresh Button */}
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              disabled={loading}
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors border border-gray-700 disabled:opacity-50"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Active Pages Live Ticker Row */}
      {activePages.length > 0 && (
        <div className="pt-3 border-t border-gray-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 sm:col-span-2 md:col-span-3 mb-1">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            Currently Viewed Pages by Active Students:
          </div>

          {activePages.slice(0, 6).map((item, idx) => (
            <div
              key={item._id || idx}
              className="bg-gray-950/60 border border-gray-800/60 px-3 py-2 rounded-xl flex items-center justify-between gap-2 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="font-mono text-gray-200 truncate text-[11px]">
                  {item.page || '/'}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 bg-gray-900 px-2 py-0.5 rounded-md flex-shrink-0">
                {item.location || 'India'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
