'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Camera, ChevronLeft, Save, Loader2, Youtube, Eye, EyeOff } from 'lucide-react';
import { glimpsesApi, type Glimpse } from '@/lib/services';
import ImageUpload from '@/components/admin/ImageUpload';
import toast from 'react-hot-toast';

export default function GlimpseEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Glimpse>>({
    title: '',
    category: 'campus',
    categoryLabel: 'Campus Life',
    image: '',
    video_url: '',
    is_active: true,
    caption: '',
    country: 'Russia',
    display_order: 1
  });

  const categoriesMap = {
    campus: 'Campus Life',
    hostel: 'Hostel & Food',
    arrivals: 'Arrival Orientations',
    training: 'Clinical Training'
  };

  useEffect(() => {
    if (isNew) return;

    const fetchGlimpse = async () => {
      setLoading(true);
      try {
        const data = await glimpsesApi.getById(id);
        setFormData({
          is_active: true,
          video_url: '',
          ...data
        });
      } catch (error) {
        toast.error('Failed to load glimpse details');
        console.error(error);
        router.push('/admin/glimpses');
      } finally {
        setLoading(false);
      }
    };

    fetchGlimpse();
  }, [id, isNew, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.caption?.trim()) {
      toast.error('Title and Caption are required');
      return;
    }

    if (!formData.image?.trim() && !formData.video_url?.trim()) {
      toast.error('Please provide an image or a YouTube video link');
      return;
    }

    const payload = {
      ...formData,
      is_active: formData.is_active !== false,
      categoryLabel: categoriesMap[formData.category as keyof typeof categoriesMap] || 'General'
    };

    setSaving(true);
    try {
      if (isNew) {
        await glimpsesApi.create(payload);
        toast.success('Student glimpse created successfully');
      } else {
        await glimpsesApi.update(id, payload);
        toast.success('Student glimpse updated successfully');
      }
      router.push('/admin/glimpses');
    } catch (error) {
      toast.error(isNew ? 'Failed to create student glimpse' : 'Failed to update student glimpse');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/glimpses"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2 font-display">
            <Camera className="w-8 h-8 text-primary" />
            {isNew ? 'Add Student Glimpse' : 'Edit Student Glimpse'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isNew ? 'Register a new student life journey picture or video.' : 'Update details for this glimpse item.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p className="text-sm font-semibold">Loading details...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-sm">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Glimpse Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g. Indian Mess Food / Lab Session"
            />
          </div>

          {/* YouTube Video Link Field */}
          <div className="space-y-1.5 p-4 bg-red-50/50 border border-red-100 rounded-2xl">
            <label htmlFor="video_url" className="flex items-center gap-1.5 text-xs font-bold text-red-700 uppercase tracking-wider">
              <Youtube className="w-4 h-4 text-red-600" />
              YouTube Video Link (Optional)
            </label>
            <input
              id="video_url"
              type="url"
              value={formData.video_url || ''}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full bg-white border border-red-200 text-sm px-4 py-2.5 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
            />
            <p className="text-[11px] text-red-600/80">
              Add a YouTube video or Shorts link. When added, an interactive video player will open when visitors click this glimpse.
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <ImageUpload
              label="Glimpse Picture (Thumbnail or Full Photo)"
              value={formData.image || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
              category="general"
              accept="image/*"
              previewClassName="h-44"
            />
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label htmlFor="caption" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Detailed Caption description
            </label>
            <textarea
              id="caption"
              rows={3}
              required
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Give a short context explaining the student life preview..."
            />
          </div>

          {/* Hide/Show Website Visibility Toggle */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="is_active" className="text-sm font-bold text-gray-900 flex items-center gap-2 cursor-pointer">
                {formData.is_active !== false ? (
                  <Eye className="w-4 h-4 text-emerald-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-amber-600" />
                )}
                Show on Website
              </label>
              <p className="text-xs text-gray-500">
                {formData.is_active !== false
                  ? 'This glimpse is visible to visitors on the website.'
                  : 'This glimpse is currently hidden from the website.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, is_active: prev.is_active === false }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                formData.is_active !== false ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={formData.is_active !== false}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.is_active !== false ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
              >
                <option value="campus">Campus & Classes</option>
                <option value="hostel">Hostel & Indian Mess</option>
                <option value="arrivals">Student Arrivals</option>
                <option value="training">Clinical Training</option>
              </select>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label htmlFor="country" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Country Location
              </label>
              <input
                id="country"
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. Russia, Georgia"
              />
            </div>

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
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="1"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
            <Link
              href="/admin/glimpses"
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/10 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isNew ? 'Create Glimpse' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
