'use client';
 
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Building, MapPin, Phone, Mail, Globe, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { teamApi } from '@/lib/services';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

interface OfficeFormData {
  name: string;
  company_name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
  image_url: string;
  is_head_office: boolean;
  is_active: boolean;
  display_order: number;
}

const defaultFormData: OfficeFormData = {
  name: '',
  company_name: 'INTERMOST VENTURES LLP',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  phone: '',
  email: 'admissionintermost@gmail.com',
  image_url: '',
  is_head_office: false,
  is_active: true,
  display_order: 0,
};

export default function OfficeEditPage() {
  const router = useRouter();
  const params = useParams();
  const officeId = params.id as string;
  const isNew = officeId === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<OfficeFormData>(defaultFormData);

  useEffect(() => {
    if (!isNew) {
      fetchOffice();
    }
  }, [officeId]);

  const fetchOffice = async () => {
    try {
      const data = await teamApi.getOfficeById(officeId);
      if (data) {
        setFormData({
          name: data.name || '',
          company_name: data.company_name || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          pincode: data.pincode || '',
          phone: data.phone || '',
          email: data.email || '',
          image_url: data.image_url || '',
          is_head_office: data.is_head_office || false,
          is_active: data.is_active ?? true,
          display_order: data.display_order || 0,
        });
      }
    } catch (error) {
      toast.error('Failed to fetch office details');
      router.push('/admin/offices');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: url
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isNew) {
        await teamApi.createOffice(formData);
        toast.success('Office created successfully');
      } else {
        await teamApi.updateOffice(officeId, formData);
        toast.success('Office updated successfully');
      }
      router.push('/admin/offices');
      router.refresh();
    } catch (error) {
      toast.error('Failed to save office');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/offices"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {isNew ? 'Add New Office' : 'Edit Office'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isNew ? 'Create a new global office location' : 'Update office details'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building className="w-5 h-5 mr-2 text-primary-600" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. India Head Office"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                required
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Office Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-primary-600" />
            Office Photo
          </h2>
          <div>
            <ImageUpload
              value={formData.image_url}
              onChange={handleImageChange}
              category="general"
              label="Upload Office Building or Branch Photo"
              className="max-w-xl"
            />
          </div>
        </motion.div>

        {/* Location Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary-600" />
            Location Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal/Zip Code
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-primary-600" />
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Phone className="w-4 h-4 mr-1 text-gray-400" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Mail className="w-4 h-4 mr-1 text-gray-400" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="is_active" className="ml-3 block text-sm font-medium text-gray-900">
                Active Status
                <p className="text-xs text-gray-500 font-normal mt-0.5">Visible on website</p>
              </label>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="is_head_office"
                name="is_head_office"
                checked={formData.is_head_office}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_head_office" className="ml-3 block text-sm font-medium text-gray-900">
                Head Office
                <p className="text-xs text-gray-500 font-normal mt-0.5">Mark as primary location</p>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                name="display_order"
                min="0"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Link
            href="/admin/offices"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 font-medium"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {isNew ? 'Create Office' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
