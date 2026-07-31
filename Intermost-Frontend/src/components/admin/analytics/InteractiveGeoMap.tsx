'use client';

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Globe, Eye, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GeoLocationMarker {
  city: string;
  region?: string;
  country: string;
  lat: number;
  lon: number;
  visit_count: number;
  last_active?: string;
}

interface InteractiveGeoMapProps {
  locations: GeoLocationMarker[];
  onSelectLocation?: (location: GeoLocationMarker) => void;
  selectedCity?: string | null;
}

const geoUrl = '/maps/world-110m.json';

export const InteractiveGeoMap: React.FC<InteractiveGeoMapProps> = ({
  locations,
  onSelectLocation,
  selectedCity,
}) => {
  const [position, setPosition] = useState<{ center: [number, number]; zoom: number }>({
    center: [55, 30], // Centered around Euro-Asia / Global view
    zoom: 1.2,
  });
  const [hoveredMarker, setHoveredMarker] = useState<GeoLocationMarker | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const handleZoomIn = () => {
    setPosition((prev) => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 8) }));
  };

  const handleZoomOut = () => {
    setPosition((prev) => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 1) }));
  };

  const handleReset = () => {
    setPosition({ center: [55, 30], zoom: 1.2 });
  };

  const handleMoveEnd = (pos: { coordinates: [number, number]; zoom: number }) => {
    if (pos.coordinates) {
      setPosition({ center: pos.coordinates, zoom: pos.zoom });
    }
  };

  // Helper to determine marker color intensity based on visit count
  const getMarkerColor = (count: number) => {
    if (count > 500) return '#ef4444'; // Red hotspot
    if (count > 200) return '#f59e0b'; // Amber
    if (count > 50) return '#10b981'; // Emerald
    return '#3b82f6'; // Blue
  };

  const getMarkerRadius = (count: number) => {
    return Math.min(18, Math.max(5, Math.sqrt(count) * 1.8));
  };

  return (
    <div className="relative w-full rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-gray-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-gray-800 shadow-lg">
        <Globe className="w-5 h-5 text-blue-400 animate-pulse" />
        <div>
          <h3 className="text-sm font-semibold text-white">Global Traffic Command Map</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
            {locations.length} Live Geo Hotspots Tracked
          </p>
        </div>
      </div>

      {/* Floating Zoom & Pan Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-gray-950/80 backdrop-blur-md p-1.5 rounded-xl border border-gray-800 shadow-lg">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset Map View"
          className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Canvas */}
      <div
        className="w-full h-[480px] bg-slate-950 cursor-grab active:cursor-grabbing"
        onMouseLeave={() => setHoveredMarker(null)}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.center}
            onMoveEnd={handleMoveEnd}
            minZoom={1}
            maxZoom={8}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth={0.6}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#334155', outline: 'none', transition: 'all 0.2s' },
                      pressed: { fill: '#0f172a', outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Location Markers */}
            {locations.map((loc, idx) => {
              const isSelected = selectedCity === loc.city;
              const radius = getMarkerRadius(loc.visit_count);
              const color = getMarkerColor(loc.visit_count);

              // Guard against missing/invalid lat & lon
              if (loc.lat === 0 && loc.lon === 0) return null;

              return (
                <Marker
                  key={`${loc.city}-${loc.country}-${idx}`}
                  coordinates={[loc.lon, loc.lat]}
                  onMouseEnter={(evt) => {
                    setHoveredMarker(loc);
                    setTooltipPos({ x: evt.clientX, y: evt.clientY });
                  }}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={() => onSelectLocation?.(loc)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Outer Pulsing Aura for High Traffic / Selected */}
                  {(loc.visit_count > 200 || isSelected) && (
                    <circle
                      r={radius + 6}
                      fill={color}
                      opacity={0.35}
                      className="animate-ping"
                    />
                  )}
                  {/* Inner Solid Marker */}
                  <circle
                    r={radius}
                    fill={color}
                    stroke={isSelected ? '#ffffff' : '#090d16'}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={0.9}
                  />
                  {/* Center Dot */}
                  <circle r={2} fill="#ffffff" />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Hover Card Tooltip */}
      <AnimatePresence>
        {hoveredMarker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute bottom-4 left-4 z-30 bg-gray-950/95 border border-gray-800 p-4 rounded-xl shadow-2xl max-w-xs backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white text-sm">
                  {hoveredMarker.city}, {hoveredMarker.country}
                </span>
              </div>
              <span
                className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase"
                style={{
                  backgroundColor: `${getMarkerColor(hoveredMarker.visit_count)}20`,
                  color: getMarkerColor(hoveredMarker.visit_count),
                }}
              >
                {hoveredMarker.visit_count > 200 ? 'Hotspot' : 'Active'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-900/80 p-2 rounded-lg border border-gray-800/50">
                <span className="text-gray-400 block text-[10px]">Visits / Views</span>
                <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                  <Eye className="w-3 h-3 text-blue-400" />
                  {hoveredMarker.visit_count.toLocaleString()}
                </span>
              </div>
              <div className="bg-gray-900/80 p-2 rounded-lg border border-gray-800/50">
                <span className="text-gray-400 block text-[10px]">Region</span>
                <span className="text-gray-200 font-medium truncate block mt-0.5">
                  {hoveredMarker.region || 'Standard'}
                </span>
              </div>
            </div>
            {hoveredMarker.last_active && (
              <p className="text-[10px] text-gray-500 mt-2 text-right">
                Last active: {new Date(hoveredMarker.last_active).toLocaleString()}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend Footer */}
      <div className="bg-gray-950/90 border-t border-gray-800 px-4 py-2.5 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-300">Traffic Scale:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> &lt;50
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 50-200
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 200-500
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> &gt;500
          </span>
        </div>
        <div className="text-[11px] text-gray-500 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-gray-400" /> Drag to Pan | Scroll to Zoom
        </div>
      </div>
    </div>
  );
};
