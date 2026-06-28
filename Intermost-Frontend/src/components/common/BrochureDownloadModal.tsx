'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Download,
  Loader2,
  Phone,
  Mail,
  User,
  Globe,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { brochuresApi, inquiriesApi, type Brochure } from '@/lib/services';
import { toast } from 'react-hot-toast';

interface BrochureDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryName?: string; // Optional, to prioritize brochures for this country
}

export default function BrochureDownloadModal({
  isOpen,
  onClose,
  countryName,
}: BrochureDownloadModalProps) {
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrochure, setSelectedBrochure] = useState<Brochure | null>(null);
  
  // Lead Form state
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: countryName || 'General',
  });
  const [submitting, setSubmitting] = useState(false);
  const [isPreAuthorized, setIsPreAuthorized] = useState(false);

  // Check if lead info is already stored in local storage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('intermost_lead_details');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLeadForm({
            name: parsed.name || '',
            email: parsed.email || '',
            phone: parsed.phone || '',
            country: countryName || parsed.country || 'General',
          });
          setIsPreAuthorized(true);
        } catch (e) {
          console.error(e);
        }
      }
      fetchActiveBrochures();
    }
  }, [isOpen, countryName]);

  const fetchActiveBrochures = async () => {
    try {
      setLoading(true);
      const data = await brochuresApi.getAll({ is_active: 'true' });
      setBrochures(data);
      
      // Auto-select prospectus for current country if available
      if (countryName) {
        const matching = data.find(
          (b) => b.country.toLowerCase() === countryName.toLowerCase()
        );
        if (matching) {
          setSelectedBrochure(matching);
        } else {
          // Fallback to first available general or any brochure
          const general = data.find((b) => b.country.toLowerCase() === 'general') || data[0];
          setSelectedBrochure(general || null);
        }
      } else {
        setSelectedBrochure(data[0] || null);
      }
    } catch (error) {
      console.error('Failed to fetch brochures:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeDownload = async (brochure: Brochure) => {
    try {
      // Increment count on backend
      await brochuresApi.incrementDownload(brochure._id);
      
      // Trigger browser download
      const link = document.createElement('a');
      link.href = brochure.file_url;
      link.setAttribute('download', brochure.title);
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download starting!');
      onClose();
    } catch (e) {
      toast.error('Failed to process download');
      console.error(e);
    }
  };

  const handleBrochureClick = async (brochure: Brochure) => {
    setSelectedBrochure(brochure);
    if (isPreAuthorized) {
      // Lead details already captured, download instantly!
      await executeDownload(brochure);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrochure) {
      toast.error('Please select a brochure to download');
      return;
    }
    if (!leadForm.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!leadForm.phone.trim() || leadForm.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setSubmitting(true);
      // Create Inquiry/Lead
      await inquiriesApi.create({
        name: leadForm.name,
        email: leadForm.email || `${leadForm.phone}@intermost.com`,
        phone: leadForm.phone,
        interested_country: leadForm.country,
        source: 'brochure_download',
        message: `Downloaded brochure: ${selectedBrochure.title} (Country: ${selectedBrochure.country})`,
      });

      // Save lead details locally
      localStorage.setItem('intermost_lead_details', JSON.stringify(leadForm));
      setIsPreAuthorized(true);

      // Trigger download
      await executeDownload(selectedBrochure);
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-150 dark:border-gray-800 w-full max-w-2xl relative z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[550px]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-250 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Panel: Selector */}
          <div className="w-full md:w-1/2 p-6 md:p-8 bg-gray-50 dark:bg-gray-950 border-r border-gray-150 dark:border-gray-850 flex flex-col overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Select Prospectus / Brochure
            </h3>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10">
                <Loader2 className="w-7 h-7 text-primary animate-spin mb-2" />
                <p className="text-xs text-gray-500">Loading catalog...</p>
              </div>
            ) : brochures.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <FileText className="w-10 h-10 text-gray-350 mb-2" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  No brochures available
                </p>
                <p className="text-xs text-gray-500 mt-1">Check back later for downloads.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-3">
                {brochures.map((b) => {
                  const isSelected = selectedBrochure?._id === b._id;
                  return (
                    <button
                      key={b._id}
                      onClick={() => handleBrochureClick(b)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-950/20 border-primary text-primary-900 dark:text-primary-100'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-100/50'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl border mt-0.5 ${
                          isSelected
                            ? 'bg-primary border-primary text-white'
                            : 'bg-gray-50 dark:bg-gray-950 border-gray-150 dark:border-gray-850 text-gray-500'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm leading-tight text-gray-800 dark:text-white truncate">
                          {b.title}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1.5 uppercase font-extrabold tracking-wider">
                          <span>{b.type}</span>
                          <span>•</span>
                          <span>{b.country}</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Lead Capture Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
            {isPreAuthorized ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
                  <Download className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    Ready to Download
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    You have unlocked instant downloads. Click the button below to get the selected file immediately.
                  </p>
                </div>

                {selectedBrochure && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-150 dark:border-gray-850 max-w-xs mx-auto text-left flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-gray-800 dark:text-white truncate">
                        {selectedBrochure.title}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                        {selectedBrochure.country}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => selectedBrochure && executeDownload(selectedBrochure)}
                  disabled={!selectedBrochure}
                  className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 disabled:opacity-50 text-white py-3 rounded-2xl font-bold shadow-lg shadow-primary-500/10 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Document
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-4">
                <div>
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-lg leading-tight">
                    Unlock Free Download
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Provide your contact details to download the official prospectus and university guide immediately.
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={leadForm.name}
                      onChange={(e) => setFormVal('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    WhatsApp Mobile No.
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={leadForm.phone}
                      onChange={(e) => setFormVal('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="e.g. rahul@gmail.com"
                      value={leadForm.email}
                      onChange={(e) => setFormVal('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedBrochure}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 disabled:opacity-50 text-white py-3 rounded-2xl font-bold shadow-lg shadow-primary-500/10 transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Download Now
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  function setFormVal(key: string, value: string) {
    setLeadForm((prev) => ({ ...prev, [key]: value }));
  }
}
