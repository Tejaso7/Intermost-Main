'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  GripVertical,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { countriesApi } from '@/lib/services';

const countrySchema = z.object({
  name: z.string().min(2, 'Country name is required'),
  slug: z.string().min(2, 'Slug is required'),
  code: z.string().min(2, 'Country code is required').max(3),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  flag_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  hero_image: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  
  // Quick Info
  course_duration: z.string().min(1, 'Course duration is required'),
  medium_of_teaching: z.string().min(1, 'Medium of teaching is required'),
  recognition: z.string().min(1, 'Recognition details are required'),
  intake: z.string().min(1, 'Intake information is required'),
  
  // Pricing
  tuition_fee_range: z.object({
    min: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
    currency: z.string().default('USD'),
  }),
  total_cost_approx: z.coerce.number().min(0),
  
  // Features
  highlights: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    icon: z.string().optional(),
  })).optional(),
  
  // FAQs
  faqs: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).optional(),
  
  // SEO
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.array(z.string()).optional(),
  
  // Status
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

type CountryFormData = z.infer<typeof countrySchema>;

export default function NewCountryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CountryFormData>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      is_active: true,
      is_featured: false,
      order: 0,
      tuition_fee_range: {
        min: 0,
        max: 0,
        currency: 'USD',
      },
      highlights: [],
      faqs: [],
      seo_keywords: [],
    },
  });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: 'highlights',
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: 'faqs',
  });

  // Auto-generate slug from name
  const name = watch('name');
  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [name, setValue]);

  const onSubmit = async (data: CountryFormData) => {
    setIsSubmitting(true);
    try {
      // Map form data to backend schema structure
      const countryData = {
        name: data.name,
        slug: data.slug,
        code: data.code,
        flag_url: data.flag_url || '',
        hero_image: data.hero_image || '',
        hero_video: '',
        banner_image: '',
        seo: {
          title: data.seo_title || `MBBS in ${data.name} - Admission, Fees, Top Universities`,
          description: data.seo_description || data.description.substring(0, 160),
          keywords: data.seo_keywords || [],
        },
        overview: {
          title: `Why Study MBBS in ${data.name}?`,
          description: data.description,
          highlights: data.highlights || [],
        },
        pricing: {
          tuition_fee: data.tuition_fee_range 
            ? `$${data.tuition_fee_range.min.toLocaleString()}-${data.tuition_fee_range.max.toLocaleString()}/year`
            : '',
          hostel_fee: '',
          living_cost: '',
          total_course_fee: data.total_cost_approx 
            ? `₹${(data.total_cost_approx / 100000).toFixed(1)} Lakhs (approx)`
            : '',
          currency: data.tuition_fee_range?.currency || 'USD',
        },
        eligibility: {
          academic: '10+2 with Physics, Chemistry, Biology',
          minimum_marks: '50% marks in PCB',
          neet_required: true,
          age_requirement: 'Minimum 17 years by December 31st',
          other_requirements: [],
        },
        course_details: {
          duration: data.course_duration,
          medium: data.medium_of_teaching,
          degree_awarded: 'MD (equivalent to MBBS)',
          recognition: data.recognition ? data.recognition.split(',').map(r => r.trim()) : [],
          intake: data.intake,
        },
        features: data.highlights?.map(h => ({
          icon: h.icon || '',
          title: h.title,
          description: h.description || '',
        })) || [],
        advantages: [],
        faqs: data.faqs || [],
        gallery: [],
        meta: {
          display_order: data.order,
          is_active: data.is_active,
          is_featured: data.is_featured,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };

      await countriesApi.create(countryData as any);
      toast.success('Country created successfully!');
      router.push('/admin/countries');
    } catch (error: any) {
      console.error('Error creating country:', error);
      toast.error(error.response?.data?.error || 'Failed to create country. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/countries"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Country</h1>
              <p className="text-gray-500">Create a new country for MBBS abroad</p>
            </div>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Country
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Russia"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  {...register('slug')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                  placeholder="russia"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country Code *
                </label>
                <input
                  {...register('code')}
                  type="text"
                  maxLength={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                  placeholder="RU"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  {...register('order')}
                  type="number"
                  min={0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline *
                </label>
                <input
                  {...register('tagline')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., World-class medical education at affordable costs"
                />
                {errors.tagline && (
                  <p className="mt-1 text-sm text-red-500">{errors.tagline.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Detailed description about studying MBBS in this country..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Images</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flag URL
                </label>
                <input
                  {...register('flag_url')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use a CDN or Cloudinary URL for best performance
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image URL
                </label>
                <input
                  {...register('hero_image')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Recommended size: 1920x1080px
                </p>
              </div>
            </div>
          </section>

          {/* Course Details */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Course Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Duration *
                </label>
                <input
                  {...register('course_duration')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 6 Years"
                />
                {errors.course_duration && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.course_duration.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medium of Teaching *
                </label>
                <input
                  {...register('medium_of_teaching')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., English"
                />
                {errors.medium_of_teaching && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.medium_of_teaching.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recognition *
                </label>
                <input
                  {...register('recognition')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., WHO, NMC, UNESCO"
                />
                {errors.recognition && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.recognition.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intake *
                </label>
                <input
                  {...register('intake')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., September"
                />
                {errors.intake && (
                  <p className="mt-1 text-sm text-red-500">{errors.intake.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuition Min (per year)
                </label>
                <input
                  {...register('tuition_fee_range.min')}
                  type="number"
                  min={0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="3000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuition Max (per year)
                </label>
                <input
                  {...register('tuition_fee_range.max')}
                  type="number"
                  min={0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="6000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  {...register('tuition_fee_range.currency')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Cost (approx, in lakhs)
                </label>
                <input
                  {...register('total_cost_approx')}
                  type="number"
                  min={0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="25"
                />
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Highlights</h2>
              <button
                type="button"
                onClick={() => appendHighlight({ title: '', description: '', icon: '' })}
                className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Highlight
              </button>
            </div>
            <div className="space-y-4">
              {highlightFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                    <input
                      {...register(`highlights.${index}.title`)}
                      type="text"
                      placeholder="Title"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      {...register(`highlights.${index}.description`)}
                      type="text"
                      placeholder="Description (optional)"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      {...register(`highlights.${index}.icon`)}
                      type="text"
                      placeholder="Icon name (optional)"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {highlightFields.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No highlights added yet
                </p>
              )}
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
              <button
                type="button"
                onClick={() => appendFaq({ question: '', answer: '' })}
                className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {faqFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-gray-50 rounded-lg space-y-3"
                >
                  <div className="flex gap-4">
                    <input
                      {...register(`faqs.${index}.question`)}
                      type="text"
                      placeholder="Question"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <textarea
                    {...register(`faqs.${index}.answer`)}
                    rows={2}
                    placeholder="Answer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ))}
              {faqFields.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No FAQs added yet
                </p>
              )}
            </div>
          </section>

          {/* SEO */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              SEO Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  {...register('seo_title')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., MBBS in Russia 2024 - Top Universities, Fees, Admission"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  {...register('seo_description')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Meta description for search engines..."
                />
              </div>
            </div>
          </section>

          {/* Status */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Status</h2>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('is_active')}
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">Active (visible on website)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('is_featured')}
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">Featured (show on homepage)</span>
              </label>
            </div>
          </section>

          {/* Submit Button (Mobile) */}
          <div className="flex justify-end gap-4 md:hidden">
            <Link
              href="/admin/countries"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Country
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
