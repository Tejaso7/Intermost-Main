'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Building,
  Globe,
  MapPin,
  DollarSign,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { collegesApi, countriesApi } from '@/lib/services';
import { College, Country } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Flat form interface for easier form handling
interface CollegeForm {
  name: string;
  slug: string;
  country_id: string;
  location: string;
  established: number;
  world_rank: string;
  description: string;
  tuition_per_year: string;
  hostel_per_year: string;
  total_course_fee: string;
  recognition: string[];
  eligibility_marks: string;
  facilities: string[];
  banner_image: string;
  logo: string;
  is_featured: boolean;
  is_active: boolean;
}

// Helper to convert nested College to flat form
function collegeToForm(college: College): CollegeForm {
  return {
    name: college.name || '',
    slug: college.slug || '',
    country_id: college.country_id || '',
    location: college.overview?.location || '',
    established: college.overview?.established || 1950,
    world_rank: college.rankings?.world_rank?.toString() || '',
    description: college.overview?.description || '',
    tuition_per_year: college.fees?.tuition_per_year || '',
    hostel_per_year: college.fees?.hostel_per_year || '',
    total_course_fee: college.fees?.total_course_fee || '',
    recognition: college.recognition || ['NMC', 'WHO'],
    eligibility_marks: college.eligibility?.minimum_marks || '',
    facilities: college.facilities || [],
    banner_image: college.banner_image || '',
    logo: college.logo || '',
    is_featured: college.meta?.is_featured || false,
    is_active: college.meta?.is_active ?? true,
  };
}

// Helper to convert flat form to nested College structure
function formToCollege(form: CollegeForm): Partial<College> {
  return {
    name: form.name,
    slug: form.slug,
    country_id: form.country_id,
    overview: {
      description: form.description,
      established: form.established,
      type: 'Government',
      location: form.location,
    },
    rankings: {
      world_rank: form.world_rank ? parseInt(form.world_rank) : undefined,
    },
    fees: {
      tuition_per_year: form.tuition_per_year,
      hostel_per_year: form.hostel_per_year,
      total_course_fee: form.total_course_fee,
    },
    eligibility: {
      minimum_marks: form.eligibility_marks,
    },
    recognition: form.recognition,
    facilities: form.facilities,
    banner_image: form.banner_image,
    logo: form.logo,
    meta: {
      is_featured: form.is_featured,
      is_active: form.is_active,
      display_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
}

export default function CollegeFormPage() {
  const router = useRouter();
  const params = useParams();
  const collegeId = params.id as string;
  const isEditing = collegeId && collegeId !== 'new';

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [form, setForm] = useState<CollegeForm>({
    name: '',
    slug: '',
    country_id: '',
    location: '',
    established: new Date().getFullYear() - 50,
    world_rank: '',
    description: '',
    tuition_per_year: '',
    hostel_per_year: '',
    total_course_fee: '',
    recognition: ['NMC', 'WHO'],
    eligibility_marks: '',
    facilities: [],
    banner_image: '',
    logo: '',
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countriesData = await countriesApi.getAll();
        setCountries(Array.isArray(countriesData) ? countriesData : []);

        if (isEditing) {
          const college = await collegesApi.getBySlug(collegeId);
          if (college) {
            setForm(collegeToForm(college));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditing, collegeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const collegeData = formToCollege(form);
      if (isEditing) {
        await collegesApi.update(collegeId, collegeData);
        toast.success('College updated successfully');
      } else {
        await collegesApi.create(collegeData as College);
        toast.success('College created successfully');
      }
      router.push('/admin/colleges');
    } catch (error) {
      console.error('Error saving college:', error);
      toast.error('Failed to save college');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/colleges"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit College' : 'Add New College'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEditing ? 'Update college information' : 'Create a new medical college'}
            </p>
          </div>
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
                <Building className="w-5 h-5 mr-2 text-primary-600" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={generateSlug}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter college name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="college-slug"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter college description"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    name="country_id"
                    value={form.country_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country._id} value={country._id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location/City
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="City name"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                Fees & Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuition Fee (per Year)
                  </label>
                  <input
                    type="text"
                    name="tuition_per_year"
                    value={form.tuition_per_year}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., $5,000 - $7,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hostel Fee (per Year)
                  </label>
                  <input
                    type="text"
                    name="hostel_per_year"
                    value={form.hostel_per_year}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., $1,500 - $2,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Course Fee
                  </label>
                  <input
                    type="text"
                    name="total_course_fee"
                    value={form.total_course_fee}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., $35,000 - $45,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Marks Required
                  </label>
                  <input
                    type="text"
                    name="eligibility_marks"
                    value={form.eligibility_marks}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 50% in PCB"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    name="established"
                    value={form.established}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    World Ranking
                  </label>
                  <input
                    type="text"
                    name="world_rank"
                    value={form.world_rank}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
              <div className="space-y-4">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-primary-600" />
                Images
              </h2>
              <div className="space-y-4">
                <ImageUpload
                  label="Banner Image"
                  value={form.banner_image}
                  onChange={(url) => setForm((prev) => ({ ...prev, banner_image: url }))}
                  category="colleges"
                  previewClassName="h-32"
                />
                <ImageUpload
                  label="Logo"
                  value={form.logo}
                  onChange={(url) => setForm((prev) => ({ ...prev, logo: url }))}
                  category="colleges"
                  previewClassName="h-24"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
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
                  <span>{isEditing ? 'Update College' : 'Create College'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
