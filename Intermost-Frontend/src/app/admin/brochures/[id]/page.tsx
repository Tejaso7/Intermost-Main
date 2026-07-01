'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Save,
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  FileDown,
} from 'lucide-react';
import { brochuresApi, countriesApi, uploadsApi, type Brochure } from '@/lib/services';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';

export default function BrochureFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  
  const [form, setForm] = useState({
    title: '',
    file_url: '',
    country: 'General',
    type: 'brochure', // brochure, prospectus, template
    is_active: true,
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch countries and brochure if editing
  useEffect(() => {
    const initPage = async () => {
      try {
        // Fetch countries list
        const countriesData = await countriesApi.getAll({ is_active: 'all' });
        const names = countriesData.map((c: any) => c.name);
        setCountries(['General', ...names]);

        if (!isNew) {
          const brochure = await brochuresApi.getById(id);
          setForm({
            title: brochure.title,
            file_url: brochure.file_url,
            country: brochure.country || 'General',
            type: brochure.type || 'brochure',
            is_active: brochure.is_active,
          });
        }
      } catch (error) {
        toast.error('Failed to load page data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [id, isNew]);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 30MB)
    if (file.size > 30 * 1024 * 1024) {
      toast.error('File exceeds 30MB size limit');
      return;
    }

    try {
      setUploading(true);
      const res = await uploadsApi.uploadFile(file, 'general');
      const uploadedUrl = res.files[0]?.url;
      
      if (uploadedUrl) {
        setForm((prev) => ({ ...prev, file_url: uploadedUrl }));
        toast.success('Document uploaded successfully');
      } else {
        toast.error('Failed to get upload file path');
      }
    } catch (error) {
      toast.error('Upload failed. Ensure format is PDF, DOC, or DOCX');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Please enter a document title');
      return;
    }
    if (!form.file_url) {
      toast.error('Please upload a document file or enter a valid URL');
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        await brochuresApi.create(form);
        toast.success('Brochure created successfully');
      } else {
        await brochuresApi.update(id, form);
        toast.success('Brochure updated successfully');
      }
      router.push('/admin/brochures');
    } catch (error) {
      toast.error('Failed to save document details');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-500">Loading form details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/brochures"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to brochures list
      </Link>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Upload New Brochure / Prospectus' : 'Edit Brochure Details'}
        </h1>
        <p className="text-sm text-gray-500">
          {isNew
            ? 'Add a new PDF brochure or college prospectus to the system.'
            : 'Modify titles, categories, and update files for existing materials.'}
        </p>
      </div>

      {/* Form panel */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Title */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Document Title</label>
            <input
              type="text"
              placeholder="e.g. Russia MBBS Official Brochure 2026"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-sm text-gray-900"
            />
          </div>

          {/* Document Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-sm text-gray-900"
            >
              <option value="brochure">Brochure</option>
              <option value="prospectus">Prospectus</option>
              <option value="template">Template / Form</option>
            </select>
          </div>

          {/* Target Country */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Destination / Country</label>
            <select
              value={form.country}
              onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-sm text-gray-900"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Document File Uploader */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Document File (.pdf, .doc, .docx)</label>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-primary rounded-2xl p-6 bg-gray-50/50 hover:bg-gray-50/10 transition-all cursor-pointer relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadFile}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              
              {uploading ? (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                  <p className="text-xs text-gray-500">Uploading document to server...</p>
                </div>
              ) : form.file_url ? (
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2 border border-green-100">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-800 line-clamp-1 max-w-sm">
                    {form.file_url.split('/').pop()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    File saved locally in public media storage.
                  </p>
                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-lg text-gray-600 transition-colors shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Replace File
                    </button>
                    <a
                      href={form.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-lg text-gray-600 transition-colors shadow-sm"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Download test
                    </a>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center py-6 text-center"
                >
                  <div className="w-12 h-12 bg-white text-gray-400 group-hover:text-primary rounded-xl flex items-center justify-center mb-3 shadow-sm border border-gray-200 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    Click to choose document file to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports PDF, DOC, DOCX formats (Max 30MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Direct URL input fallback */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Direct URL Override (Optional)</label>
            <input
              type="text"
              placeholder="Or paste direct download URL path..."
              value={form.file_url}
              onChange={(e) => setForm((prev) => ({ ...prev, file_url: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-sm text-gray-900"
            />
          </div>

          {/* Active Status */}
          <div className="md:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-150">
            <div>
              <p className="text-sm font-bold text-gray-800">Publish Document</p>
              <p className="text-xs text-gray-500 mt-0.5">
                If deactivated, this document will not be visible for student downloads.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
              className={`w-12 h-6 rounded-full p-1 transition-colors outline-none focus:ring-2 focus:ring-primary/20 ${
                form.is_active ? 'bg-primary flex justify-end' : 'bg-gray-300 flex justify-start'
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>

        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <Link
            href="/admin/brochures"
            className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-650 font-semibold text-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-500/10 transition-colors text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Document
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
