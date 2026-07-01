'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { glimpsesApi, type Glimpse } from '@/lib/services';
import toast from 'react-hot-toast';

export default function GlimpsesAdminPage() {
  const [glimpses, setGlimpses] = useState<Glimpse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGlimpses = async () => {
    setLoading(true);
    try {
      const data = await glimpsesApi.getAll();
      setGlimpses(data);
    } catch (error) {
      toast.error('Failed to load student glimpses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlimpses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Student Journey Glimpse?')) return;
    try {
      await glimpsesApi.delete(id);
      toast.success('Student glimpse deleted successfully');
      fetchGlimpses();
    } catch (error) {
      toast.error('Failed to delete student glimpse');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2 font-display">
            <Camera className="w-8 h-8 text-primary" />
            Student Journeys (Glimpses)
          </h1>
          <p className="text-gray-500 mt-1">
            Manage real-life images showing anatomy labs, hostel mess halls, student orientations, and departures.
          </p>
        </div>

        <Link
          href="/admin/glimpses/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/10 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Glimpse
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p className="text-sm font-semibold">Loading glimpses...</p>
        </div>
      ) : glimpses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Student Glimpses Added</h3>
          <p className="text-sm text-gray-500 mb-6">
            Add real student journey photos to show prospective students authentic details of classes, hostels, and arrivals.
          </p>
          <Link
            href="/admin/glimpses/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Create First Glimpse
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {glimpses.map((glimpse, index) => (
            <motion.div
              key={glimpse._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-[400px]"
            >
              {/* Photo Frame */}
              <div className="relative flex-1 bg-gray-150 overflow-hidden group">
                <Image
                  src={glimpse.image}
                  alt={glimpse.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] text-white font-semibold">
                  Order: {glimpse.display_order}
                </span>

                <span className="absolute top-3 right-3 bg-primary/85 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg px-2 py-0.5 shadow-sm">
                  {glimpse.categoryLabel}
                </span>
              </div>

              {/* Details & Actions */}
              <div className="p-4 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 leading-snug line-clamp-1">{glimpse.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1 min-h-[32px]">{glimpse.caption}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-150 rounded px-1.5 py-0.5">
                      {glimpse.country}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/glimpses/${glimpse._id}`}
                    className="p-2 hover:bg-gray-50 text-gray-500 hover:text-primary-600 rounded-lg border border-gray-100 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(glimpse._id as string)}
                    className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg border border-gray-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
