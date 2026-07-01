'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Camera, ChevronLeft, Save, Loader2 } from 'lucide-react';
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
        setFormData(data);
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
    if (!formData.title?.trim() || !formData.image?.trim() || !formData.caption?.trim()) {
      toast.error('Title, Image, and Caption are required');
      return;
    }

    const payload = {
      ...formData,
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
            {isNew ? 'Register a new student life journey picture.' : 'Update details for this glimpse item.'}
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
            <label htmlFor="title" className="block text-xs font-bold text-gray-550 uppercase tracking-wider">
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

          {/* Image */}
          <div className="space-y-1.5">
            <ImageUpload
              label="Glimpse Picture"
              value={formData.image || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
              category="general"
              accept="image/*"
              previewClassName="h-44"
            />
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label htmlFor="caption" className="block text-xs font-bold text-gray-555 uppercase tracking-wider">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-xs font-bold text-gray-555 uppercase tracking-wider">
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
              <label htmlFor="country" className="block text-xs font-bold text-gray-555 uppercase tracking-wider">
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
              <label htmlFor="order" className="block text-xs font-bold text-gray-555 uppercase tracking-wider">
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

          <div className="pt-6 border-t border-gray-150 flex justify-end gap-3">
            <Link
              href="/admin/glimpses"
              className="px-5 py-2.5 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors cursor-pointer"
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
