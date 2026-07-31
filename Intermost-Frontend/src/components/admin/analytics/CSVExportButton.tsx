'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CSVExportButtonProps {
  geoData?: Array<{
    city: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    visit_count: number;
    last_active?: string;
  }>;
  summaryData?: any;
  filenamePrefix?: string;
  buttonLabel?: string;
}

export const CSVExportButton: React.FC<CSVExportButtonProps> = ({
  geoData = [],
  summaryData,
  filenamePrefix = 'intermost_geo_analytics',
  buttonLabel = 'Export CSV Report',
}) => {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = () => {
    try {
      setExporting(true);

      if ((!geoData || geoData.length === 0) && !summaryData) {
        toast.error('No analytics data available to export');
        setExporting(false);
        return;
      }

      let csvContent = '\uFEFF'; // Add UTF-8 BOM for Excel compatibility

      if (geoData && geoData.length > 0) {
        // Build CSV headers for Geo Location dataset
        const headers = ['City', 'Region', 'Country', 'Latitude', 'Longitude', 'Visit Count / Pageviews', 'Last Active'];
        csvContent += headers.map((h) => `"${h}"`).join(',') + '\n';

        // Build CSV data rows
        geoData.forEach((row) => {
          const city = `"${(row.city || '').replace(/"/g, '""')}"`;
          const region = `"${(row.region || '').replace(/"/g, '""')}"`;
          const country = `"${(row.country || '').replace(/"/g, '""')}"`;
          const lat = row.lat || 0;
          const lon = row.lon || 0;
          const count = row.visit_count || 0;
          const lastActive = `"${(row.last_active || '').replace(/"/g, '""')}"`;

          csvContent += [city, region, country, lat, lon, count, lastActive].join(',') + '\n';
        });
      } else if (summaryData) {
        // Build CSV summary format
        csvContent += '"Metric","Value"\n';
        if (summaryData.today) {
          csvContent += `"Today Pageviews",${summaryData.today.pageviews || 0}\n`;
          csvContent += `"Today Visitors",${summaryData.today.visitors || 0}\n`;
        }
        if (summaryData.total) {
          csvContent += `"Total Pageviews",${summaryData.total.pageviews || 0}\n`;
          csvContent += `"Total Visitors",${summaryData.total.visitors || 0}\n`;
        }
      }

      // Generate Blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${filenamePrefix}_${timestamp}.csv`;

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Successfully exported ${filename}`);
    } catch (err) {
      console.error('CSV Export Error:', err);
      toast.error('Failed to export CSV report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExportCSV}
      disabled={exporting}
      aria-label="Export CSV spreadsheet report"
      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      title="Download CSV spreadsheet report"
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
      ) : (
        <FileSpreadsheet className="w-4 h-4 text-emerald-100" aria-hidden="true" />
      )}
      <span>{exporting ? 'Generating...' : buttonLabel}</span>
    </button>
  );
};
