'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Download,
  Trash2,
  Edit,
  Eye,
  Globe,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { brochuresApi, type Brochure } from '@/lib/services';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';

export default function BrochuresAdminPage() {
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const fetchBrochures = async () => {
    try {
      setLoading(true);
      const data = await brochuresApi.getAll({ is_active: 'all' });
      setBrochures(data);
    } catch (error) {
      toast.error('Failed to load brochures');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrochures();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this brochure/template?')) return;
    try {
      await brochuresApi.delete(id);
      toast.success('Brochure deleted successfully');
      fetchBrochures();
    } catch (error) {
      toast.error('Failed to delete brochure');
      console.error(error);
    }
  };

  const handleToggleActive = async (brochure: Brochure) => {
    try {
      const updated = await brochuresApi.update(brochure._id, {
        is_active: !brochure.is_active,
      });
      toast.success(
        `Brochure ${!brochure.is_active ? 'activated' : 'deactivated'} successfully`
      );
      setBrochures((prev) =>
        prev.map((b) => (b._id === brochure._id ? { ...b, is_active: !b.is_active } : b))
      );
    } catch (error) {
      toast.error('Failed to update brochure status');
      console.error(error);
    }
  };

  const filteredBrochures = brochures.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || b.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prospectus & Brochures</h1>
            <p className="text-sm text-gray-500">
              Manage study brochures, country admission guides, and templates for students to download.
            </p>
          </div>
          <Link
            href="/admin/brochures/new"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-500/15 transition-all transform hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Add Brochure
          </Link>
        </div>

        {/* Filter controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">All Types</option>
              <option value="brochure">Brochure</option>
              <option value="prospectus">Prospectus</option>
              <option value="template">Template</option>
            </select>
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-500">Loading brochures database...</p>
          </div>
        ) : filteredBrochures.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-150">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Brochures Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              {searchTerm || selectedType !== 'all'
                ? 'No documents match your filter queries. Try adjusting your search keywords.'
                : 'Upload prospectus materials and guides so your prospective students can download them from the frontpage.'}
            </p>
            {!searchTerm && selectedType === 'all' && (
              <Link
                href="/admin/brochures/new"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                Upload Your First Document
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBrochures.map((brochure) => (
                <motion.div
                  key={brochure._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                >
                  <div className="p-6 flex-1 space-y-4">
                    {/* Top Row: Type tag & Status */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary-50 text-primary-600 border border-primary-100">
                        {brochure.type}
                      </span>
                      <button
                        onClick={() => handleToggleActive(brochure)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          brochure.is_active
                            ? 'bg-green-50 text-green-700 border border-green-150'
                            : 'bg-red-50 text-red-700 border border-red-150'
                        }`}
                      >
                        {brochure.is_active ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Hidden
                          </>
                        )}
                      </button>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-snug">
                        {brochure.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span>{brochure.country}</span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                      <div className="text-center bg-gray-50 rounded-xl py-2 px-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Downloads</p>
                        <p className="text-lg font-bold text-gray-800 mt-0.5">
                          {brochure.downloads_count}
                        </p>
                      </div>
                      <div className="text-center bg-gray-50 rounded-xl py-2 px-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Format</p>
                        <p className="text-xs font-extrabold text-gray-700 mt-1 uppercase">
                          {brochure.file_url.split('.').pop() || 'PDF'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <a
                      href={brochure.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Doc
                    </a>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/brochures/${brochure._id}`}
                        className="p-2 bg-white hover:bg-gray-100 text-gray-600 hover:text-primary border border-gray-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(brochure._id)}
                        className="p-2 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
