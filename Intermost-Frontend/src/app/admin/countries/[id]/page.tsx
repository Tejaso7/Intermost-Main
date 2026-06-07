'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Globe,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { countriesApi } from '@/lib/services';

interface CountryForm {
  name: string;
  slug: string;
  code: string;
  flag_url: string;
  hero_video: string;
  hero_image: string;
  banner_image: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  overview: {
    title: string;
    description: string;
    highlights: Array<{ icon: string; title: string; description: string }>;
  };
  pricing: {
    tuition_fee: string;
    hostel_fee: string;
    living_cost: string;
    total_course_fee: string;
    currency: string;
  };
  eligibility: {
    academic: string;
    minimum_marks: string;
    neet_required: boolean;
    age_requirement: string;
    other_requirements: string[];
  };
  course_details: {
    duration: string;
    medium: string;
    degree_awarded: string;
    recognition: string[];
  };
  features: Array<{ icon: string; title: string; description: string }>;
  advantages: string[];
  faqs: Array<{ question: string; answer: string }>;
  meta: {
    display_order: number;
    is_active: boolean;
    is_featured: boolean;
  };
}

const defaultForm: CountryForm = {
  name: '',
  slug: '',
  code: '',
  flag_url: '',
  hero_video: '',
  hero_image: '',
  banner_image: '',
  seo: { title: '', description: '', keywords: [] },
  overview: { title: '', description: '', highlights: [] },
  pricing: {
    tuition_fee: '',
    hostel_fee: '',
    living_cost: '',
    total_course_fee: '',
    currency: 'USD',
  },
  eligibility: {
    academic: '10+2 with Physics, Chemistry, Biology',
    minimum_marks: '50% marks in PCB',
    neet_required: true,
    age_requirement: 'Minimum 17 years by December 31st',
    other_requirements: [],
  },
  course_details: {
    duration: '6 Years',
    medium: 'English',
    degree_awarded: 'MD (equivalent to MBBS)',
    recognition: ['NMC', 'WHO'],
  },
  features: [],
  advantages: [],
  faqs: [],
  meta: { display_order: 0, is_active: true, is_featured: false },
};

