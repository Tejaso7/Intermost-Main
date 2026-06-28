'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Youtube, ChevronLeft, Save, Loader2 } from 'lucide-react';
import { shortsApi, type YouTubeShort } from '@/lib/services';
import toast from 'react-hot-toast';

export default function ShortEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<YouTubeShort>>({
    title: '',
    url: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    if (isNew) return;

    const fetchShort = async () => {
      setLoading(true);
      try {
        const data = await shortsApi.getById(id);
        setFormData(data);
      } catch (error) {
        toast.error('Failed to load YouTube Short details');
        console.error(error);
        router.push('/admin/shorts');
      } finally {
        setLoading(false);
      }
    };

    fetchShort();
  }, [id, isNew, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.url?.trim()) {
      toast.error('Title and YouTube URL are required');
      return;
    }

    // Basic URL validation
    if (!formData.url.includes('youtube.com') && !formData.url.includes('youtu.be')) {
      toast.error('Please enter a valid YouTube or YouTube Shorts URL');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await shortsApi.create(formData);
        toast.success('YouTube Short created successfully');
      } else {
        await shortsApi.update(id, formData);
        toast.success('YouTube Short updated successfully');
      }
      router.push('/admin/shorts');
    } catch (error) {
      toast.error(isNew ? 'Failed to create YouTube Short' : 'Failed to update YouTube Short');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/shorts"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <Youtube className="w-8 h-8 text-red-650" />
            {isNew ? 'Add YouTube Short' : 'Edit YouTube Short'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isNew ? 'Register a new short format video link.' : 'Update details for this short video link.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-red-550 mb-2" />
          <p className="text-sm font-semibold">Loading details...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-sm">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Video Title / Description
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Student placement feedback from Moscow University"
            />
          </div>

          {/* YouTube URL */}
          <div className="space-y-1.5">
            <label htmlFor="url" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              YouTube Video URL
            </label>
            <input
              id="url"
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-red-500"
              placeholder="e.g. https://www.youtube.com/shorts/qsRofiNxeRY"
            />
            <p className="text-gray-400 text-[10px] leading-relaxed">
              Supports standard YouTube URLs, video embed URLs, and YouTube Shorts format URLs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Display Order */}
            <div className="space-y-1.5">
              <label htmlFor="order" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Display Order Sort
              </label>
              <input
                id="order"
                type="number"
                required
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-red-500"
                placeholder="0"
              />
            </div>

            {/* Active Switch */}
            <div className="flex items-center gap-3 pt-6 sm:pt-7">
              <input
                id="active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-red-650 bg-gray-100 border-gray-300 rounded focus:ring-red-550 focus:ring-2"
              />
              <label htmlFor="active" className="text-sm font-semibold text-gray-700 select-none">
                Active & Display on Slider
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-150 flex justify-end gap-3">
            <Link
              href="/admin/shorts"
              className="px-5 py-2.5 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/10 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isNew ? 'Create Short' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
