'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { inquiriesApi } from '@/lib/services';
import toast from 'react-hot-toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export default function SubscriptionModal({ isOpen, onClose, initialEmail = '' }: SubscriptionModalProps) {
  const [step, setStep] = useState<'info' | 'otp' | 'success'>('info');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setStep('info');
      setName('');
      setPhone('');
      setOtp('');
      setError('');
    }
  }, [isOpen, initialEmail]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await inquiriesApi.sendSubscriptionOtp(email.trim().toLowerCase(), phone.trim());
      toast.success('Verification code sent to your email!');
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Failed to send verification code. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await inquiriesApi.verifySubscriptionOtp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        country_code: countryCode,
        otp: otp.trim(),
      });
      toast.success('Subscription confirmed! Thank you.');
      setStep('success');
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Invalid or expired OTP. Please check and try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 z-10 p-6 md:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {step === 'info' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary-600 dark:text-primary-400">
                  <Mail className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Join Our Newsletter</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Get updates on MBBS admissions, scholarship details, and guides.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="sub-name" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                    <input
                      id="sub-name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sub-email" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                    <input
                      id="sub-email"
                      type="email"
                      required
                      placeholder="johndoe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sub-phone" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="sub-country-code"
                      aria-label="Country Code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 rounded-xl text-gray-950 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+7">+7 (RU)</option>
                      <option value="+995">+995 (GE)</option>
                      <option value="+998">+998 (UZ)</option>
                      <option value="+1">+1 (US)</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                      <input
                        id="sub-phone"
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-gray-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-750 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : 'Get OTP Code'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary-600 dark:text-primary-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  We sent a 6-digit OTP code to <strong className="text-gray-800 dark:text-gray-200">{email}</strong>.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 text-center">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-3xl font-bold tracking-[8px] py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white outline-none transition-all"
                  />
                </div>

                <div className="flex justify-between items-center text-xs mt-2">
                  <button
                    type="button"
                    onClick={() => setStep('info')}
                    className="text-gray-500 hover:text-primary-600 font-medium"
                  >
                    ← Change details
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-primary-600 hover:text-primary-750 font-semibold"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-750 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Subscribe'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Successful!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                Thank you for subscribing, <strong>{name}</strong>! You will now receive news, admission dates, and blog updates directly in your email.
              </p>

              <button
                onClick={onClose}
                className="mt-8 px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-white transition-colors"
              >
                Done
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
