'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from 'lucide-react';
import { inquiriesApi } from '@/lib/services';
import type { Inquiry } from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  converted: 'bg-purple-100 text-purple-700',
  closed: 'bg-gray-100 text-gray-700',
};

const statusIcons = {
  new: Clock,
  contacted: Phone,
  qualified: CheckCircle,
  converted: Users,
  closed: XCircle,
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const data = await inquiriesApi.getAll(params);
      setInquiries(data.results || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      // Use sample data for demo
      setInquiries([
        {
          _id: '1',
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          phone: '9876543210',
          country_code: '+91',
          interested_country: 'Russia',
          neet_score: 450,
          message: 'I am interested in MBBS in Russia. Please provide more information.',
          source: 'website_contact_form',
          status: 'new',
          notes: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          _id: '2',
          name: 'Priya Patel',
          email: 'priya@example.com',
          phone: '9876543211',
          country_code: '+91',
          interested_country: 'Georgia',
          neet_score: 520,
          message: 'Looking for MBBS options in Georgia.',
          source: 'website_contact_form',
          status: 'contacted',
          notes: [{ text: 'Called and discussed options', created_at: new Date().toISOString() }],
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await inquiriesApi.updateStatus(id, status);
      toast.success('Status updated successfully');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-600">Manage and track lead inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {['all', 'new', 'contacted', 'qualified', 'converted'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'p-4 rounded-xl text-left transition-colors',
              statusFilter === status
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-white border-2 border-transparent hover:border-gray-200'
            )}
          >
            <p className="text-2xl font-bold text-gray-900">
              {status === 'all'
                ? inquiries.length
                : inquiries.filter((i) => i.status === status).length}
            </p>
            <p className="text-sm text-gray-600 capitalize">{status}</p>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner" />
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No inquiries found
            </h3>
            <p className="text-gray-600">
              New inquiries will appear here when submitted through the website.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInquiries.map((inquiry, index) => {
                  const StatusIcon = statusIcons[inquiry.status as keyof typeof statusIcons] || Clock;
                  return (
                    <motion.tr
                      key={inquiry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{inquiry.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {inquiry.email}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {inquiry.country_code} {inquiry.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {inquiry.interested_country && (
                            <p className="font-medium text-gray-900">
                              {inquiry.interested_country}
                            </p>
                          )}
                          {inquiry.neet_score && (
                            <p className="text-sm text-gray-500">
                              NEET: {inquiry.neet_score}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                          className={cn(
                            'px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer',
                            statusColors[inquiry.status as keyof typeof statusColors]
                          )}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(inquiry.created_at)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <a
                            href={`tel:${inquiry.country_code}${inquiry.phone}`}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Call"
                          >
                            <Phone className="w-5 h-5" />
                          </a>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Inquiry Details
                </h2>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium text-gray-900">{selectedInquiry.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium text-gray-900">
                    {selectedInquiry.country_code} {selectedInquiry.phone}
                  </p>
                </div>
                {selectedInquiry.interested_country && (
                  <div>
                    <label className="text-sm text-gray-500">Interested Country</label>
                    <p className="font-medium text-gray-900">
                      {selectedInquiry.interested_country}
                    </p>
                  </div>
                )}
                {selectedInquiry.neet_score && (
                  <div>
                    <label className="text-sm text-gray-500">NEET Score</label>
                    <p className="font-medium text-gray-900">{selectedInquiry.neet_score}</p>
                  </div>
                )}
                {selectedInquiry.message && (
                  <div>
                    <label className="text-sm text-gray-500">Message</label>
                    <p className="text-gray-900">{selectedInquiry.message}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-500">Submitted On</label>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedInquiry.created_at)}
                  </p>
                </div>

                {/* Notes */}
                {selectedInquiry.notes && selectedInquiry.notes.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-500">Notes</label>
                    <div className="mt-2 space-y-2">
                      {selectedInquiry.notes.map((note, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{note.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(note.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="btn-outline"
                >
                  Close
                </button>
                <a
                  href={`tel:${selectedInquiry.country_code}${selectedInquiry.phone}`}
                  className="btn-primary"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
