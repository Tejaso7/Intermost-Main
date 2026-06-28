'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Youtube, Plus, Trash2, Edit2, Play, ExternalLink, Loader2, ArrowUpDown } from 'lucide-react';
import { shortsApi, type YouTubeShort } from '@/lib/services';
import toast from 'react-hot-toast';

export default function ShortsAdminPage() {
  const [shorts, setShorts] = useState<YouTubeShort[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShorts = async () => {
    setLoading(true);
    try {
      // Fetch all shorts (active & inactive)
      const data = await shortsApi.getAll({ is_active: 'all' });
      setShorts(data);
    } catch (error) {
      toast.error('Failed to load YouTube shorts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this YouTube Short?')) return;
    try {
      await shortsApi.delete(id);
      toast.success('YouTube Short deleted successfully');
      fetchShorts();
    } catch (error) {
      toast.error('Failed to delete YouTube Short');
      console.error(error);
    }
  };

  const toggleStatus = async (short: YouTubeShort) => {
    if (!short._id) return;
    try {
      await shortsApi.update(short._id, {
        ...short,
        is_active: !short.is_active,
      });
      toast.success(`Short status updated`);
      fetchShorts();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const getYoutubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <Youtube className="w-8 h-8 text-red-650" />
            YouTube Shorts
          </h1>
          <p className="text-gray-500 mt-1">
            Manage student testimonial videos, campus tours, and short highlight clips displayed on the homepage slider.
          </p>
        </div>

        <Link
          href="/admin/shorts/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/10 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          Add New Short
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-red-550 mb-2" />
          <p className="text-sm font-semibold">Loading shorts list...</p>
        </div>
      ) : shorts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Youtube className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No YouTube Shorts Added</h3>
          <p className="text-sm text-gray-500 mb-6">
            Add short format YouTube videos to engage students on the landing page slider with authentic campus life.
          </p>
          <Link
            href="/admin/shorts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create First Short
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shorts.map((short, index) => {
            const videoId = getYoutubeId(short.url);
            return (
              <motion.div
                key={short._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Video Frame Preview / Thumbnail */}
                <div className="aspect-[9/16] max-h-[320px] bg-black relative flex items-center justify-center overflow-hidden group">
                  {videoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt={short.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="text-center text-gray-500 p-4">
                      <Play className="w-12 h-12 text-red-500 mx-auto mb-2 opacity-60" />
                      <span className="text-xs">Preview Not Available</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] text-white font-semibold">
                    Order: {short.display_order}
                  </div>

                  <a
                    href={short.url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </a>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">{short.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 truncate font-mono">{short.url}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => toggleStatus(short)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        short.is_active
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {short.is_active ? 'Active' : 'Inactive'}
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/shorts/${short._id}`}
                        className="p-2 hover:bg-gray-50 text-gray-500 hover:text-primary-600 rounded-lg border border-gray-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(short._id as string)}
                        className="p-2 hover:bg-red-50 text-gray-550 hover:text-red-600 rounded-lg border border-gray-100 transition-colors"
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
