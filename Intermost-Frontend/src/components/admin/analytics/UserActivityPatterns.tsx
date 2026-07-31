'use client';

import React, { useState } from 'react';
import { Clock, Calendar, Users, Zap, UserPlus, UserCheck, Flame, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface UserActivityPatternsData {
  heatmap: number[][]; // 7 days x 24 hours matrix
  session_buckets: {
    '0-30s': number;
    '30s-2m': number;
    '2-5m': number;
    '5-15m': number;
    '15m+': number;
  };
  peak_hour: number; // 0-23
  peak_day: string; // e.g. "Wednesday"
  new_vs_returning?: {
    new: number;
    returning: number;
    total_visitors?: number;
  };
}

interface UserActivityPatternsProps {
  data: UserActivityPatternsData | null;
  loading?: boolean;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const UserActivityPatterns: React.FC<UserActivityPatternsProps> = ({ data, loading }) => {
  const [hoveredCell, setHoveredCell] = useState<{ dayIdx: number; hour: number; count: number } | null>(null);

  if (loading || !data) {
    return (
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-2xl animate-pulse text-center text-gray-500">
        Loading user activity patterns & heatmap...
      </div>
    );
  }

  const { heatmap, session_buckets, peak_hour, peak_day, new_vs_returning } = data;

  // Calculate max pageview count in heatmap for color scaling
  let maxCount = 1;
  if (heatmap && heatmap.length) {
    heatmap.forEach((dayRow) => {
      dayRow.forEach((val) => {
        if (val > maxCount) maxCount = val;
      });
    });
  }

  // Heatmap cell color scaling helper
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-gray-800/40 border-gray-800/60';
    const ratio = count / maxCount;
    if (ratio > 0.75) return 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/50';
    if (ratio > 0.45) return 'bg-indigo-600 text-white font-semibold';
    if (ratio > 0.2) return 'bg-blue-600 text-white';
    return 'bg-blue-900/60 text-blue-200';
  };

  // Session buckets total count
  const totalSessions = Object.values(session_buckets || {}).reduce((acc, val) => acc + val, 0) || 1;

  // New vs Returning calculations
  const newVisitors = new_vs_returning?.new || 0;
  const returningVisitors = new_vs_returning?.returning || 0;
  const totalVisitors = (newVisitors + returningVisitors) || 1;
  const newPct = Math.round((newVisitors / totalVisitors) * 100);
  const returningPct = Math.round((returningVisitors / totalVisitors) * 100);

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl p-6 space-y-8">
      {/* Component Title & Peak Highlights Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
            <h3 className="text-lg font-bold text-white">7x24 User Activity Patterns</h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Weekly heatmap matrix, session duration buckets, & peak engagement hours
          </p>
        </div>

        {/* Peak Indicators Badge Cards */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] text-amber-300 font-semibold uppercase block">Peak Traffic Hour</span>
              <span className="text-sm font-bold text-white">
                {peak_hour.toString().padStart(2, '0')}:00 - {(peak_hour + 1).toString().padStart(2, '0')}:00 IST
              </span>
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="text-[10px] text-indigo-300 font-semibold uppercase block">Peak Activity Day</span>
              <span className="text-sm font-bold text-white">{peak_day || 'Monday'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: 7x24 Heatmap Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Hourly Traffic Intensity (Days vs. Hours)
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>Low</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded bg-gray-800/60 inline-block" />
              <span className="w-3 h-3 rounded bg-blue-900/60 inline-block" />
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
              <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
              <span className="w-3 h-3 rounded bg-purple-600 inline-block" />
            </div>
            <span>High</span>
          </div>
        </div>

        {/* Heatmap Grid Table Container */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[720px]">
            {/* Hours Header */}
            <div className="grid grid-cols-[100px_repeat(24,minmax(0,1fr))] gap-1 mb-1 text-[10px] text-gray-400 text-center font-mono">
              <div className="text-left pl-2 font-sans font-medium">Day / Hour</div>
              {HOURS.map((h) => (
                <div key={h} className="py-1">
                  {h.toString().padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Days Rows */}
            {DAYS_OF_WEEK.map((dayName, dayIdx) => (
              <div
                key={dayName}
                className="grid grid-cols-[100px_repeat(24,minmax(0,1fr))] gap-1 mb-1 items-center"
              >
                <div className="text-xs font-medium text-gray-300 pl-2 truncate flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${peak_day === dayName ? 'bg-amber-400' : 'bg-gray-600'}`} />
                  {dayName}
                </div>
                {HOURS.map((hour) => {
                  const count = heatmap[dayIdx]?.[hour] || 0;
                  const isPeak = dayName === peak_day && hour === peak_hour;
                  return (
                    <div
                      key={hour}
                      onMouseEnter={() => setHoveredCell({ dayIdx, hour, count })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`h-7 rounded-md transition-all duration-150 flex items-center justify-center text-[10px] cursor-pointer hover:scale-110 hover:z-10 border ${getCellColor(
                        count
                      )} ${isPeak ? 'ring-2 ring-amber-400 border-amber-300' : 'border-transparent'}`}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Cell Tooltip Bar */}
        <div className="h-6">
          <AnimatePresence>
            {hoveredCell ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-blue-300 font-medium bg-blue-950/60 border border-blue-800/60 rounded-lg px-3 py-1 inline-flex items-center gap-2"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {DAYS_OF_WEEK[hoveredCell.dayIdx]} at{' '}
                  {hoveredCell.hour.toString().padStart(2, '0')}:00 -{' '}
                  {(hoveredCell.hour + 1).toString().padStart(2, '0')}:00 IST:
                </span>
                <span className="font-bold text-white">{hoveredCell.count} Pageviews</span>
              </motion.div>
            ) : (
              <span className="text-[11px] text-gray-500 italic">Hover over any grid cell to view detailed hourly volume.</span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: Session Duration Histogram & New vs Returning Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
        {/* Session Duration Buckets */}
        <div className="space-y-4 bg-gray-950/50 p-5 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Session Duration Distribution
            </h4>
            <span className="text-[11px] text-gray-400 font-mono">{totalSessions} Sessions</span>
          </div>

          <div className="space-y-3">
            {Object.entries(session_buckets).map(([bucketLabel, count]) => {
              const pct = Math.round((count / totalSessions) * 100);
              return (
                <div key={bucketLabel} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium">{bucketLabel}</span>
                    <span className="text-gray-400 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        bucketLabel === '15m+'
                          ? 'bg-purple-500'
                          : bucketLabel === '5-15m'
                          ? 'bg-indigo-500'
                          : bucketLabel === '2-5m'
                          ? 'bg-blue-500'
                          : bucketLabel === '30s-2m'
                          ? 'bg-emerald-500'
                          : 'bg-gray-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* New vs Returning Visitor Breakdown */}
        <div className="space-y-4 bg-gray-950/50 p-5 rounded-xl border border-gray-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              New vs. Returning Visitors
            </h4>
            <span className="text-[11px] text-gray-400 font-mono">{totalVisitors} Total Unique</span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-auto">
            {/* New Visitors */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block">New Visitors</span>
                <span className="text-lg font-bold text-white">{newVisitors}</span>
                <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">{newPct}% of total</span>
              </div>
            </div>

            {/* Returning Visitors */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block">Returning Visitors</span>
                <span className="text-lg font-bold text-white">{returningVisitors}</span>
                <span className="text-[10px] text-blue-400 font-medium block mt-0.5">{returningPct}% of total</span>
              </div>
            </div>
          </div>

          {/* Dual Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${newPct}%` }}
              transition={{ duration: 0.8 }}
              className="bg-emerald-500 h-full"
              title={`New Visitors: ${newPct}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${returningPct}%` }}
              transition={{ duration: 0.8 }}
              className="bg-blue-500 h-full"
              title={`Returning Visitors: ${returningPct}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
