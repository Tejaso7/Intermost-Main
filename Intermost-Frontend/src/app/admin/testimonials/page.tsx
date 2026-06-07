'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Users,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { testimonialsApi, countriesApi } from '@/lib/services';
import { Testimonial } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Country {
  _id: string;
  name: string;
  slug: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchData = async () => {
    try {
      const [testimonialsData, countriesData] = await Promise.all([
        testimonialsApi.getAll(),
        countriesApi.getAll(),
      ]);
      setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
      setCountries(Array.isArray(countriesData) ? countriesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.university?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || testimonial.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const paginatedTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await testimonialsApi.delete(id);
      toast.success('Testimonial deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleToggleFeatured = async (testimonial: Testimonial) => {
    try {
      await testimonialsApi.update(testimonial._id, { is_featured: !testimonial.is_featured });
      toast.success('Testimonial updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update testimonial');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 mt-1">Manage student testimonials and reviews</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Testimonial</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country._id} value={country.slug}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative"
          >
            <Quote className="w-8 h-8 text-primary-100 absolute top-4 right-4" />
            
            <div className="flex items-start space-x-4 mb-4">
              {testimonial.photo ? (
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.university}</p>
                <p className="text-xs text-gray-400 capitalize">{testimonial.country} • {testimonial.year || testimonial.batch_year || ''}</p>
              </div>
            </div>

            <div className="flex mb-3">
              {renderStars(testimonial.rating)}
            </div>

            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{testimonial.content || testimonial.quote}</p>

            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {testimonial.is_featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    Featured
                  </span>
                )}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  testimonial.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {testimonial.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleToggleFeatured(testimonial)}
                  className={`p-2 rounded-lg transition-colors ${
                    testimonial.is_featured 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <Link
                  href={`/admin/testimonials/${testimonial._id}`}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {paginatedTestimonials.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
          <p className="text-gray-500 mb-4">Add student testimonials to showcase their success.</p>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Testimonial</span>
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium ${
                page === currentPage
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
