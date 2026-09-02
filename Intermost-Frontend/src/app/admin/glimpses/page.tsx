'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, Plus, Trash2, Edit2, Loader2, Youtube, Eye, EyeOff, Play } from 'lucide-react';
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

  const handleToggleVisibility = async (glimpse: Glimpse) => {
    if (!glimpse._id) return;
    const newStatus = glimpse.is_active === false ? true : false;
    try {
      await glimpsesApi.update(glimpse._id, { is_active: newStatus });
      toast.success(newStatus ? 'Glimpse is now visible on website' : 'Glimpse is now hidden from website');
      setGlimpses(prev =>
        prev.map(g => (g._id === glimpse._id ? { ...g, is_active: newStatus } : g))
      );
    } catch (error) {
      toast.error('Failed to update glimpse visibility');
      console.error(error);
    }
  };

  const getYoutubeId = (url?: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
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
            Manage real-life student photos & YouTube video links. Hide or show items on the website anytime.
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
            Add real student journey photos or YouTube video links to show prospective students authentic details of classes, hostels, and arrivals.
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
          {glimpses.map((glimpse, index) => {
            const ytId = getYoutubeId(glimpse.video_url);
            const displayImg = glimpse.image || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '/images/placeholder.jpg');
            const isVisible = glimpse.is_active !== false;

            return (
              <motion.div
                key={glimpse._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl border ${isVisible ? 'border-gray-200' : 'border-amber-200 bg-amber-50/20'} overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-[400px]`}
              >
                {/* Photo / Video Frame */}
                <div className="relative flex-1 bg-gray-100 overflow-hidden group">
                  <Image
                    src={displayImg}
                    alt={glimpse.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <span className="absolute top-3 left-3 bg-black/65 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] text-white font-semibold z-10">
                    Order: {glimpse.display_order}
                  </span>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {glimpse.video_url && (
                      <span className="bg-red-600 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg px-2 py-0.5 shadow-sm flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-white" /> YouTube
                      </span>
                    )}
                    <span className="bg-primary/85 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg px-2 py-0.5 shadow-sm">
                      {glimpse.categoryLabel}
                    </span>
                  </div>

                  {glimpse.video_url && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Details & Actions */}
                <div className="p-4 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 leading-snug line-clamp-1 flex-1">{glimpse.title}</h3>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1 min-h-[32px]">{glimpse.caption}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                        {glimpse.country}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(glimpse)}
                      title={isVisible ? 'Hide from website' : 'Show on website'}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isVisible
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Hidden
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/glimpses/${glimpse._id}`}
                        className="p-2 hover:bg-gray-50 text-gray-500 hover:text-primary-600 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                        title="Edit glimpse"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(glimpse._id as string)}
                        className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                        title="Delete glimpse"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