export default function EditCountryPage() {
  const router = useRouter();
  const params = useParams();
  const countryId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CountryForm>(defaultForm);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const country = await countriesApi.getById(countryId);
        
        // Map backend data to form structure
        setForm({
          name: country.name || '',
          slug: country.slug || '',
          code: country.code || '',
          flag_url: country.flag_url || '',
          hero_video: country.hero_video || '',
          hero_image: country.hero_image || '',
          banner_image: country.banner_image || '',
          seo: {
            title: country.seo?.title || '',
            description: country.seo?.description || '',
            keywords: country.seo?.keywords || [],
          },
          overview: {
            title: country.overview?.title || '',
            description: country.overview?.description || '',
            highlights: country.overview?.highlights || [],
          },
          pricing: {
            tuition_fee: country.pricing?.tuition_fee || '',
            hostel_fee: country.pricing?.hostel_fee || '',
            living_cost: country.pricing?.living_cost || '',
            total_course_fee: country.pricing?.total_course_fee || '',
            currency: country.pricing?.currency || 'USD',
          },
          eligibility: {
            academic: country.eligibility?.academic || '',
            minimum_marks: country.eligibility?.minimum_marks || '',
            neet_required: country.eligibility?.neet_required ?? true,
            age_requirement: country.eligibility?.age_requirement || '',
            other_requirements: country.eligibility?.other_requirements || [],
          },
          course_details: {
            duration: country.course_details?.duration || '',
            medium: country.course_details?.medium || '',
            degree_awarded: country.course_details?.degree_awarded || '',
            recognition: country.course_details?.recognition || [],
          },
          features: country.features || [],
          advantages: country.advantages || [],
          faqs: country.faqs || [],
          meta: {
            display_order: country.meta?.display_order || 0,
            is_active: country.meta?.is_active ?? true,
            is_featured: country.meta?.is_featured ?? false,
          },
        });
      } catch (error) {
        console.error('Error fetching country:', error);
        toast.error('Failed to load country');
        router.push('/admin/countries');
      } finally {
        setIsLoading(false);
      }
    };

    if (countryId) {
      fetchCountry();
    }
  }, [countryId, router]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      // Handle nested fields
      const newForm = { ...prev };
      let current: any = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newForm;
    });
  };

  const addFaq = () => {
    setForm(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const removeFaq = (index: number) => {
    setForm(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name) {
      toast.error('Country name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await countriesApi.update(countryId, form as any);
      toast.success('Country updated successfully!');
      router.push('/admin/countries');
    } catch (error: any) {
      console.error('Error updating country:', error);
      toast.error(error.response?.data?.error || 'Failed to update country');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/countries"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Edit Country</h1>
              <p className="text-sm text-gray-500">{form.name || 'Editing country'}</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Save Changes</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => handleChange('code', e.target.value.toLowerCase())}
                  maxLength={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.meta.display_order}
                  onChange={(e) => handleChange('meta.display_order', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min={0}
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary-600" />
              Images & Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flag URL
                </label>
                <input
                  type="url"
                  value={form.flag_url}
                  onChange={(e) => handleChange('flag_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://flagcdn.com/w40/xx.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.meta.display_order}
                  onChange={(e) => handleChange('meta.display_order', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min={0}
                />
              </div>
              <ImageUpload
                label="Hero Image"
                value={form.hero_image}
                onChange={(url) => handleChange('hero_image', url)}
                category="countries"
                previewClassName="h-32"
              />
              <ImageUpload
                label="Banner Image"
                value={form.banner_image}
                onChange={(url) => handleChange('banner_image', url)}
                category="countries"
                previewClassName="h-32"
              />
              <div className="md:col-span-2">
                <ImageUpload
                  label="Hero Video"
                  value={form.hero_video}
                  onChange={(url) => handleChange('hero_video', url)}
                  category="videos"
                  accept="video/*"
                  previewClassName="h-40"
                />
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overview Title
                </label>
                <input
                  type="text"
                  value={form.overview.title}
                  onChange={(e) => handleChange('overview.title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.overview.description}
                  onChange={(e) => handleChange('overview.description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* Course Details */}
          <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={form.course_details.duration}
                  onChange={(e) => handleChange('course_details.duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medium
                </label>
                <input
                  type="text"
                  value={form.course_details.medium}
                  onChange={(e) => handleChange('course_details.medium', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree Awarded
                </label>
                <input
                  type="text"
                  value={form.course_details.degree_awarded}
                  onChange={(e) => handleChange('course_details.degree_awarded', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recognition
                </label>
                <input
                  type="text"
                  value={form.course_details.recognition.join(', ')}
                  onChange={(e) => handleChange('course_details.recognition', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tuition Fee (per year)
                </label>
                <input
                  type="text"
                  value={form.pricing.tuition_fee}
                  onChange={(e) => handleChange('pricing.tuition_fee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hostel Fee (per year)
                </label>
                <input
                  type="text"
                  value={form.pricing.hostel_fee}
                  onChange={(e) => handleChange('pricing.hostel_fee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Living Cost (per month)
                </label>
                <input
                  type="text"
                  value={form.pricing.living_cost}
                  onChange={(e) => handleChange('pricing.living_cost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Course Fee
                </label>
                <input
                  type="text"
                  value={form.pricing.total_course_fee}
                  onChange={(e) => handleChange('pricing.total_course_fee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={form.pricing.currency}
                  onChange={(e) => handleChange('pricing.currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Eligibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Requirement
                </label>
                <input
                  type="text"
                  value={form.eligibility.academic}
                  onChange={(e) => handleChange('eligibility.academic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Marks
                </label>
                <input
                  type="text"
                  value={form.eligibility.minimum_marks}
                  onChange={(e) => handleChange('eligibility.minimum_marks', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Requirement
                </label>
                <input
                  type="text"
                  value={form.eligibility.age_requirement}
                  onChange={(e) => handleChange('eligibility.age_requirement', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.eligibility.neet_required}
                    onChange={(e) => handleChange('eligibility.neet_required', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-gray-700">NEET Required</span>
                </label>
              </div>
            </div>
          </section>

          {/* SEO */}
          <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={form.seo.title}
                  onChange={(e) => handleChange('seo.title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Description
                </label>
                <textarea
                  value={form.seo.description}
                  onChange={(e) => handleChange('seo.description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={form.seo.keywords.join(', ')}
                  onChange={(e) => handleChange('seo.keywords', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="w-4 h-4" />
                Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {form.faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...form.faqs];
                        newFaqs[index].question = e.target.value;
                        setForm(prev => ({ ...prev, faqs: newFaqs }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Question"
                    />
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...form.faqs];
                      newFaqs[index].answer = e.target.value;
                      setForm(prev => ({ ...prev, faqs: newFaqs }));
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Answer"
                  />
                </div>
              ))}
              {form.faqs.length === 0 && (
                <p className="text-gray-500 text-center py-4">No FAQs added yet</p>
              )}
            </div>
          </section>

          {/* Status */}
          <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.meta.is_active}
                  onChange={(e) => handleChange('meta.is_active', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600"
                />
                <span className="text-gray-700">Active (visible on website)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.meta.is_featured}
                  onChange={(e) => handleChange('meta.is_featured', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600"
                />
                <span className="text-gray-700">Featured (show on homepage)</span>
              </label>
            </div>
          </section>

          {/* Submit Button (Mobile) */}
          <div className="flex justify-end gap-4 sm:hidden">
            <Link
              href="/admin/countries"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save
            </button>
          </div>
        </form>
    </div>
  );
}
