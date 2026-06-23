'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Facebook,
  Instagram,
  Youtube,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { coreApi } from '@/lib/services';
import toast from 'react-hot-toast';

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_phone_alt: string;
  whatsapp_number: string;
  address: string;
  google_maps_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
  linkedin_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  google_analytics_id: string;
  facebook_pixel_id: string;
  stats: {
    students_placed: number | '';
    partner_universities: number | '';
    years_experience: number | '';
    visa_success_rate: number | '';
  };
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingEnv, setSavingEnv] = useState(false);
  const [activeTab, setActiveTab] = useState<'website' | 'env'>('website');
  const [envContent, setEnvContent] = useState('');
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Intermost Study Abroad',
    site_description: 'Your Gateway to Global Medical Education',
    contact_email: 'admissionintermost@gmail.com',
    contact_phone: '+91 9876543210',
    contact_phone_alt: '',
    whatsapp_number: '+919876543210',
    address: 'Mumbai, Maharashtra, India',
    google_maps_url: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    twitter_url: '',
    linkedin_url: '',
    meta_title: 'Intermost Study Abroad - MBBS Overseas Education',
    meta_description: 'Get guaranteed MBBS admission in WHO & NMC approved medical universities abroad.',
    meta_keywords: 'MBBS abroad, study medicine abroad, medical universities',
    google_analytics_id: '',
    facebook_pixel_id: '',
    stats: {
      students_placed: 5500,
      partner_universities: 35,
      years_experience: 21,
      visa_success_rate: 99,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await coreApi.getSettings();
        if (data) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.debug('Using default settings');
      }

      try {
        const envData = await coreApi.getEnv();
        if (envData && envData.content) {
          setEnvContent(envData.content);
        }
      } catch (error) {
        console.debug('No .env content found or unauthorised');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('stats.')) {
      const statField = name.split('.')[1];
      let parsedValue: number | '' = '';
      if (value !== '') {
        const parsed = parseInt(value, 10);
        parsedValue = isNaN(parsed) ? 0 : Math.max(0, parsed);
        
        if (statField === 'visa_success_rate') {
          parsedValue = Math.min(100, parsedValue);
        }
      }
      setSettings(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statField]: parsedValue
        }
      }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Ensure empty stats fallback to 0 before saving
    const payloadToSave = {
      ...settings,
      stats: {
        students_placed: settings.stats?.students_placed || 0,
        partner_universities: settings.stats?.partner_universities || 0,
        years_experience: settings.stats?.years_experience || 0,
        visa_success_rate: settings.stats?.visa_success_rate || 0,
      }
    };

    try {
      await coreApi.updateSettings(payloadToSave);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEnv = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEnv(true);

    try {
      await coreApi.updateEnv(envContent);
      toast.success('Environment variables saved! Server reloading.');
    } catch (error) {
      console.error('Error saving environment config:', error);
      toast.error('Failed to save environment variables');
    } finally {
      setSavingEnv(false);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your website settings and system configurations</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('website')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'website'
              ? 'border-primary-600 text-primary-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Website Settings
        </button>
        <button
          onClick={() => setActiveTab('env')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'env'
              ? 'border-primary-600 text-primary-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          System Config (.env)
        </button>
      </div>

      {activeTab === 'website' ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-primary-600" />
                General Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="site_name"
                    value={settings.site_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Description
                  </label>
                  <textarea
                    name="site_description"
                    value={settings.site_description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={settings.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="contact_phone"
                      value={settings.contact_phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alt Phone
                    </label>
                    <input
                      type="text"
                      name="contact_phone_alt"
                      value={settings.contact_phone_alt}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp_number"
                    value={settings.whatsapp_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+919058501818"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary-600" />
                Social Media
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Facebook className="w-4 h-4 mr-1 text-blue-600" /> Facebook
                  </label>
                  <input
                    type="url"
                    name="facebook_url"
                    value={settings.facebook_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Instagram className="w-4 h-4 mr-1 text-pink-600" /> Instagram
                  </label>
                  <input
                    type="url"
                    name="instagram_url"
                    value={settings.instagram_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Youtube className="w-4 h-4 mr-1 text-red-600" /> YouTube
                  </label>
                  <input
                    type="url"
                    name="youtube_url"
                    value={settings.youtube_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={settings.linkedin_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>
            </motion.div>

            {/* SEO Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary-600" />
                SEO & Analytics
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="meta_title"
                    value={settings.meta_title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    name="meta_description"
                    value={settings.meta_description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    name="meta_keywords"
                    value={settings.meta_keywords}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    name="google_analytics_id"
                    value={settings.google_analytics_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    name="facebook_pixel_id"
                    value={settings.facebook_pixel_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="XXXXXXXXXXXXXXX"
                  />
                </div>
              </div>
            </motion.div>

            {/* KPI Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-primary-600" />
                KPI Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Students Placed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    name="stats.students_placed"
                    value={settings.stats?.students_placed ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner Colleges <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    name="stats.partner_universities"
                    value={settings.stats?.partner_universities ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    name="stats.years_experience"
                    value={settings.stats?.years_experience ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visa Success (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    name="stats.visa_success_rate"
                    value={settings.stats?.visa_success_rate ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      ) : (
        <form onSubmit={handleSaveEnv} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sliders className="w-5 h-5 mr-2 text-primary-600" />
              System Environment Configurator (.env)
            </h2>
            
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg text-amber-800 text-sm flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-1">Caution: Core Settings</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Modifying variables here directly alters your API keys, credentials, and settings on disk.</li>
                  <li>Ensure there are no spaces around equal signs (e.g. <code>KEY=VALUE</code>).</li>
                  <li>Saving will write to `/app/.env` and trigger a graceful Gunicorn configuration reload.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <textarea
                name="envContent"
                value={envContent}
                onChange={(e) => setEnvContent(e.target.value)}
                rows={22}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm leading-relaxed bg-gray-950 text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-y"
                placeholder="# Enter environment variables here..."
                spellCheck={false}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              type="submit"
              disabled={savingEnv}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
            >
              {savingEnv ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save & Apply Configuration</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      )}
    </div>
  );
}

