'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Newspaper, Calendar } from 'lucide-react';
import { newsApi } from '@/lib/services';
import { News } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

// Form interface matching backend structure
interface NewsForm {
  title: string;
  description: string;
  media_type: 'image' | 'video' | 'marquee';
  media_url: string;
  media_urls: string[];
  location: string;
  date: string;
  badge_text: string;
  badge_color: string;
  link: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
}

export default function NewsFormPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  const isEditing = newsId && newsId !== 'new';

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewsForm>({
    title: '',
    description: '',
    media_type: 'image',
    media_url: '',
    media_urls: [],
    location: '',
    date: new Date().toISOString().split('T')[0],
    badge_text: '',
    badge_color: 'blue',
    link: '',
    is_active: true,
    is_featured: false,
    display_order: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing) {
        try {
          const newsItem = await newsApi.getById(newsId);
          if (newsItem) {
            setForm({
              title: newsItem.title || '',
              description: newsItem.description || '',
              media_type: newsItem.media_type || 'image',
              media_url: newsItem.media_url || '',
              media_urls: newsItem.media_urls || [],
              location: newsItem.location || '',
              date: newsItem.date || new Date().toISOString().split('T')[0],
              badge_text: newsItem.badge_text || '',
              badge_color: newsItem.badge_color || 'blue',
              link: newsItem.link || '',
              is_active: newsItem.is_active ?? true,
              is_featured: newsItem.is_featured ?? false,
              display_order: newsItem.display_order || 0,
            });
          }
        } catch (error) {
          console.error('Error fetching news:', error);
          toast.error('Failed to load news item');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isEditing, newsId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);

    try {
      if (isEditing) {
        await newsApi.update(newsId, form as unknown as News);
        toast.success('News updated successfully');
      } else {
        await newsApi.create(form as unknown as News);
        toast.success('News created successfully');
      }
      router.push('/admin/news');
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Failed to save news');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/news"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit News' : 'Add News'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing ? 'Update news article' : 'Create a new news article'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Newspaper className="w-5 h-5 mr-2 text-primary-600" />
                Article Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter article title"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Agra, India"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Write your article description here..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Media Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Media Type
                  </label>
                  <select
                    name="media_type"
                    value={form.media_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="marquee">Marquee (Multiple Images)</option>
                  </select>
                </div>
                
                {form.media_type === 'video' ? (
                  <ImageUpload
                    value={form.media_url}
                    onChange={(url) => setForm(prev => ({ ...prev, media_url: url }))}
                    category="videos"
                    label="Video"
                    accept="video/*"
                    previewClassName="h-48"
                  />
                ) : (
                  <ImageUpload
                    value={form.media_url}
                    onChange={(url) => setForm(prev => ({ ...prev, media_url: url }))}
                    category="news"
                    label={form.media_type === 'marquee' ? 'Main Image' : 'Image'}
                    previewClassName="h-48"
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    name="badge_text"
                    value={form.badge_text}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 📍 Agra, India"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge Color
                  </label>
                  <select
                    name="badge_color"
                    value={form.badge_color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={form.display_order}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700">Featured</span>
                  </label>
                </div>
              </div>
            </motion.div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEditing ? 'Update News' : 'Create News'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
