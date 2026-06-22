'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, MapPin, Building, Globe } from 'lucide-react';
import { teamApi } from '@/lib/services';
import { Office } from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function OfficesPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      setLoading(true);
      const data = await teamApi.getOffices();
      setOffices(data);
    } catch (error) {
      toast.error('Failed to fetch offices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (office: Office) => {
    try {
      await teamApi.updateOffice(office._id, {
        is_active: !office.is_active,
      });
      toast.success(`Office ${office.is_active ? 'deactivated' : 'activated'}`);
      fetchOffices();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteDialog({ isOpen: true, id, title: name });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await teamApi.deleteOffice(deleteDialog.id);
      toast.success('Office deleted successfully');
      setDeleteDialog({ isOpen: false, id: '', title: '' });
      fetchOffices();
    } catch (error) {
      toast.error('Failed to delete office');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOffices = offices.filter(office =>
    office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Offices</h1>
          <p className="text-gray-500 mt-1">Manage global office locations</p>
        </div>
        <Link
          href="/admin/offices/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Office
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search offices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Offices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOffices.map((office) => (
          <motion.div
            key={office._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {office.name}
                    {office.is_head_office && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        Head Office
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    {office.company_name}
                  </p>
                </div>
                <div className="flex space-x-2 shrink-0">
                  <Link
                    href={`/admin/offices/${office._id}`}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(office._id, office.name)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 pt-4 border-t border-gray-50">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{office.address}, {office.city}, {office.state} {office.pincode}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>{office.country}</span>
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <div className="text-sm font-medium text-gray-500">
                Order: {office.display_order}
              </div>
              <button
                onClick={() => handleToggleActive(office)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                  office.is_active
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                )}
              >
                {office.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOffices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No offices found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or add a new office.</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Office"
        message={`Are you sure you want to delete "${deleteDialog.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: '', title: '' })}
        isLoading={isDeleting}
      />
    </div>
  );
}
