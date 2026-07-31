'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Globe,
  MapPin,
  Clock,
  Filter,
  Layers,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export interface GeoDataRecord {
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  visit_count: number;
  pageviews?: number;
  last_active?: string;
}

interface GeoDataTableProps {
  data: GeoDataRecord[];
  onSelectRow?: (record: GeoDataRecord) => void;
  selectedCity?: string | null;
  serverTotalItems?: number;
  serverPage?: number;
  serverPageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

type SortField = 'city' | 'region' | 'country' | 'visit_count' | 'last_active';
type SortOrder = 'asc' | 'desc';

export const GeoDataTable: React.FC<GeoDataTableProps> = ({
  data = [],
  onSelectRow,
  selectedCity,
  serverTotalItems,
  serverPage = 1,
  serverPageSize = 10,
  onPageChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('visit_count');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Extract unique countries for quick filter dropdown
  const countriesList = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      if (item.country) set.add(item.country);
    });
    return Array.from(set).sort();
  }, [data]);

  // Filtering & Sorting
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.city.toLowerCase().includes(q) ||
          item.region.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q)
      );
    }

    if (countryFilter !== 'all') {
      result = result.filter((item) => item.country === countryFilter);
    }

    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'last_active') {
        valA = a.last_active ? new Date(a.last_active).getTime() : 0;
        valB = b.last_active ? new Date(b.last_active).getTime() : 0;
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, searchTerm, countryFilter, sortField, sortOrder]);

  // Pagination logic (client side fallback if server pagination not driven)
  const isServerPaginated = serverTotalItems !== undefined;
  const totalItems = serverTotalItems ?? filteredAndSortedData.length;
  const activePage = isServerPaginated ? (serverPage ?? 1) : currentPage;
  const activePageSize = isServerPaginated ? (serverPageSize ?? 10) : pageSize;
  const totalPages = Math.ceil(totalItems / activePageSize) || 1;

  const paginatedRows = useMemo(() => {
    if (isServerPaginated) return filteredAndSortedData;
    const start = (activePage - 1) * activePageSize;
    return filteredAndSortedData.slice(start, start + activePageSize);
  }, [filteredAndSortedData, activePage, activePageSize, isServerPaginated]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handlePageChange = (newPage: number) => {
    const page = Math.max(1, Math.min(newPage, totalPages));
    if (onPageChange) {
      onPageChange(page, activePageSize);
    } else {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (onPageChange) {
      onPageChange(1, newSize);
    } else {
      setPageSize(newSize);
      setCurrentPage(1);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-950/60">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-semibold text-white">Geographic Location Analytics</h3>
          <span className="ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {totalItems} Locations
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search city, region, country..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-800/80 text-gray-200 placeholder-gray-500 text-xs rounded-xl pl-9 pr-4 py-2 border border-gray-700/60 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Country Dropdown Filter */}
          <div className="relative">
            <select
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-800/80 text-gray-200 text-xs rounded-xl px-3 py-2 border border-gray-700/60 focus:outline-none focus:border-blue-500 appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Countries</option>
              {countriesList.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300 border-collapse">
          <thead className="bg-gray-950 text-gray-400 uppercase font-semibold border-b border-gray-800">
            <tr>
              <th
                onClick={() => handleSort('city')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  City
                  {sortField === 'city' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('region')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  Region
                  {sortField === 'region' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('country')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Country
                  {sortField === 'country' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4">Coordinates (Lat, Lon)</th>
              <th
                onClick={() => handleSort('visit_count')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  Visit Count / Views
                  {sortField === 'visit_count' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('last_active')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Last Active
                  {sortField === 'last_active' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => {
                const isSelected = selectedCity === row.city;
                const count = row.visit_count || row.pageviews || 0;
                return (
                  <tr
                    key={`${row.city}-${row.country}-${idx}`}
                    onClick={() => onSelectRow?.(row)}
                    className={`hover:bg-gray-800/50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      {row.city || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-gray-400">{row.region || '—'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 bg-gray-800 text-gray-200 px-2 py-0.5 rounded-md text-[11px]">
                        {row.country || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                      {row.lat ? row.lat.toFixed(4) : '0.0000'}, {row.lon ? row.lon.toFixed(4) : '0.0000'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      <span className="inline-block bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg">
                        {count.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400 text-[11px]">
                      {row.last_active ? new Date(row.last_active).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No geographic location records matching query filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-800 bg-gray-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <span>Rows per page:</span>
          <select
            value={activePageSize}
            onChange={handlePageSizeChange}
            className="bg-gray-800 text-gray-200 text-xs rounded-lg px-2 py-1 border border-gray-700 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>
            Showing {totalItems > 0 ? (activePage - 1) * activePageSize + 1 : 0} to{' '}
            {Math.min(activePage * activePageSize, totalItems)} of {totalItems} locations
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage <= 1}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 bg-gray-800 text-white font-medium rounded-lg">
            Page {activePage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage >= totalPages}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
